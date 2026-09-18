# 24/7 Always-On Cloud Deployment Guide: Render.com

Deploy the entire full-stack enterprise operations platform to Render with automatic HTTPS and persistent disk storage so operators can manage sales, stock, and logistics from smartphones 24/7.

---

## Step 1: Push Repository to GitHub
Ensure the project is committed and pushed to your private GitHub repository:
```bash
git add .
git commit -m "feat: complete enterprise operations platform"
git push origin main
```

---

## Step 2: Create Web Service on Render
1. Navigate to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository.
4. Select **Docker** as the Runtime environment.
5. In **Instance Type**, select `Starter` ($7/month) to enable persistent disk mounts.

---

## Step 3: Attach Persistent Disk (CRITICAL)
> [!IMPORTANT]
> To ensure sales, inventory, and database records survive container restarts and updates, you MUST attach a persistent disk.

1. Under **Disks**, click **Add Disk**.
2. **Disk Name**: `enterprise-data`
3. **Mount Path**: `/app/data`
4. **Size**: `10 GB` (or larger as required)

---

## Step 4: Environment Variables
Add the following key-value pairs:
- `ENVIRONMENT`: `production`
- `PORT`: `8000`
- `DATABASE_URL`: `sqlite:////app/data/app.db`

---

## Step 5: Deploy & Access
1. Click **Create Web Service**.
2. Render will build the multi-stage Dockerfile and start the unified server.
3. Once deployed, access your platform via your secure Render URL (e.g. `https://enterprise-ops.onrender.com`).
4. Bookmark the URL on your mobile smartphone home screen for 24/7 access anywhere in the world.
