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
      const updated_user = await this.userRepo.updateOrCreateUser({
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

      if (!updated_user) throw new Error(translate("api.invalid_registration_user", lang));

      const hp = await this.profileServ.recalcHp({ userId: updated_user.id, tx });
      if (hp === null) throw new Error(translate("api.invalid_registration_user", lang));
      const qi = await this.profileServ.recalcQi({ userId: updated_user.id, tx });
      if (qi === null) throw new Error(translate("api.invalid_registration_user", lang));

      const deleted_facts_count = await this.factsRepo.deleteOldFacts({ userId: updated_user.id, tx });
      if (deleted_facts_count === null) throw new Error(translate("api.invalid_registration_user", lang));

      await this.statisticRepo.deleteOldUserDailyStats({ beforeDate: getDaysAgoDate(35), tx });
      await this.missionServ.createDailyMissions({ userId: updated_user.id, tx });
      await this.profileRepo.updateOnline({ userId: updated_user.id, tx });
      return updated_user;
    });
    return updated_user;
  }
}

export const authService = new AuthService();
