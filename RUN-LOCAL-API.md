# Running the Dashboard API Locally (Without System Node.js)

## Option 1: Using Docker (Recommended)

### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY terminal/package*.json ./
RUN npm install
COPY terminal/ .
EXPOSE 3000
CMD ["node", "server.js"]
```

### 2. Build and Run
```bash
docker build -t dashboard-api .
docker run -d -p 3000:3000 \
  -v /home/clawdbot/.openclaw:/workspace:ro \
  -e WORKSPACE_PATH=/workspace \
  --name dashboard-api \
  dashboard-api
```

## Option 2: Using Node Version Manager (nvm)

### 1. Install nvm (user-level, no sudo needed)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
```

### 2. Install Node.js
```bash
nvm install --lts
nvm use --lts
```

### 3. Run the API
```bash
cd launch-dashboard/terminal
npm install
npm start
```

## Option 3: Using Portable Node.js

### 1. Download Portable Node.js
```bash
cd ~
wget https://nodejs.org/dist/v20.11.0/node-v20.11.0-linux-x64.tar.xz
tar -xf node-v20.11.0-linux-x64.tar.xz
```

### 2. Run with Portable Node
```bash
cd ~/launch-dashboard/terminal
~/node-v20.11.0-linux-x64/bin/npm install
~/node-v20.11.0-linux-x64/bin/node server.js
```

## Option 4: Deploy to Free Cloud Service

### Render.com (Easiest)
1. Fork the repo to your GitHub
2. Sign up at render.com
3. Create new Web Service
4. Connect GitHub repo
5. Set build command: `cd terminal && npm install`
6. Set start command: `cd terminal && npm start`
7. Add environment variable: `WORKSPACE_PATH=/home/clawdbot/.openclaw`

### Railway.app
1. Sign up at railway.app
2. Connect GitHub repo
3. Deploy with one click
4. Add environment variables

## Quick Test Without Backend

The dashboard already works without the backend API!
Just visit: https://thingmarkteis.github.io/launch-dashboard/terminal/

The static version shows:
- All workspace files
- Department status
- Recent activity
- Funnel progress

To update data:
```bash
cd launch-dashboard
./update-dashboard-data.sh
```

## API Endpoints (When Running)

- `http://localhost:3000/api/health` - Health check
- `http://localhost:3000/api/departments` - All departments
- `http://localhost:3000/api/files` - File browser
- `http://localhost:3000/api/funnel` - Funnel metrics
- `http://localhost:3000/api/failures` - Error logs