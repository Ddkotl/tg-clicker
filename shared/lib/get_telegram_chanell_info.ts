import path from "path";
import fs from "fs/promises";

const BOT_TOKEN = process.env.BOT_TOKEN!;
const AVATAR_DIR = path.join(process.cwd(), "public/channel-avatars");

interface TelegramChat {
  id: number;
  title: string;
  invite_link: string;
  img: string; // локальный URL
}

export async function getChannelInfo(channel_id: string): Promise<TelegramChat> {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getChat?chat_id=${channel_id}`);

  const data = await res.json();

  if (!data.ok) {
    throw new Error(data.description);
  }

  const chat = data.result;
  const img = chat.photo ? await getOrDownloadChannelImage(chat.id, chat.photo.big_file_id) : "";

  return {
    id: chat.id,
    title: chat.title,
    invite_link: chat.invite_link,
    img,
  };
}
async function getOrDownloadChannelImage(channelId: number, fileId: string): Promise<string> {
  await fs.mkdir(AVATAR_DIR, { recursive: true });

  const fileName = `${channelId}.jpg`;
  const localPath = path.join(AVATAR_DIR, fileName);
  const publicUrl = `/channel-avatars/${fileName}`;

  // 1. Проверяем, существует ли файл
  try {
    await fs.access(localPath);
    return publicUrl;
  } catch {
    // файла нет — скачиваем
  }

  // 2. Получаем file_path
  const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
  const fileData = await fileRes.json();

  if (!fileData.ok) {
    throw new Error(fileData.description);
  }

  const tgFileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.result.file_path}`;

  // 3. Скачиваем файл
  const imgRes = await fetch(tgFileUrl);
  if (!imgRes.ok) {
    throw new Error("Failed to download channel image");
  }

  const buffer = Buffer.from(await imgRes.arrayBuffer());

  // 4. Сохраняем локально
  await fs.writeFile(localPath, buffer);

  return publicUrl;
}
