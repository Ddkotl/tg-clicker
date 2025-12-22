import { MissionType } from "@/_generated/prisma/enums";
import { ValidationResult } from "@/entities/auth/_vm/telegramAuth";
import { factsRepository } from "@/entities/facts/index.server";
import { profileRepository } from "@/entities/profile/index.server";
import { statisticRepository } from "@/entities/statistics/index.server";
import { userRepository } from "@/entities/user/_repositories/user_repository";
import { missionService } from "@/features/missions/servisces/mission_service";
import { profileService } from "@/features/profile/services/profile_service";
import { translate } from "@/features/translations/server/translate_fn";
import { SupportedLang } from "@/features/translations/translate_type";
import { dataBase } from "@/shared/connect/db_connect";
import { getDaysAgoDate } from "@/shared/lib/date";

export class AuthService {
  constructor(
    private userRepo = userRepository,
    private profileRepo = profileRepository,
    private statisticRepo = statisticRepository,
    private factsRepo = factsRepository,
    private missionServ = missionService,
    private profileServ = profileService,
  ) {}
  async authenticateUser({
    validationResult,
    lang,
    referer_id,
  }: {
    validationResult: ValidationResult;
    lang: SupportedLang;
    referer_id?: string;
  }) {
    const updated_user = await dataBase.$transaction(async (tx) => {
      let user = await this.userRepo.getUserByTelegramId({ telegramId: validationResult.user.id!, tx });

      if (user) {
        user = await this.userRepo.updateUser({
          user: {
            telegram_id: validationResult.user.id!,
            first_name: validationResult.user.first_name,
            last_name: validationResult.user.last_name,
            username: validationResult.user.username,
            language_code: lang,
            allows_write_to_pm: validationResult.user.allows_write_to_pm,
            photo_url: validationResult.user.photo_url,
            auth_date: validationResult?.validatedData?.auth_date,
          },
          tx: tx,
        });
      } else {
        user = await this.userRepo.createUser({
          user: {
            telegram_id: validationResult.user.id!,
            first_name: validationResult.user.first_name,
            last_name: validationResult.user.last_name,
            username: validationResult.user.username,
            language_code: lang,
            allows_write_to_pm: validationResult.user.allows_write_to_pm,
            photo_url: validationResult.user.photo_url,
            auth_date: validationResult?.validatedData?.auth_date,
          },
          referer_id: referer_id,
          tx: tx,
        });
        if (referer_id) {
          const referer = await this.userRepo.getUserByTelegramId({ telegramId: referer_id, tx });
          if (!referer) throw new Error(translate("api.invalid_registration_user", lang));
          const { updated_mission, updated_profile: updated_profile_for_mission } =
            await this.missionServ.updateMissionAndFinish({
              userId: referer.id,
              mission_type: MissionType.INVITE_FRIEND,
              progress: 1,
              tx,
            });
          console.log("updated_mission", updated_mission);
          console.log("updated_profile_for_mission", updated_profile_for_mission);
          if (!updated_mission) throw new Error("updated_mission error");
          if (
            updated_mission?.is_active === false &&
            updated_mission.is_completed === true &&
            updated_profile_for_mission
          ) {
          }
        }
      }

      if (!user) throw new Error(translate("api.invalid_registration_user", lang));

      const hp = await this.profileServ.recalcHp({ userId: user.id, tx });
      if (hp === null) throw new Error(translate("api.invalid_registration_user", lang));
      const qi = await this.profileServ.recalcQi({ userId: user.id, tx });
      if (qi === null) throw new Error(translate("api.invalid_registration_user", lang));

      const deleted_facts_count = await this.factsRepo.deleteOldFacts({ userId: user.id, tx });
      if (deleted_facts_count === null) throw new Error(translate("api.invalid_registration_user", lang));

      await this.statisticRepo.deleteOldUserDailyStats({ beforeDate: getDaysAgoDate(35), tx });
      await this.missionServ.createDailyMissions({ userId: user.id, tx });
      await this.profileRepo.updateOnline({ userId: user.id, tx });
      return user;
    });
    return updated_user;
  }
}

export const authService = new AuthService();
