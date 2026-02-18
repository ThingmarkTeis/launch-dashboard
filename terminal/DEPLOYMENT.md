# Dashboard Deployment Guide

## Local Development

1. **Quick Start**
   ```bash
   ./start.sh
   ```

2. **Manual Start**
   ```bash
   npm install
   npm start
   ```

3. **Development Mode** (with auto-restart)
   ```bash
   npm run dev
   ```

## Production Deployment

### Using PM2

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Start Dashboard**
   ```bash
   pm2 start server.js --name "command-center"
   ```

3. **Configure Auto-Start**
   ```bash
   pm2 startup
   pm2 save
   ```

### Using systemd

1. **Create Service File**
   ```bash
   sudo nano /etc/systemd/system/command-center.service
   ```

2. **Service Configuration**
   ```ini
   [Unit]
   Description=Command Center Dashboard
   After=network.target

   [Service]
   Type=simple
   User=clawdbot
   WorkingDirectory=/home/clawdbot/.openclaw/workspace-website-boss/dashboard
   ExecStart=/usr/bin/node server.js
   Environment=NODE_ENV=production
   Environment=WORKSPACE_PATH=/home/clawdbot/.openclaw/workspace-website-boss
   Restart=on-failure
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```

3. **Enable and Start**
   ```bash
   sudo systemctl enable command-center
   sudo systemctl start command-center
   ```

### Using Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. **Build and Run**
   ```bash
   docker build -t command-center .
   docker run -d \
     -p 3000:3000 \
     -v /home/clawdbot/.openclaw/workspace-website-boss:/workspace \
     -e WORKSPACE_PATH=/workspace \
     --name command-center \
     command-center
   ```

## Nginx Reverse Proxy

1. **Install Nginx**
   ```bash
   sudo apt install nginx
   ```

2. **Configure Site**
   ```nginx
   server {
       listen 80;
       server_name dashboard.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **Enable SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d dashboard.yourdomain.com
   ```

## Security Considerations

### 1. Authentication

Add basic authentication to Nginx:
```bash
sudo apt install apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd admin
```

Update Nginx config:
```nginx
location / {
    auth_basic "Command Center";
    auth_basic_user_file /etc/nginx/.htpasswd;
    proxy_pass http://localhost:3000;
    # ... other proxy settings
}
```

### 2. Environment Variables

Use environment variables for sensitive data:
```bash
export WORKSPACE_PATH=/secure/path
export GITHUB_TOKEN=your_token
```

### 3. File Permissions

Ensure proper permissions:
```bash
chmod 700 /home/clawdbot/.openclaw/workspace-website-boss
chmod 600 .env
```

### 4. Rate Limiting

Add rate limiting to Nginx:
```nginx
limit_req_zone $binary_remote_addr zone=dashboard:10m rate=10r/s;

location / {
    limit_req zone=dashboard burst=20 nodelay;
    # ... other settings
}
```

## Monitoring

### 1. Health Checks

Monitor the health endpoint:
```bash
curl http://localhost:3000/api/health
```

### 2. Logs

View logs:
```bash
# PM2
pm2 logs command-center

# systemd
sudo journalctl -u command-center -f

# Docker
docker logs -f command-center
```

### 3. Uptime Monitoring

Use services like:
- UptimeRobot
- Pingdom
- StatusCake

Configure to check: `https://dashboard.yourdomain.com/api/health`

## Backup

### Agent Data

Regular backups of the workspace:
```bash
#!/bin/bash
BACKUP_DIR="/backups/command-center"
WORKSPACE="/home/clawdbot/.openclaw/workspace-website-boss"
DATE=$(date +%Y%m%d_%H%M%S)

tar -czf "$BACKUP_DIR/workspace_$DATE.tar.gz" -C "$WORKSPACE" .

# Keep only last 7 days
find "$BACKUP_DIR" -name "workspace_*.tar.gz" -mtime +7 -delete
```

Add to crontab:
```bash
0 2 * * * /path/to/backup.sh
```

## Performance Optimization

1. **Enable Gzip Compression** (Nginx)
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. **Cache Static Assets**
   ```nginx
   location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **Use CDN for Assets** (optional)
   - Cloudflare
   - AWS CloudFront
   - Fastly

## Troubleshooting

### Dashboard Not Loading

1. Check server is running:
   ```bash
   systemctl status command-center
   ```

2. Check port is available:
   ```bash
   sudo lsof -i :3000
   ```

3. Check workspace permissions:
   ```bash
   ls -la /home/clawdbot/.openclaw/workspace-website-boss
   ```

### No Data Showing

1. Verify workspace path:
   ```bash
   echo $WORKSPACE_PATH
   ```

2. Check agent data exists:
   ```bash
   ls /home/clawdbot/.openclaw/workspace-website-boss/status/
   ```

3. Check API responses:
   ```bash
   curl http://localhost:3000/api/departments
   ```

### Performance Issues

1. Check system resources:
   ```bash
   htop
   ```

2. Monitor Node.js process:
   ```bash
   pm2 monit
   ```

3. Check for large log files:
   ```bash
   du -sh /home/clawdbot/.openclaw/workspace-website-boss/*
   ```

---

Deploy with confidence. The dashboard is built for reliability and real data.