# 📥 Manual Download & Update Guide from GitHub

## 🎯 Goal
Download the latest code from GitHub without using Git commands (since you have merge conflicts).

---

## 📋 Step-by-Step Instructions

### **Step 1: Download the Latest Code from GitHub**

1. **Open your web browser**
2. **Go to**: https://github.com/mattdotfi/xStocks_pricescreener
3. **Click the green "Code" button** (top right of the file list)
4. **Click "Download ZIP"**
5. **Save the ZIP file** to your Downloads folder

### **Step 2: Extract the ZIP File**

1. **Find the downloaded ZIP** in your Downloads folder
   - File name: `xStocks_pricescreener-claude-token-stock-price-comparison-0uMSp.zip`
2. **Right-click** on the ZIP file
3. **Select "Extract All..."**
4. **Choose a location** (e.g., your Desktop)
5. **Click "Extract"**

### **Step 3: Backup Your Current .env File**

**IMPORTANT:** Don't lose your API key!

1. **Open** your current project folder:
   ```
   C:\Users\teoar\OneDrive\Documents\GitHub\xStocks_pricescreener
   ```
2. **Find the `.env` file** (you might need to show hidden files)
3. **Copy it** to your Desktop as a backup
   - Right-click → Copy
   - Paste on Desktop
   - Rename to `.env.backup`

### **Step 4: Delete Old Project Folder**

1. **Close any running applications** (Command Prompt, VS Code, etc.)
2. **Navigate to**:
   ```
   C:\Users\teoar\OneDrive\Documents\GitHub\
   ```
3. **Delete the `xStocks_pricescreener` folder**
   - Right-click → Delete
   - Confirm deletion

### **Step 5: Move New Files to Project Location**

1. **Open the extracted folder** from Step 2
2. **Rename it** to `xStocks_pricescreener` (remove any extra text)
3. **Move this folder** to:
   ```
   C:\Users\teoar\OneDrive\Documents\GitHub\xStocks_pricescreener
   ```

### **Step 6: Restore Your .env File**

1. **Copy your `.env.backup`** from Desktop
2. **Paste it** into:
   ```
   C:\Users\teoar\OneDrive\Documents\GitHub\xStocks_pricescreener
   ```
3. **Rename** `.env.backup` to `.env`

### **Step 7: Reinstall Dependencies**

**Open Command Prompt:**

1. Press **Windows Key**
2. Type: `cmd`
3. Press **Enter**

**Run these commands:**

```bash
cd C:\Users\teoar\OneDrive\Documents\GitHub\xStocks_pricescreener
npm install
```

Wait for installation to complete (~1-2 minutes).

### **Step 8: Verify the Update**

**Check that you have the latest code:**

1. **Open** the file:
   ```
   C:\Users\teoar\OneDrive\Documents\GitHub\xStocks_pricescreener\lib\priceComparison.ts
   ```

2. **Look for** this line (around line 4):
   ```typescript
   // import { fetchKrakenPrice } from './fetchers/kraken'; // Disabled: xStocks not available on Kraken
   ```

3. **If you see** `// Disabled:` comment → ✅ Update successful!
4. **If you don't see** this comment → ❌ Something went wrong, try again

### **Step 9: Start the Application**

```bash
npm run dev
```

Then open: http://localhost:3000

---

## ✅ What Should Change After Update

### **Before Update (What you had):**
- Kraken errors appearing
- Jupiter "ENOTFOUND quote-api.jup.ag"
- Old code trying to fetch from all 5 sources

### **After Update (What you'll have):**
- ✅ No more Kraken errors (removed from code)
- ✅ Jupiter using new endpoint: `api.jup.ag/swap/v1`
- ✅ Only fetches from: Stock, Bybit, KyberSwap, Jupiter

---

## 🆘 Troubleshooting

### **Problem: Can't find .env file**
**Solution:**
1. In File Explorer, click "View" tab
2. Check "Hidden items"
3. Now you should see `.env`

### **Problem: npm install fails**
**Solution:**
1. Delete `node_modules` folder
2. Delete `package-lock.json` file
3. Run `npm install` again

### **Problem: Still seeing old errors**
**Solution:**
1. Make sure you completely deleted the old folder
2. Make sure you extracted the NEW zip file
3. Check `config/tokens.ts` - Jupiter URL should be `https://api.jup.ag/swap/v1`

---

## 📝 Files You Should Have After Update

```
xStocks_pricescreener/
├── .env (your backup with API key)
├── node_modules/ (after npm install)
├── app/
├── components/
├── config/
│   └── tokens.ts (updated Jupiter endpoint)
├── lib/
│   ├── fetchers/
│   │   ├── bybit.ts
│   │   ├── jupiter.ts (updated)
│   │   ├── kyberswap.ts
│   │   ├── kraken.ts (still exists but not used)
│   │   └── stocks.ts
│   └── priceComparison.ts (Kraken disabled here)
├── types/
├── package.json
└── README.md
```

---

## ⚡ Quick Reference

**Download Latest Code:**
1. Go to GitHub → Download ZIP
2. Extract ZIP
3. Backup .env file
4. Delete old folder
5. Move new folder to project location
6. Restore .env
7. Run `npm install`
8. Run `npm run dev`

---

**Next**: See TESTING_GUIDE.md for what to expect from each API!
