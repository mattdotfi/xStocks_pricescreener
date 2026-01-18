# 🚀 Complete Fresh Start Guide - Zero to Running

## 🎯 Goal
Set up the xStocks Price Screener from absolute scratch, even if you've never coded before.

---

## 📋 What You'll Need

### **Required:**
- ✅ Windows PC
- ✅ Internet connection
- ✅ 30 minutes of time

### **Optional but Recommended:**
- ⏳ Twelve Data API key (for stock prices)

---

## 📖 Table of Contents

1. [Install Node.js](#step-1-install-nodejs)
2. [Get the Code](#step-2-get-the-code)
3. [Set Up the Project](#step-3-set-up-the-project)
4. [Get API Key](#step-4-get-api-key-optional)
5. [Run the Application](#step-5-run-the-application)
6. [Test Everything](#step-6-test-everything)
7. [Troubleshooting](#troubleshooting)

---

## Step 1: Install Node.js

### **What is Node.js?**
Node.js lets you run JavaScript code on your computer (not just in browsers).

### **Check if Already Installed:**

1. Press **Windows Key**
2. Type: `cmd`
3. Press **Enter**
4. Type: `node --version`
5. Press **Enter**

**If you see** a version like `v22.21.1` → ✅ Already installed! Skip to Step 2.

**If you see** "node is not recognized" → ❌ Need to install it.

### **Install Node.js:**

1. **Go to**: https://nodejs.org/
2. **Download** the **LTS version** (green button, left side)
   - File name will be like: `node-v22.x.x-x64.msi`
3. **Run the installer**
   - Double-click the downloaded file
   - Click "Next" through all steps (defaults are fine)
   - Click "Install"
   - Wait 2-3 minutes
4. **Restart Command Prompt**
   - Close any open Command Prompt windows
   - Open a new one
5. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```

Should show version numbers like:
```
v22.21.1
10.9.4
```

✅ **Success!** Node.js and npm are installed.

---

## Step 2: Get the Code

### **Option A: Without Git (Easier)**

1. **Open browser** and go to:
   ```
   https://github.com/mattdotfi/xStocks_pricescreener
   ```

2. **Click the green "Code" button** (top right)

3. **Click "Download ZIP"**

4. **Save** to your Downloads folder

5. **Extract the ZIP:**
   - Find the downloaded ZIP file
   - Right-click → "Extract All..."
   - Extract to: `C:\Users\[YourUsername]\Documents\`
   - Click "Extract"

6. **Rename the folder:**
   - Default name: `xStocks_pricescreener-claude-token-stock-price-comparison-0uMSp`
   - Rename to: `xStocks_pricescreener`
   - Final path: `C:\Users\[YourUsername]\Documents\xStocks_pricescreener`

### **Option B: With Git (Advanced)**

**Only if you want to use Git for future updates:**

1. **Install Git:**
   - Download from: https://git-scm.com/download/win
   - Run installer (defaults are fine)
   - Restart Command Prompt

2. **Clone repository:**
   ```bash
   cd C:\Users\[YourUsername]\Documents
   git clone https://github.com/mattdotfi/xStocks_pricescreener.git
   cd xStocks_pricescreener
   git checkout claude/token-stock-price-comparison-0uMSp
   ```

✅ **Success!** You have the code.

---

## Step 3: Set Up the Project

### **3.1: Open Command Prompt in Project Folder**

**Method 1 - Easy:**
1. Open File Explorer
2. Navigate to: `C:\Users\[YourUsername]\Documents\xStocks_pricescreener`
3. Click in the address bar (where it shows the path)
4. Type: `cmd`
5. Press **Enter**
6. Command Prompt opens in this folder!

**Method 2 - Manual:**
1. Press **Windows Key**
2. Type: `cmd`
3. Press **Enter**
4. Type:
   ```bash
   cd C:\Users\[YourUsername]\Documents\xStocks_pricescreener
   ```
5. Press **Enter**

### **3.2: Install Dependencies**

In the Command Prompt, type:

```bash
npm install
```

**What happens:**
- Downloads 400+ packages (libraries the app needs)
- Takes 1-2 minutes
- Shows progress bars
- Creates a `node_modules` folder

**Wait for:**
```
added 417 packages, and audited 418 packages in 30s
found 0 vulnerabilities
```

✅ **Success!** Dependencies installed.

### **3.3: Create Environment File**

**What is .env?**
A file that stores secrets like API keys.

**Create it:**

1. **In the project folder**, find: `.env.example`
2. **Copy** this file
3. **Paste** in same folder
4. **Rename** the copy to: `.env` (remove `.example`)

**Or using Command Prompt:**
```bash
copy .env.example .env
```

✅ **Success!** Environment file created.

---

## Step 4: Get API Key (Optional)

### **Why Do You Need This?**
To fetch real-time stock prices (TSLA, NVDA, SPY, AAPL) from the stock market.

**Without API key:**
- ✅ Crypto prices work (Bybit, KyberSwap, Jupiter)
- ❌ Stock prices won't work

**With API key:**
- ✅ Everything works
- ✅ Can compare crypto vs stock prices

### **Get Free API Key:**

1. **Go to**: https://twelvedata.com/

2. **Sign up:**
   - Click "Get API Key" or "Sign Up"
   - Enter your email
   - Create a password
   - Click "Sign Up"

3. **Verify email:**
   - Check your inbox
   - Click verification link

4. **Get your API key:**
   - Log in to Twelve Data
   - Go to Dashboard
   - Copy your API key (looks like: `a1b2c3d4e5f6...`)

### **Add API Key to .env:**

1. **Open `.env` file** with Notepad:
   - Right-click on `.env`
   - Select "Open with" → "Notepad"

2. **Find this line:**
   ```
   TWELVE_DATA_API_KEY=your_api_key_here
   ```

3. **Replace** `your_api_key_here` with your actual key:
   ```
   TWELVE_DATA_API_KEY=abc123def456ghi789jkl
   ```

4. **Save** the file (Ctrl+S)

5. **Close** Notepad

✅ **Success!** API key configured.

**Note:** Free tier allows 8 requests per minute, which is perfect for our 4 tokens.

---

## Step 5: Run the Application

### **5.1: Start the Server**

In Command Prompt (make sure you're in the project folder):

```bash
npm run dev
```

**What happens:**
- Compiles the code
- Starts a web server
- Takes 10-15 seconds first time

**Wait for:**
```
▲ Next.js 15.5.9
- Local:        http://localhost:3000

✓ Ready in 2s
```

**⚠️ Don't close this window!** Keep it running.

✅ **Success!** Server is running.

### **5.2: Open in Browser**

1. **Open your web browser** (Chrome, Edge, Firefox)
2. **Go to**: `http://localhost:3000`
3. **You should see** the xStocks Price Screener dashboard!

---

## Step 6: Test Everything

### **6.1: First Load**

**What you'll see:**
- Dark-themed dashboard
- Title: "xStocks Price Screener"
- Blue "Refresh Prices" button
- Auto-refresh checkbox
- Empty price cards

### **6.2: Fetch Prices**

1. **Click** the **"Refresh Prices"** button
2. **Wait** 30-40 seconds (shows loading spinner)
3. **Watch** the terminal for progress

**Expected terminal output:**
```
Compiling /api/prices ...
Compiled /api/prices in 1.3s
GET /api/prices 200 in 27597ms
```

### **6.3: Check Results**

**After ~30-40 seconds, you should see:**

#### **TSLAx (Tesla):**
- ✅ **Stock Market**: $435.00 (if API key added)
- ✅ **Bybit**: $435.39
- ⚠️ **KyberSwap**: May show price or 404
- ✅ **Jupiter**: $435.20

#### **NVDAx (Nvidia):**
- ✅ **Stock Market**: Price shown
- ✅ **Bybit**: Price shown
- ⚠️ **KyberSwap**: May show price or 404
- ✅ **Jupiter**: Price shown

#### **SPYx (S&P 500):**
- ✅ **Stock Market**: Price shown
- ❌ **Bybit**: "Not supported symbols" (expected - token doesn't exist there)
- ⚠️ **KyberSwap**: May show price or 404
- ✅ **Jupiter**: Price shown

#### **AAPLx (Apple):**
- ✅ **Stock Market**: Price shown
- ❌ **Bybit**: "Not supported symbols" (expected - token doesn't exist there)
- ⚠️ **KyberSwap**: May show price or 404
- ✅ **Jupiter**: Price shown

### **6.4: Arbitrage Opportunities**

At the top, you should see:
```
Top Arbitrage Opportunities

Buy from: Stock Market at $435.00
Sell to: Bybit at $435.39
Spread: 0.09% | Profit: $0.39 per token
```

✅ **Success!** Everything is working!

---

## 🐛 Troubleshooting

### **Problem: "npm is not recognized"**

**Cause:** Node.js not installed or not in PATH

**Solution:**
1. Install/reinstall Node.js (see Step 1)
2. Restart Command Prompt
3. Try again

### **Problem: "Cannot find module"**

**Cause:** Dependencies not installed

**Solution:**
```bash
cd C:\Users\[YourUsername]\Documents\xStocks_pricescreener
npm install
```

### **Problem: "Port 3000 already in use"**

**Cause:** Server already running or another app using port 3000

**Solution:**
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Or use different port
set PORT=3001
npm run dev
```

### **Problem: "API key not found"**

**Cause:** Didn't add Twelve Data API key

**Solution:**
- This is **optional**
- Crypto prices still work
- To fix: Follow Step 4 to get and add API key

### **Problem: "ENOTFOUND quote-api.jup.ag"**

**Cause:** Outdated code with old Jupiter endpoint

**Solution:**
1. Open `config/tokens.ts`
2. Find line with: `quote-api.jup.ag`
3. Change to: `https://api.jup.ag/swap/v1`
4. Save and restart server

### **Problem: Kraken errors appearing**

**Cause:** Outdated code

**Solution:**
Follow MANUAL_DOWNLOAD_GUIDE.md to get latest code

### **Problem: White screen or errors in browser**

**Cause:** Server not fully started

**Solution:**
1. Wait for "✓ Ready" message in terminal
2. Refresh browser (F5)
3. Check browser console (F12) for errors

### **Problem: Prices not loading**

**Cause:** Network issues or API rate limits

**Solution:**
1. Check internet connection
2. Wait 60 seconds
3. Try "Refresh Prices" again
4. Check terminal for specific errors

---

## 📁 Project Structure

After setup, your folder should look like:

```
xStocks_pricescreener/
├── .env                          ← Your API keys (don't share!)
├── .env.example                  ← Template
├── .next/                        ← Build files (auto-generated)
├── node_modules/                 ← Dependencies (400+ packages)
├── app/
│   ├── page.tsx                  ← Main dashboard
│   ├── layout.tsx                ← App layout
│   ├── globals.css               ← Styles
│   └── api/prices/
│       ├── route.ts              ← API to fetch all prices
│       └── [symbol]/route.ts     ← API for single token
├── components/
│   ├── PriceCard.tsx             ← Shows individual price
│   ├── TokenComparison.tsx       ← Token comparison view
│   └── ArbitrageTable.tsx        ← Shows opportunities
├── config/
│   └── tokens.ts                 ← Token addresses & API endpoints
├── lib/
│   ├── fetchers/
│   │   ├── bybit.ts              ← Bybit API
│   │   ├── jupiter.ts            ← Jupiter API
│   │   ├── kyberswap.ts          ← KyberSwap API
│   │   └── stocks.ts             ← Twelve Data API
│   └── priceComparison.ts        ← Main logic
├── types/
│   └── price.ts                  ← TypeScript types
├── package.json                  ← Project config & dependencies
├── README.md                     ← Project documentation
├── MANUAL_DOWNLOAD_GUIDE.md      ← This guide you're reading
├── TESTING_GUIDE.md              ← What to expect from each API
└── FRESH_START_GUIDE.md          ← Complete setup guide
```

---

## 🎯 Daily Usage

### **Starting the App:**

1. **Open Command Prompt**
2. **Navigate to project**:
   ```bash
   cd C:\Users\[YourUsername]\Documents\xStocks_pricescreener
   ```
3. **Start server**:
   ```bash
   npm run dev
   ```
4. **Open browser**: http://localhost:3000

### **Stopping the App:**

1. **In Command Prompt**, press: `Ctrl + C`
2. **Confirm** with: `Y`
3. **Close** Command Prompt

### **Updating the Code:**

**With Git:**
```bash
git pull origin claude/token-stock-price-comparison-0uMSp
npm install
```

**Without Git:**
Follow MANUAL_DOWNLOAD_GUIDE.md

---

## 🚀 Next Steps

### **Customize the App:**

1. **Add more tokens:**
   - Edit `config/tokens.ts`
   - Add new token addresses

2. **Change refresh interval:**
   - Edit `app/page.tsx`
   - Find: `setInterval(() => { fetchPrices(); }, 60000)`
   - Change `60000` to desired milliseconds

3. **Modify UI:**
   - Edit files in `components/` folder
   - Change colors in `app/globals.css`

### **Deploy Online:**

1. **Sign up** for Vercel: https://vercel.com
2. **Connect** GitHub repository
3. **Add** environment variables
4. **Deploy** with one click

---

## 📚 Additional Resources

### **Guides:**
- **MANUAL_DOWNLOAD_GUIDE.md** - Update code without Git
- **TESTING_GUIDE.md** - What to expect from each API
- **FRESH_START_GUIDE.md** - This guide

### **API Documentation:**
- **Bybit**: https://bybit-exchange.github.io/docs/v5/intro
- **Jupiter**: https://dev.jup.ag/api-reference/swap/quote
- **KyberSwap**: https://docs.kyberswap.com/
- **Twelve Data**: https://twelvedata.com/docs

### **Learning Resources:**
- **Next.js**: https://nextjs.org/docs
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## ✅ Success Checklist

Complete this checklist to confirm everything works:

- [ ] Node.js installed (v18+)
- [ ] npm installed
- [ ] Code downloaded and extracted
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created
- [ ] Twelve Data API key added (optional)
- [ ] Server starts without errors (`npm run dev`)
- [ ] Dashboard opens at http://localhost:3000
- [ ] "Refresh Prices" button works
- [ ] At least some prices show up
- [ ] Arbitrage opportunities appear
- [ ] No critical errors in terminal

---

## 🎉 Congratulations!

You've successfully set up the xStocks Price Screener from scratch!

**What you can do now:**
- ✅ Compare tokenized stock prices across exchanges
- ✅ Find arbitrage opportunities
- ✅ Monitor prices in real-time
- ✅ Auto-refresh every 60 seconds

**Remember:**
- Keep the terminal window open while using the app
- Stock prices only update during market hours
- Crypto prices are 24/7
- Some tokens won't be on all exchanges (that's normal)

---

**Need help?** Check the other guides or the error messages in terminal for specific issues.

**Happy trading! 📈💰**
