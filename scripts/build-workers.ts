import * as esbuild from "esbuild";
import { glob } from "glob";

// Получаем все TS воркеры в папке workers
const workerFiles = glob.sync("workers/**/*.ts");

workerFiles.forEach((file) => {
  // Создаём имя выходного файла по пути
  const outfile = "dist/" + file.replace(/^workers\//, "").replace(/\.ts$/, ".js");

  esbuild
    .build({
      entryPoints: [file],
      outfile,
      bundle: true, // объединяет все зависимости
      platform: "node", // для Node.js
      target: ["node20"], // версия Node
      sourcemap: true,
    })
    .catch(() => process.exit(1));
});
