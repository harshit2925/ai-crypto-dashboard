# 📋 Complete Setup Guide

Follow these steps one by one. Don't skip!

---

## ✅ Step 1: Download & Extract

1. Download the ZIP file
2. Extract it to a folder on your computer
3. Remember the location!

---

## ✅ Step 2: Open in VSCode

1. Open **VSCode**
2. Go to **File → Open Folder**
3. Select the extracted `ai-crypto-dashboard` folder
4. Click **Open**

---

## ✅ Step 3: Update `.env` File

**Open:** `backend/.env`

You'll see:
```
MONGO_URI=mongodb+srv://harshit2925:YOUR_PASSWORD_HERE@crypto-dashboard...
GROQ_API_KEY=your_groq_api_key_here
```

### Replace MongoDB Password

**Find this line:**
```
MONGO_URI=mongodb+srv://harshit2925:YOUR_PASSWORD_HERE@crypto-dashboard...
```

**Replace `YOUR_PASSWORD_HERE` with your actual MongoDB password**

Example:
```
MONGO_URI=mongodb+srv://harshit2925:MySecurePassword123@crypto-dashboard...
```

### Add Groq API Key

**Find this line:**
```
GROQ_API_KEY=your_groq_api_key_here
```

**Replace with your actual Groq API key from:** https://console.groq.com/

Example:
```
GROQ_API_KEY=gsk_1a2b3c4d5e6f7g8h9i0j
```

**Save the file** (Ctrl+S)

---

## ✅ Step 4: Open Terminal in VSCode

**Press:** `Ctrl + `` (backtick key)

OR

**Go to:** Terminal → New Terminal

You should see a terminal at the bottom.

---

## ✅ Step 5: Install Backend Dependencies

**Type this command:**
```bash
cd backend
npm install
```

**Wait for it to finish** (1-2 minutes)

You should see: ✅ `added XXX packages`

---

## ✅ Step 6: Install Frontend Dependencies

**Open a NEW terminal:**
- Click the **+** icon in terminal
- Or press: `Ctrl + Shift + `` (backtick)

**Type:**
```bash
cd frontend
npm install
```

**Wait for it to finish** (1-2 minutes)

You should see: ✅ `added XXX packages`

---

## ✅ Step 7: Run Backend Server

**In backend terminal, type:**
```bash
npm run dev
```

**You should see:**
```
✅ MongoDB Connected
✅ Server running on port 5000
```

**Keep this running!** Don't close it.

---

## ✅ Step 8: Run Frontend Server

**In frontend terminal, type:**
```bash
npm run dev
```

**You should see:**
```
VITE v4.x.x ready in xxx ms
➜  Local: http://localhost:3000
```

---

## ✅ Step 9: Open in Browser

**Open your browser and go to:**
```
http://localhost:3000
```

**You should see your app!** 🎉

---

## 🎯 What You Have Now

```
✅ Backend running on port 5000
✅ Frontend running on port 3000
✅ MongoDB connected
✅ Ready to build features!
```

---

## 📝 How to Add Code

### Add a New Page

1. Create folder: `frontend/src/pages/YourPageName/`
2. Create file: `YourPageName.jsx`
3. Add route to `App.jsx`

### Add a Component

1. Create file: `frontend/src/components/YourComponent.jsx`
2. Import in your page: `import YourComponent from '...'`

### Add Backend API

1. Create file: `backend/routes/yourRoute.js`
2. Add to `server.js`: `app.use('/api/your-endpoint', require('./routes/yourRoute'))`

---

## 🔧 Common Commands

**Start frontend:**
```bash
cd frontend
npm run dev
```

**Start backend:**
```bash
cd backend
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Stop server:**
```
Press Ctrl + C
```

---

## ❌ If Something Goes Wrong

### "npm install fails"
```bash
# Delete node_modules
rm -rf node_modules
# Delete package lock
rm package-lock.json
# Try again
npm install
```

### "Port 3000/5000 already in use"
```bash
# Kill the process or change port in vite.config.js
```

### "MongoDB connection fails"
- Check `.env` file has correct password
- Make sure IP is whitelisted in MongoDB Atlas

### "Module not found"
```bash
# Make sure you're in correct directory
# And npm install was successful
npm install
```

---

## 💡 Pro Tips

1. **Keep terminals open** - One for backend, one for frontend
2. **Auto-save enabled** - Changes are reflected instantly
3. **Use Chrome DevTools** - F12 to debug
4. **Check console** - Errors will show here
5. **VSCode Extensions** - Install useful extensions for coding

---

## ✅ Next Steps

Now you're ready to:

1. ✅ Build pages and components
2. ✅ Create API endpoints
3. ✅ Connect to database
4. ✅ Add AI features
5. ✅ Deploy your app

**Start building!** 🚀

---

## 🆘 Need Help?

1. Check the **README.md** for more details
2. Look at **COMPONENT_TEMPLATE.js** for examples
3. Check browser console for errors (F12)
4. Check terminal for backend errors

---

**You've got this!** 💪
