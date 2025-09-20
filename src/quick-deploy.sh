#!/bin/bash

echo "🌽 Quick Deploy THEFMSMKT CMNTYPLX to Vercel"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if in right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found${NC}"
    exit 1
fi

# Install Vercel CLI if needed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

# Check if logged in to Vercel
echo -e "${YELLOW}🔐 Checking Vercel authentication...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}🔑 Please login to Vercel:${NC}"
    vercel login
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Build the project
echo -e "${YELLOW}🔨 Building project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Deploy to production
echo -e "${YELLOW}🚀 Deploying to Vercel...${NC}"
vercel --prod --yes

if [ $? -eq 0 ]; then
    echo -e "${GREEN}"
    echo "✅ SUCCESS! Your THEDMSMKT CMNTYPLX website is now live! 🎉"
    echo "🌽 Malaysian corn delivery app deployed successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Test your live site thoroughly"
    echo "   2. Set up environment variables in Vercel Dashboard if needed"
    echo "   3. Configure custom domain"
    echo "   4. Set up Supabase authentication"
    echo -e "${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi