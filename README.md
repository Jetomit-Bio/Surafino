# 📰 Surafino

Modern **blog / news platform** built with **Next.js (App Router)**, **MariaDB**, **Tailwind CSS**, **PM2 + Nginx**, with full **admin panel**, **authentication**, and **image & video uploads**.

---

## ✨ Features

- 📰 News & blog posts  
- ✍️ Rich text editor (bold, italic, images, videos)  
- 🧑‍💼 Admin panel (`/manager`)  
- 🔐 Authentication using JWT (cookies)  
- 🌙 Light / Dark mode (saved in cookies)  
- 📱 Fully responsive (mobile & desktop)  
- 🚀 Production-ready (PM2 + Nginx + SSL)  
- 🗄️ MariaDB database  

---

## 🧰 Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- MariaDB
- PM2
- Nginx
- Let’s Encrypt (Certbot)

---

## 📦 Requirements

- Ubuntu 22.04+ VPS
- Root or sudo access
- Domain pointing to your VPS IP
- Ports **80** and **443** open

---

## 🚀 Installation (VPS)

### 1️⃣ Clone repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/surafino.git](https://github.com/Jetomit-Bio/Surafino.git
cd surafino
```
2️⃣ Run installer

```
chmod +x installer/install.sh
./installer/install.sh
```

The installer will:

    Install Node.js 20 LTS

    Install Nginx

    Install PM2

    Install Certbot

    Create .env

    Setup MariaDB database

    Import SQL schema

    Configure Nginx

    Generate SSL certificate

    Build and start the app

🔐 Default Admin Account

Username: admin
Password: admin

⚠️ Change the password immediately after first login.
🌍 Access

    Website:
    https://yourdomain.com

    Admin panel:
    https://yourdomain.com/manager

📁 Environment Variables

Created automatically during installation in .env:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

JWT_SECRET=auto_generated_secret
APP_URL=https://yourdomain.com
```

❗ .env is ignored by Git and must never be committed.
🖼️ Uploads (Images & Videos)

Uploaded files are stored in:

public/uploads/

Nginx serves them directly via /uploads/*.

Supported formats:

    Images: JPG, PNG, WEBP

    Videos: MP4, WEBM

🧑‍💼 Admin Panel

Available routes:

/manager
/manager/create
/manager/edit/:id
/manager/users
/manager/users/add

Admin features:

    Create / edit / delete posts

    Upload images & videos

    Manage users

    Logout

🧠 Development

Run locally:

```
npm install
npm run dev
```

Local URL:

```
http://localhost:3000
```
🏗️ Production

Build and start manually:

```
npm run build
pm2 start npm --name surafino -- start
```

Check status:

```
pm2 status
pm2 logs surafino
```

🔒 SSL (HTTPS)

SSL is handled automatically using Certbot.

Manual test:

certbot renew --dry-run

🗂️ Project Structure

```
src/
 ├─ app/            # Pages & routes
 ├─ components/     # UI components
 ├─ lib/            # Database & helpers
public/
 └─ uploads/        # Images & videos
installer/
 ├─ install.sh
 └─ database.sql
```

⚠️ Security Notes

    Change default admin credentials

    Never commit .env

    Keep your VPS updated

    Protect /manager routes

📜 License

MIT License
⭐ Credits

Created by Surafino
Built with ❤️ using Next.js