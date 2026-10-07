# Meridian Render Deployment Guide

This guide walks you through deploying Meridian to Render.

## 🚀 Prerequisites

1. **Render Account** (https://render.com) — sign up if you don't have one
2. **GitHub Repository** with Meridian code pushed
3. **n8n Webhook URL** (from completed N8N_SETUP_GUIDE.md)
4. **Claude API Key** (set up in n8n, not needed in frontend)

---

## 📋 Step 1: Prepare Your Repository

1. **Ensure `.env` is NOT committed** (check `.gitignore` includes `.env`)
   ```bash
   cat .gitignore | grep .env
   # Should output: .env
   ```

2. **Verify `.env.example` is committed** (it should be)
   ```bash
   git status .env.example
   # Should show: tracked
   ```

3. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

---

## 🔗 Step 2: Create Render Service

### Option A: Using Dashboard (Recommended)

1. **Log into Render Dashboard** (https://dashboard.render.com)

2. **Click "New +"** → **"Static Site"**

3. **Configure:**
   - **Name:** `meridian` (or your preference)
   - **GitHub Repository:** Select your Meridian repo
   - **Branch:** `main`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`

4. **Click "Create Static Site"**

5. Render will auto-deploy. Wait for build to complete (usually 2–3 minutes).

### Option B: Using render.yaml (Infrastructure as Code)

1. **Create `render.yaml` in project root** (see below)

2. **Push to GitHub**
   ```bash
   git add render.yaml
   git commit -m "Add Render config"
   git push origin main
   ```

3. **In Render Dashboard:** Click "New +" → "Blueprint" → Connect your GitHub repo

4. Render will read `render.yaml` and deploy

---

## ⚙️ Step 3: Configure Environment Variables

After service is created in Render:

1. **Go to service settings** (Settings tab in Render dashboard)

2. **Scroll to "Environment"**

3. **Add environment variable:**
   - **Key:** `VITE_MERIDIAN_PLAN_WEBHOOK_URL`
   - **Value:** `https://your-n8n-instance.com/webhook/meridian-plan-generator`

4. **Save** — Render will automatically redeploy with new env vars

---

## 📄 render.yaml Configuration File

Create this file in your project root:

```yaml
services:
  - type: static_site
    name: meridian
    buildCommand: npm run build
    staticPublishPath: dist
    branch: main
    envVars:
      - key: VITE_MERIDIAN_PLAN_WEBHOOK_URL
        # You can set this to an empty string here and update in dashboard
        # Or provide the full URL if you don't mind it being in the repo
        value: ""
    autoDeploy: true
    headers:
      - path: /*
        name: X-Frame-Options
        value: DENY
      - path: /*
        name: X-Content-Type-Options
        value: nosniff
      - path: /*
        name: Referrer-Policy
        value: strict-origin-when-cross-origin
```

---

## ✅ Step 4: Configure DNS (Optional)

To use a custom domain (e.g., `meridian.yourdomain.com`):

1. **In Render Dashboard → Settings → Custom Domains**

2. **Add your domain**

3. **Follow DNS instructions** for your registrar

---

## 🔄 Step 5: Verify Deployment

1. **Check Render Dashboard** for service status (should be "Live")

2. **Get your Render URL** (usually `https://meridian.onrender.com`)

3. **Open in browser** and test:
   - Welcome screen loads
   - Complete intake flow
   - Plan generation (should call n8n webhook)
   - Email capture
   - Full plan display

### Troubleshooting Deployment Issues

**Issue: "Build failed"**
- Check Render build logs (Logs tab)
- Ensure `npm run build` runs locally first
- Verify `package.json` has correct build script

**Issue: "Webhook URL not configured"**
- Check environment variable is set in Render dashboard
- Click "Manual Deploy" to redeploy with new env vars
- Wait 2–3 minutes for redeploy

**Issue: "API calls fail in production"**
- Verify `VITE_MERIDIAN_PLAN_WEBHOOK_URL` is set
- Check n8n webhook is accessible from internet (not localhost)
- Verify CORS is enabled on n8n webhook (n8n handles this by default)

---

## 🚨 Security Checklist

- [ ] `.env` is in `.gitignore` (not committed)
- [ ] API keys are NOT in render.yaml or .env.example
- [ ] Environment variables set in Render dashboard only
- [ ] Custom domain configured (if using one)
- [ ] HTTPS enabled (Render does this automatically)
- [ ] No console.error showing API keys in production

---

## 📊 Monitoring & Logs

### View Logs
1. Render Dashboard → Your Service → Logs tab
2. Shows real-time request logs and errors

### Analytics
1. Render Dashboard → Metrics tab
2. Shows CPU, memory, bandwidth, request count

---

## 🔄 Auto-Deploy on Git Push

Render automatically redeploys when you push to `main` branch:

```bash
# Make a change locally
echo "// Updated" >> src/App.jsx

# Commit and push
git add src/App.jsx
git commit -m "Update app"
git push origin main

# Render detects push and redeploys automatically
# Watch Render dashboard Logs tab for build progress
```

---

## 💡 Production Best Practices

1. **Use Environment Variables** for all config (done in render.yaml)

2. **Set Up Branch Protection** in GitHub:
   - Require code review before merging to main
   - Run tests before deploy

3. **Monitor Performance** in Render dashboard:
   - Check memory usage
   - Monitor response times
   - Set up alerts for errors

4. **Enable Error Tracking** (optional):
   - Send errors to Sentry: https://sentry.io
   - Install Sentry SDK and configure

5. **Regular Backups** (if using database later):
   - Export user data periodically
   - Test restore process

---

## 🎯 Next Steps After Deployment

1. **Test in production** at your Render URL
2. **Share link** with beta users
3. **Monitor logs** for errors
4. **Collect user feedback**
5. **Iterate based on feedback**

---

## 📞 Support

- **Render Docs:** https://render.com/docs
- **Render Status:** https://status.render.com
- **GitHub Issues:** Report problems in your repository

---

## 🚀 Summary

You now have Meridian deployed to a public URL:

```
https://meridian.onrender.com
```

**From here:**
- Share with friends/colleagues for feedback
- Set up analytics
- Configure email backend (optional)
- Add user accounts (optional)
- Prepare for public launch
