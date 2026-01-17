#!/bin/bash
set -e

echo "=== Surafino Installer ==="

read -p "Domain (example.com): " DOMAIN
read -p "DB Host: " DB_HOST
read -p "DB Port (3306): " DB_PORT
read -p "DB User: " DB_USER
read -sp "DB Password: " DB_PASSWORD
echo
read -p "DB Name: " DB_NAME

JWT_SECRET=$(openssl rand -hex 32)

echo "Installing system packages..."
apt update
apt install -y nginx certbot python3-certbot-nginx mariadb-client nodejs npm

echo "Installing node dependencies..."
npm install
npm run build

echo "Creating .env..."
cat > .env <<EOF
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
JWT_SECRET=$JWT_SECRET
APP_URL=https://$DOMAIN
EOF

echo "Setting up database..."
sed \
  -e "s/{{DB_NAME}}/$DB_NAME/g" \
  installer/database.sql > /tmp/db.sql

mysql \
  -h $DB_HOST \
  -P $DB_PORT \
  -u $DB_USER \
  -p$DB_PASSWORD < /tmp/db.sql

echo "Configuring nginx..."
sed \
  -e "s/{{DOMAIN}}/$DOMAIN/g" \
  installer/nginx.conf.template > /etc/nginx/sites-available/surafino

ln -sf /etc/nginx/sites-available/surafino /etc/nginx/sites-enabled/surafino
nginx -t
systemctl reload nginx

echo "Installing PM2..."
npm install -g pm2
pm2 start npm --name surafino -- start
pm2 save
pm2 startup systemd -u root --hp /root

echo "Requesting SSL certificate..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN

echo "=== INSTALLATION COMPLETE ==="
echo "Admin login:"
echo "  username: admin"
echo "  password: admin"
echo "Please change password immediately!"
