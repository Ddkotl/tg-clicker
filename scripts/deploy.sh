#!/bin/bash
set -e  # остановка при любой ошибке

# Переходим в папку
cd /home/admin/www/tg-clicker

# Подгружаем nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Выбираем нужную версию Node
nvm use 24.11.1

# Обновляем код
git pull

# Миграции Prisma
npx prisma migrate deploy
npx prisma generate

# Перезапуск PM2
pm2 restart all
