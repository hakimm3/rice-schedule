# Deploy Rice Transaction App on VPS

## Prerequisites
- Ubuntu/Debian VPS (or similar)
- Domain name (optional but recommended)
- SSH access to your VPS

## Step 1: Connect to Your VPS

```bash
ssh your-username@your-vps-ip
```

## Step 2: Install Node.js

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

## Step 3: Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

## Step 4: Clone/Upload Your Project

**Option A: Using Git**
```bash
cd /var/www/html
git clone YOUR_GITHUB_REPO_URL rice-app
cd rice-app
```

**Option B: Upload via SCP (from your local machine)**
```bash
# From your local machine
cd /var/www/html/hakim/schedule
tar -czf rice-app.tar.gz .
scp rice-app.tar.gz your-username@your-vps-ip:/home/your-username/

# Back on VPS
ssh your-username@your-vps-ip
sudo mkdir -p /var/www/html/rice-app
sudo tar -xzf ~/rice-app.tar.gz -C /var/www/html/rice-app
cd /var/www/html/rice-app
```

## Step 5: Install Dependencies & Build

```bash
npm install
npm run build
```

## Step 6: Create Production Environment File

```bash
nano .env
```

Add this content:
```env
# Database
DB_PATH=/var/www/html/rice-app/data/rice_app.db

# JWT Secret
JWT_SECRET=57f22e71c70c5e7de1a3f7fecb5d9869bf1b3bef1d037234c75469f376175e81

# Server
PORT=3000
NODE_ENV=production

# Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg
```

Save and exit (Ctrl+X, Y, Enter)

## Step 7: Create Data & Uploads Directories

```bash
mkdir -p data uploads
chmod 755 data uploads
```

## Step 8: Start with PM2

```bash
pm2 start dist/app.js --name rice-app
pm2 save
pm2 startup
```

## Step 9: Install & Configure Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/rice-app
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Change this to your domain or VPS IP

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/rice-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 10: Configure Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## Step 11: Install SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal (already set up by certbot)
sudo certbot renew --dry-run
```

## Step 12: Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs rice-app

# Check if app is running
curl http://localhost:3000/api/health
```

Visit your domain: `http://your-domain.com` or `http://your-vps-ip`

## Management Commands

### View Logs
```bash
pm2 logs rice-app
pm2 logs rice-app --lines 100
```

### Restart App
```bash
pm2 restart rice-app
```

### Stop App
```bash
pm2 stop rice-app
```

### Update App
```bash
cd /var/www/html/rice-app
git pull  # if using git
npm install
npm run build
pm2 restart rice-app
```

### Monitor
```bash
pm2 monit
```

## Troubleshooting

### App won't start
```bash
# Check logs
pm2 logs rice-app

# Check if port is in use
sudo lsof -i :3000

# Manually test
cd /var/www/html/rice-app
npm start
```

### Permission issues
```bash
sudo chown -R $USER:$USER /var/www/html/rice-app
chmod -R 755 /var/www/html/rice-app
```

### Nginx errors
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t
```

### Database issues
```bash
# Check database file
ls -la /var/www/html/rice-app/data/

# Check permissions
chmod 644 /var/www/html/rice-app/data/rice_app.db
```

## Backup Strategy

### Manual Backup
```bash
# Backup database
cp /var/www/html/rice-app/data/rice_app.db ~/backup-$(date +%Y%m%d).db

# Backup uploads
tar -czf ~/uploads-backup-$(date +%Y%m%d).tar.gz /var/www/html/rice-app/uploads/
```

### Automated Daily Backup
```bash
# Create backup script
nano ~/backup-rice-app.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR=~/backups
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
cp /var/www/html/rice-app/data/rice_app.db $BACKUP_DIR/db-$DATE.db

# Backup uploads
tar -czf $BACKUP_DIR/uploads-$DATE.tar.gz /var/www/html/rice-app/uploads/

# Keep only last 7 days
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

Make executable:
```bash
chmod +x ~/backup-rice-app.sh
```

Add to crontab (daily at 2 AM):
```bash
crontab -e
```

Add line:
```
0 2 * * * /home/your-username/backup-rice-app.sh >> /home/your-username/backup.log 2>&1
```

## Monitoring & Maintenance

### System Resources
```bash
# Check disk space
df -h

# Check memory
free -h

# Check CPU
top
```

### App Health
```bash
# Check app status
pm2 status

# Check uptime
pm2 list

# Monitor in real-time
pm2 monit
```

## Security Recommendations

1. **Change default passwords** and JWT secret
2. **Enable firewall**: `sudo ufw enable`
3. **Keep system updated**: `sudo apt update && sudo apt upgrade`
4. **Use strong passwords** for SSH
5. **Disable root SSH login**
6. **Set up fail2ban**: `sudo apt install fail2ban`
7. **Regular backups** of database

## Your app is now live! 🎉

Access it at:
- HTTP: `http://your-domain.com` or `http://your-vps-ip`
- HTTPS: `https://your-domain.com` (if SSL configured)
