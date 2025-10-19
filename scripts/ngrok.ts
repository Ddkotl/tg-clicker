import ngrok from "ngrok";
import dotenv from "dotenv";
dotenv.config();
(async function () {
  const token = process.env.NGROK_TOKEN;
  if (!token) {
    console.log("NGROK_TOKEN miss");
    return;
  }
  await ngrok.kill();
  await ngrok.authtoken(token);
  const url = await ngrok.connect(3000);
  console.log(url);
})();
