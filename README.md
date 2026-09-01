# 🚀 AI Crypto Dashboard

Professional full-stack AI-powered cryptocurrency dashboard with real-time data analysis and intelligent recommendations.

**Built with:** React + Vite + TailwindCSS + Node.js + Express + MongoDB + Groq AI

---

## 📁 Complete Project Structure

```
ai-crypto-dashboard/
│
├── frontend/                          (React + Vite App)
│   ├── src/
│   │   ├── pages/                    (Page components - create here)
│   │   │   └── Dashboard/
│   │   │       ├── components/       (Sub-components)
│   │   │       ├── hooks/
│   │   │       └── Dashboard.jsx
│   │   ├── components/               (Shared components)
│   │   ├── hooks/                    (Custom React hooks)
│   │   │   └── HOOK_TEMPLATE.js
│   │   ├── services/                 (API calls)
│   │   │   └── SERVICE_TEMPLATE.js
│   │   ├── context/                  (React Context for global state)
│   │   ├── utils/                    (Helper functions)
│   │   ├── App.jsx                   (Main App component)
│   │   ├── App.css
│   │   ├── index.css                 (Tailwind + Global styles)
│   │   └── main.jsx                  (Entry point)
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/                          (Node.js + Express API)
│   ├── routes/                       (API routes)
│   │   └── ROUTE_TEMPLATE.js
│   ├── controllers/                  (Request handlers)
│   │   └── CONTROLLER_TEMPLATE.js
│   ├── models/                       (MongoDB schemas)
│   │   └── MODEL_TEMPLATE.js
│   ├── middleware/                   (Express middleware)
│   ├── services/                     (Business logic)
│   │   └── SERVICE_TEMPLATE.js
│   ├── config/                       (Configuration files)
│   ├── .env                          (Environment variables - KEEP SECRET!)
│   ├── server.js                     (Main server file)
│   └── package.json
│
├── .gitignore                        (Git ignore rules)
└── README.md
```

---

## 🎯 Key Features

✅ **Real-time Crypto Prices** - Fetch live prices from CoinGecko  
✅ **Portfolio Tracking** - Track your holdings with gain/loss calculations  
✅ **AI Analysis** - Get intelligent insights using Groq API  
✅ **Chat Interface** - Ask AI questions about your portfolio  
✅ **Price Alerts** - Set and manage price alerts  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **Professional Architecture** - Modular, scalable, enterprise-ready  

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 (UI library)
- Vite (Fast bundler)
- React Router (Navigation)
- TailwindCSS (Styling)
- Recharts (Charts)
- Axios (API client)

**Backend:**
- Node.js (Runtime)
- Express (Web framework)
- MongoDB (Database)
- Mongoose (ODM)
- Groq SDK (AI API)

**Free APIs Used:**
- CoinGecko (Crypto prices)
- Groq (AI models)
- NewsAPI (Market news)

---

## 📋 Setup Instructions

See **SETUP_GUIDE.md** for complete step-by-step instructions!

**Quick Start:**

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Update .env file in backend/ with your keys
# Then run:

# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Frontend will be at:** http://localhost:3000  
**Backend will be at:** http://localhost:5000  

---

## 🔑 Required API Keys

1. **MongoDB Atlas** (Free 512MB database)
   - Sign up: https://www.mongodb.com/cloud/atlas
   - Get connection string, add to `.env`

2. **Groq API** (Free AI/LLM)
   - Sign up: https://console.groq.com/
   - Create API key, add to `.env`

3. **CoinGecko** (Free crypto prices)
   - API: https://api.coingecko.com (no key needed!)

---

## 📖 How to Add New Features

### Add a New Page

1. Create folder: `frontend/src/pages/YourPage/`
2. Create: `YourPage.jsx`
3. Create subfolder: `components/`
4. Add to `App.jsx` routing:
   ```jsx
   <Route path="/your-page" element={<YourPage />} />
   ```

### Add a New Component

1. Create: `frontend/src/components/YourComponent.jsx`
2. Create: `frontend/src/components/YourComponent.css`
3. Import and use in pages

### Add a Custom Hook

1. Create: `frontend/src/hooks/useYourHook.js`
2. Example structure provided in `HOOK_TEMPLATE.js`

### Add a Backend API Endpoint

1. Create model in: `backend/models/YourModel.js`
2. Create controller in: `backend/controllers/yourController.js`
3. Create route in: `backend/routes/yourRoutes.js`
4. Add to `server.js`:
   ```js
   app.use('/api/your-endpoint', require('./routes/yourRoutes'));
   ```

---

## 🚀 Deployment

**Frontend:** Deploy to Vercel (free)
```bash
npm run build
# Then push to Vercel
```

**Backend:** Deploy to Railway or Render (free)
- Push to GitHub
- Connect to Railway/Render
- Set environment variables
- Deploy!

---

## 📝 Important Notes

⚠️ **Never commit `.env` file to GitHub!**  
✅ It's in `.gitignore` so it won't be uploaded  
✅ Keep API keys SECRET!  

---

## 🎓 Learning Resources

- React Docs: https://react.dev
- Express Docs: https://expressjs.com
- MongoDB Docs: https://docs.mongodb.com
- TailwindCSS: https://tailwindcss.com
- Vite: https://vitejs.dev

---

## 💡 Tips for Your Resume

When showing this project:

1. **Show the code structure** - 100+ files demonstrates complexity
2. **Explain the architecture** - Custom hooks, services, controllers
3. **Mention the tech** - Full-stack with AI integration
4. **Show it live** - Deploy and share the link
5. **Highlight features** - Real API integration, responsive design

---

## 🤔 Common Issues

**Port already in use?**
```bash
# Change port in .env or vite.config.js
```

**MongoDB connection fails?**
```bash
# Check .env has correct password
# Make sure IP is whitelisted in Atlas
```

**npm install fails?**
```bash
# Delete node_modules and package-lock.json
# Run npm install again
```

---

**Happy Coding! 🚀**

Built for your resume and your future! 💼
