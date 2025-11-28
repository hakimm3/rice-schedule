#!/bin/bash

# Rice Transaction App - VPS Deployment Script
# Run this script to deploy the app on your current server

set -e

echo "🚀 Deploying Rice Transaction App..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get current directory
APP_DIR=$(pwd)
echo -e "${BLUE}App Directory: $APP_DIR${NC}"

# Step 1: Install PM2 if not installed
echo -e "\n${BLUE}Step 1: Checking PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
else
    echo -e "${GREEN}✓ PM2 already installed${NC}"
fi

# Step 2: Build the app
echo -e "\n${BLUE}Step 2: Building application...${NC}"
npm run build
echo -e "${GREEN}✓ Build complete${NC}"

# Step 3: Create necessary directories
echo -e "\n${BLUE}Step 3: Creating directories...${NC}"
mkdir -p data uploads
chmod 755 data uploads
echo -e "${GREEN}✓ Directories created${NC}"

# Step 4: Stop existing PM2 process if running
echo -e "\n${BLUE}Step 4: Stopping existing process...${NC}"
pm2 delete rice-app 2>/dev/null || true
echo -e "${GREEN}✓ Cleaned up${NC}"

# Step 5: Start with PM2
echo -e "\n${BLUE}Step 5: Starting application with PM2...${NC}"
pm2 start dist/app.js --name rice-app
pm2 save
echo -e "${GREEN}✓ Application started${NC}"

# Step 6: Setup PM2 startup
echo -e "\n${BLUE}Step 6: Configuring PM2 startup...${NC}"
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
echo -e "${GREEN}✓ PM2 startup configured${NC}"

# Step 7: Check status
echo -e "\n${BLUE}Step 7: Checking status...${NC}"
pm2 status

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e ""
echo -e "Your app is running on: ${BLUE}http://localhost:3000${NC}"
echo -e ""
echo -e "Useful commands:"
echo -e "  ${BLUE}pm2 status${NC}        - Check app status"
echo -e "  ${BLUE}pm2 logs rice-app${NC} - View logs"
echo -e "  ${BLUE}pm2 restart rice-app${NC} - Restart app"
echo -e "  ${BLUE}pm2 stop rice-app${NC} - Stop app"
echo -e "  ${BLUE}pm2 monit${NC}         - Monitor app"
echo -e ""
echo -e "To access from internet, configure Nginx (see VPS_DEPLOYMENT.md)"
