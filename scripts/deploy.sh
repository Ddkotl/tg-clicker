#!/bin/bash
set -e  # Останавливает скрипт при любой ошибке
set -o pipefail

echo "=== DEPLOY START: $(date) ==="

export NVM_DIR="$HOME/.nvm"
# загружаем nvm если он существует
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
else
  echo "ERROR: NVM not found!"
  exit 1
fi

echo "Using Node version:"
nvm use 24

cd ~/www/tg-clicker

echo "--- PRISMA MIGRATE ---"
npx prisma migrate deploy 

echo "--- PRISMA GENERATE ---"
npx prisma generate 

echo "--- PM2 RESTART ---"
pm2 restart all

echo "=== DEPLOY FINISHED: $(date) ==="
