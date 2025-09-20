#!/bin/bash

# 🌽 THEFMSMKT CORNMAN - Vercel Deployment Script
# Run this script to deploy your food delivery app to Vercel

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ASCII Art
echo -e "${GREEN}"
echo "  ████████╗██╗  ██╗███████╗███████╗███╗   ███╗███████╗███╗   ███╗██╗  ██╗████████╗"
echo "  ╚══██╔══╝██║  ██║██╔════╝██╔════╝████╗ ████║██╔════╝████╗ ████║██║ ██╔╝╚══██╔══╝"
echo "     ██║   ███████║█████╗  █████╗  ██╔████╔██║███████╗██╔████╔██║█████╔╝    ██║   "
echo "     ██║   ██╔══██║██╔══╝  ██╔══╝  ██║╚██╔╝██║╚════██║██║╚██╔╝██║██╔═██╗    ██║   "
echo "     ██║   ██║  ██║███████╗██║     ██║ ╚═╝ ██║███████║██║ ╚═╝ ██║██║  ██╗   ██║   "
echo "     ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   "
echo -e "${NC}"
echo -e "${BLUE}🌽 CORNMAN - Gourmet Corn Delivery Malaysia 🇲🇾${NC}"
echo -e "${YELLOW}Deploying to Vercel...${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Make sure you're in the project root directory.${NC}"
    exit 1
fi

# Verify project name
if ! grep -q "thefmsmkt-cornman" package.json; then
    echo -e "${YELLOW}⚠️  Warning: This doesn't appear to be the THEFMSMKT project.${NC}"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Pre-deployment checks
echo -e "${BLUE}🔍 Running pre-deployment checks...${NC}"

# Check if TypeScript compiles
echo -e "${YELLOW}📝 Checking TypeScript...${NC}"
if ! npx tsc --noEmit; then
    echo -e "${RED}❌ TypeScript errors found. Please fix them before deploying.${NC}"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install Vercel CLI. Please install manually:${NC}"
        echo -e "${YELLOW}npm install -g vercel${NC}"
        exit 1
    fi
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies.${NC}"
        exit 1
    fi
fi

# Build the project
echo -e "${YELLOW}🔨 Building the project...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Please fix the errors and try again.${NC}"
    exit 1
fi

# Check build output
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build output directory 'dist' not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"

# Show environment variables reminder
echo -e "${YELLOW}⚠️  IMPORTANT: Make sure you have set these environment variables in Vercel Dashboard:${NC}"
echo -e "${BLUE}   • VITE_SUPABASE_URL${NC}"
echo -e "${BLUE}   • VITE_SUPABASE_ANON_KEY${NC}"
echo ""

# Confirm deployment
read -p "Ready to deploy to Vercel? (Y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo -e "${YELLOW}Deployment cancelled.${NC}"
    exit 0
fi

# Deploy to Vercel
echo -e "${YELLOW}🚀 Deploying to Vercel...${NC}"
echo -e "${BLUE}This will take 2-3 minutes...${NC}"

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deployment successful! 🎉${NC}"
    echo ""
    echo -e "${GREEN}🌽 Your THEFMSMKT CORNMAN app is now live!${NC}"
    echo ""
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo -e "${BLUE}   1. ✅ Set up environment variables in Vercel Dashboard${NC}"
    echo -e "${BLUE}   2. ✅ Update Supabase Site URL with your Vercel URL${NC}"
    echo -e "${BLUE}   3. ✅ Configure OAuth redirect URLs for Google/Facebook${NC}"
    echo -e "${BLUE}   4. ✅ Test all features on production${NC}"
    echo -e "${BLUE}   5. ✅ Set up custom domain (optional)${NC}"
    echo ""
    echo -e "${GREEN}🔗 Vercel Dashboard: https://vercel.com/dashboard${NC}"
    echo -e "${GREEN}🔗 Supabase Dashboard: https://app.supabase.com${NC}"
    echo ""
    echo -e "${YELLOW}Happy corn delivering! 🌽🚀${NC}"
else
    echo -e "${RED}❌ Deployment failed. Please check the errors above.${NC}"
    echo ""
    echo -e "${YELLOW}Common solutions:${NC}"
    echo -e "${BLUE}   • Check if you're logged in to Vercel: vercel login${NC}"
    echo -e "${BLUE}   • Clear cache: rm -rf node_modules package-lock.json && npm install${NC}"
    echo -e "${BLUE}   • Check TypeScript errors: npx tsc --noEmit${NC}"
    exit 1
fi