#!/bin/bash
set -euo pipefail
exec > >(tee -i logs/deploy.log) 2>&1   # Все stdout и stderr пишем в лог

echo "=== DEPLOY START: $(date) ==="

cd /home/admin/www/tg-clicker || exit 1

# Подгружаем NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use 24.11.1 || { echo "NVM failed"; exit 1; }

# Prisma
npx prisma migrate deploy || { echo "Prisma migrate failed"; exit 1; }
npx prisma generate || { echo "Prisma generate failed"; exit 1; }

# PM2
pm2 restart all || { echo "PM2 restart failed"; exit 1; }

echo "=== DEPLOY FINISH: $(date) ==="
