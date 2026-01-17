#!/bin/bash
set -e

echo "=============================="
echo "  Surafino Installer"
echo "=============================="

# -------- INPUT --------
read -p "Domain (example.com): " DOMAIN
read -p "DB Host (127.0.0.1): " DB_HOST
DB_HOST=${DB_HOST:-127.0.0.1}

read -p "DB Port (3306): " DB_PORT
DB_PORT=${DB_PORT:-3306}

read -p "DB User: " DB_USER
read -sp "DB Password: " DB_PASSWORD
echo
read -p "DB Name: " DB_NAME

JWT_SECRET=$(openssl rand -hex 32)

echo "== Installing system packages =="
apt update
apt install -y nginx certbot python3-certbot-nginx mariadb-client curl ca-certificates

echo "== Installing Node.js 20 LTS =="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo "== Node version =="
node -v
npm -v

echo "== Installing dependencies =="
npm install

echo "== Building app =="
npm run build

echo "== Creating .env =="
cat > .env <<EOF
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME

JWT_SECRET=$JWT_SECRET
APP_URL=https://$DOMAIN
EOF

echo "== Setting up database =="
sed \
  -e "s/{{DB_NAME}}/$DB_NAME/g" \
  installer/database.sql > /tmp/surafino.sql

mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" < /tmp/surafino.sql

echo "== Configuring NGINX =="
sed \
  -e "s/{{DOMAIN}}/$DOMAIN/g" \
  installer/nginx.conf.template > /etc/nginx/sites-available/surafino

ln -sf /etc/nginx/sites-available/surafino /etc/nginx/sites-enabled/surafino
nginx -t
systemctl reload nginx

echo "== Installing PM2 =="
npm install -g pm2
pm2 start npm --name surafino -- start
pm2 save
pm2 startup systemd -u root --hp /root

echo "== Installing SSL (Let's Encrypt) =="
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m admin@"$DOMAIN" || true

echo "=============================="
echo " INSTALLATION COMPLETE "
echo "=============================="
echo " Admin login:"
echo "   username: admin"
echo "   password: admin"
echo " !!! CHANGE PASSWORD IMMEDIATELY !!!"
