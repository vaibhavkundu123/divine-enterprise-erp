# 24/7 Production Self-Hosted Cloud VPS Guide (DigitalOcean / Hetzner / AWS EC2)

Deploy the enterprise operations platform to any Ubuntu 22.04 / 24.04 Linux server with automated SSL certificates, background systemd supervision, and continuous uptime.

---

## 1. Initial Server Setup
Connect to your server via SSH:
```bash
ssh ubuntu@YOUR_SERVER_IP
```

Update packages and install dependencies:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-venv python3-pip git curl caddy
```

---

## 2. Clone Repository & Setup Virtual Environment
```bash
sudo mkdir -p /opt/enterprise-ops
sudo chown ubuntu:ubuntu /opt/enterprise-ops
git clone https://github.com/your-username/your-repo.git /opt/enterprise-ops
cd /opt/enterprise-ops

# Setup Python environment
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt

# Initialize database
python -m backend.app.db.init_db
```

---

## 3. Configure Systemd Service
Copy the included service file:
```bash
sudo cp /opt/enterprise-ops/deploy/enterprise-ops.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable enterprise-ops
sudo systemctl start enterprise-ops
sudo systemctl status enterprise-ops
```

---

## 4. Setup Automated HTTPS with Caddy
Edit the Caddyfile with your custom domain:
```bash
sudo cp /opt/enterprise-ops/deploy/Caddyfile /etc/caddy/Caddyfile
sudo nano /etc/caddy/Caddyfile  # replace ops.yourdomain.com with your actual domain
sudo systemctl reload caddy
```

Caddy will automatically provision and renew Let's Encrypt SSL certificates for your domain!
Now visit your domain from any computer or smartphone 24/7!
