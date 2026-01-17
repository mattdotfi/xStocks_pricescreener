# 📋 Command Reference

## Essential Commands

### Start the Application
```bash
# Easy way (recommended)
./START.sh

# Manual way
npm run dev
```

### Edit Environment Variables
```bash
# Using nano (beginner-friendly)
nano .env

# Using vim (advanced)
vim .env

# View current .env content
cat .env
```

### Check Installation
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check if dependencies are installed
ls node_modules | wc -l
```

### Build and Production
```bash
# Build for production
npm run build

# Start production server (after building)
npm start

# Build and start
npm run build && npm start
```

### Dependency Management
```bash
# Install all dependencies
npm install

# Install a new package
npm install package-name

# Update all dependencies
npm update

# Clean install (removes node_modules first)
rm -rf node_modules package-lock.json
npm install
```

### Troubleshooting
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Clear Next.js cache
rm -rf .next

# Full clean and reinstall
rm -rf node_modules .next package-lock.json
npm install

# Check for errors in build
npm run build 2>&1 | less
```

### Project Information
```bash
# View package.json
cat package.json

# List all available npm scripts
npm run

# View dependency tree
npm list --depth=0

# Check for outdated packages
npm outdated
```

### Logs and Debugging
```bash
# Run with verbose logging
npm run dev -- --turbo

# Check build output
npm run build

# View environment variables (be careful with sensitive data!)
cat .env
```

## Git Commands (if needed)

```bash
# Check current status
git status

# View recent changes
git log --oneline -5

# Pull latest changes
git pull origin claude/token-stock-price-comparison-0uMSp

# See what changed
git diff
```

## Quick Tests

### Test API Endpoints
```bash
# After starting the server, in a new terminal:

# Test all prices endpoint
curl http://localhost:3000/api/prices

# Test specific token
curl http://localhost:3000/api/prices/TSLA
```

### Check File Structure
```bash
# View project structure
tree -L 2 -I 'node_modules|.next'

# Or without tree command
find . -type d -maxdepth 2 | grep -v node_modules | grep -v .next | grep -v .git
```

## Port Management

```bash
# Check what's running on port 3000
lsof -i :3000

# Kill specific process
kill -9 <PID>

# Use different port
PORT=3001 npm run dev
```

## Environment Variables

```bash
# Create .env from example
cp .env.example .env

# Backup current .env
cp .env .env.backup

# Restore from backup
cp .env.backup .env
```

## Helpful Aliases (Optional - add to ~/.bashrc or ~/.zshrc)

```bash
# Add these to your shell config for quick access
alias xstocks-dev='cd /home/user/xStocks_pricescreener && ./START.sh'
alias xstocks-build='cd /home/user/xStocks_pricescreener && npm run build'
alias xstocks-logs='cd /home/user/xStocks_pricescreener && tail -f .next/trace'
```

## Most Used Commands (in order)

1. `./START.sh` - Start the app
2. `nano .env` - Edit API key
3. `npm run dev` - Manual start
4. `npm run build` - Test build
5. `lsof -ti:3000 | xargs kill -9` - Kill server

---

**Pro Tip:** Open two terminal windows:
- Window 1: Run `./START.sh` (server)
- Window 2: Run commands and tests
