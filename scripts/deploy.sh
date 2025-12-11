#!/bin/bash
#set -euo pipefail
#exec > >(tee -i deploy.log) 2>&1

echo "=== DEPLOY START: $(date) ==="

#cd /home/admin/www/tg-clicker
#export NVM_DIR="$HOME/.nvm"
#[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

#echo "Using node version:"
##nvm use 24.11.1

#echo "Running Prisma migrate..."
#npx prisma migrate deploy

#echo "Generating Prisma client..."
#npx prisma generate

#echo "Restarting PM2..."
#pm2 restart all

#echo "=== DEPLOY FINISH: $(date) ==="
