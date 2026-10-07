# NEXT STEPS: HOW TO LAUNCH MERIDIAN

## 🚀 Three Paths Forward

Choose your path based on your immediate goal:

---

## PATH 1: Test MVP with Mock Data (No Setup Required) ⚡

**Best for:** Experiencing the full user journey immediately

### Steps:
1. Open terminal in `c:\Users\Sheba\Downloads\Meridian`
2. Create `.env` file:
   ```bash
   echo VITE_USE_MOCK_DATA=true > .env
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173/
5. Click "Let's go" and flow through all screens

### What You'll Experience:
- ✅ Full 5-section intake form
- ✅ Animated plan generation
- ✅ Personalized 30/60/90 roadmap
- ✅ Daily check-in experience
- ✅ Pro upgrade card

**Time to launch:** < 5 minutes

---

## PATH 2: Deploy to Render (Production) 🌐

**Best for:** Going live and sharing with users

### Prerequisites:
- GitHub account (free)
- Render account (free)
- GitHub repository created

### Steps:

#### 1. Push to GitHub
```bash
cd c:\Users\Sheba\Downloads\Meridian
git init
git add .
git commit -m "Meridian MVP initial commit"
git remote add origin https://github.com/YOUR-USERNAME/meridian.git
git push -u origin main
```

#### 2. Deploy to Render
1. Go to https://render.com
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Build command: `npm run build` (auto-detected)
5. Publish directory: `dist/` (auto-detected)
6. Click "Create Static Site"
7. Render reads `render.yaml` and deploys automatically

#### 3. Set Environment (Optional for Mock Data)
1. In Render dashboard, go to "Environment"
2. Add variable: `VITE_USE_MOCK_DATA` = `true` (for testing)
   OR
2. Add variable: `VITE_MERIDIAN_PLAN_WEBHOOK_URL` = `https://...` (for real API)

#### 4. Deploy
- Render automatically deploys
- Watch logs at dashboard
- Your app lives at `https://meridian-XXXX.onrender.com`

**Time to launch:** 10–15 minutes

---

## PATH 3: Set Up n8n Webhook (Full Integration) 🤖

**Best for:** Real AI plan generation with Claude

### Prerequisites:
- n8n account (free at n8n.cloud or self-hosted)
- Anthropic Claude API key (free at claude.ai/account)

### Steps:

#### 1. Get Claude API Key
1. Go to https://console.anthropic.com
2. Sign up (free)
3. Create API key
4. Copy key (you'll need it)

#### 2. Set Up n8n Workflow
1. Go to https://app.n8n.cloud (or your n8n instance)
2. Create new workflow
3. Follow [N8N_SETUP_GUIDE.md](./N8N_SETUP_GUIDE.md) step-by-step
4. Copy the workflow JSON provided in the guide
5. Test with cURL (see guide for examples)
6. Get your webhook URL

#### 3. Configure Meridian
1. Create `.env` file:
   ```bash
   echo VITE_MERIDIAN_PLAN_WEBHOOK_URL=https://YOUR_N8N_WEBHOOK_URL > .env
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
3. Test the full flow (intake → plan generation)

#### 4. Deploy to Render
1. Push code to GitHub
2. Deploy to Render (same as PATH 2)
3. In Render, set environment variable: `VITE_MERIDIAN_PLAN_WEBHOOK_URL`

**Time to launch:** 30 minutes (n8n setup + test + deploy)

---

## 🎯 RECOMMENDED APPROACH

For fastest launch:

### Week 1: Test & Gather Feedback
1. **Day 1:** Launch with PATH 1 (mock data)
2. **Days 2–7:** Share link with 5–10 beta users
3. **Collect:** Form feedback, pain points, suggestions

### Week 2: Deploy & Integrate
1. **Deploy:** Use PATH 2 (Render)
2. **Integrate:** Use PATH 3 (n8n + Claude)
3. **Test:** Full end-to-end with real API

### Week 3+: Phase 2
1. User accounts (Supabase)
2. Email delivery
3. Analytics tracking

---

## 📋 PRE-LAUNCH CHECKLIST

### Before Testing (PATH 1)
- [ ] Clone/open repository
- [ ] Verify `node_modules/` exists (run `npm install` if needed)
- [ ] Create `.env` with mock data flag
- [ ] Start dev server
- [ ] Test at http://localhost:5173/

### Before Deploying (PATH 2)
- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Repository connected
- [ ] Environment variables configured
- [ ] Deployment succeeds (check logs)
- [ ] Production URL works

### Before Using Real API (PATH 3)
- [ ] n8n workflow created and tested
- [ ] Claude API key added to n8n
- [ ] Webhook URL copied
- [ ] `.env` configured locally
- [ ] Full flow tested (intake → plan)
- [ ] Error handling verified
- [ ] Deployed to Render with webhook URL

---

## 🐛 TROUBLESHOOTING

### "npm install failed"
```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
```

### "Dev server won't start"
```bash
# Make sure port 5173 is free
npm run dev
# If still fails, try different port:
npm run dev -- --port 3000
```

### "Render deployment failed"
- Check logs in Render dashboard
- Verify `render.yaml` exists
- Ensure `npm run build` works locally
- Check environment variables are set

### "n8n webhook not responding"
- Verify n8n workflow is active (green checkmark)
- Test webhook with cURL (see N8N_SETUP_GUIDE.md)
- Check n8n logs for errors
- Verify Claude API key is valid

### "Plan generation times out"
- Default is 180 seconds
- Check if n8n workflow is slow
- Can increase timeout in `src/services/meridianApi.js`
- Use mock data for testing without delays

---

## 📚 DOCUMENTATION BY PATH

### For PATH 1 (Mock Data Testing)
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) — Complete test scenarios
- [README.md](./README.md) — Installation & quick start

### For PATH 2 (Render Deployment)
- [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) — Step-by-step guide
- [README.md](./README.md) — Overview

### For PATH 3 (n8n Integration)
- [N8N_SETUP_GUIDE.md](./N8N_SETUP_GUIDE.md) — Complete n8n workflow
- [README.md](./README.md) — API configuration

---

## ⏱️ TIME ESTIMATES

| Task | Time | Difficulty |
|------|------|------------|
| Test with mock data | 5 min | Easy |
| Deploy to Render | 15 min | Easy |
| Set up n8n | 30 min | Medium |
| Full end-to-end | 1 hour | Medium |
| Share with users | 5 min | Easy |
| Gather feedback | 1 week | Varies |

---

## 🎯 SUCCESS CRITERIA

### Testing (PATH 1)
- ✅ Welcome screen loads
- ✅ All 5 form sections work
- ✅ Back navigation preserves data
- ✅ Plan generates with mock data
- ✅ Email capture works
- ✅ Full plan displays
- ✅ Daily check-in loads

### Deployment (PATH 2)
- ✅ App loads at Render URL
- ✅ All features work same as local
- ✅ No console errors
- ✅ Mobile layout responsive

### Integration (PATH 3)
- ✅ n8n webhook accepts request
- ✅ Claude generates plan
- ✅ Response normalizes correctly
- ✅ Plan displays to user
- ✅ Timeout works (180s)

---

## 🚀 LAUNCH COMMAND REFERENCE

### Start Dev Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Push to GitHub
```bash
git add .
git commit -m "message"
git push origin main
```

### Enable Mock Data
```bash
echo VITE_USE_MOCK_DATA=true > .env
```

### Configure Webhook
```bash
echo VITE_MERIDIAN_PLAN_WEBHOOK_URL=https://... > .env
```

---

## 📞 QUICK LINKS

- **Repo:** c:\Users\Sheba\Downloads\Meridian
- **Dev Server:** http://localhost:5173/
- **n8n Docs:** https://docs.n8n.io/
- **Claude API:** https://console.anthropic.com
- **Render:** https://render.com
- **GitHub:** https://github.com

---

## ✅ YOU'RE READY!

Choose your path above and follow the steps. Each path takes 5–30 minutes.

**All code is production-ready. All documentation is complete. Go launch! 🚀**

---

*Questions? Check [README.md](./README.md), [TESTING_GUIDE.md](./TESTING_GUIDE.md), or the relevant setup guide.*

**Status: ✅ READY TO SHIP**
