# 24/7 Cloud Deployment Guide: Railway.app

Railway provides ultra-fast Docker-based cloud container hosting with one-click persistent volume attachments.

---

## 1. Quick Deploy via Railway CLI or Web
1. Login to [railway.app](https://railway.app).
2. Click **New Project** ➔ **Deploy from GitHub repo**.
3. Select your repository. Railway will detect the `Dockerfile` automatically.

---

## 2. Add Persistent Volume (CRITICAL)
1. In the project canvas, click on your service.
2. Select **Settings** ➔ **Volumes**.
3. Click **Add Volume**.
4. Set Mount Path to: `/app/data`
5. Click **Save**.

---

## 3. Environment Variables & Networking
1. Under **Variables**, add:
   - `PORT`: `8000`
   - `ENVIRONMENT`: `production`
   - `DATABASE_URL`: `sqlite:////app/data/app.db`
2. Under **Settings** ➔ **Networking**, click **Generate Domain** to get a public HTTPS address (e.g. `https://enterprise-ops-production.up.railway.app`).

---

## 4. Mobile Home Screen Shortcut
On iOS Safari or Android Chrome, open your Railway URL, tap **Share / Options**, and select **Add to Home Screen** for a native app experience!
