# Deployment Guide for StayNearU Backend

Choose your preferred hosting platform and follow the instructions below.

## 1. Heroku Deployment (Free alternative available)

### Prerequisites
- Heroku account (free tier available)
- Git installed
- Heroku CLI installed

### Steps

1. **Login to Heroku**
```bash
heroku login
```

2. **Create a new app**
```bash
heroku create your-app-name
```

3. **Add MongoDB Atlas**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get your connection string
   - Add to Heroku:
```bash
heroku config:set MONGODB_ATLAS_URI="your_connection_string"
```

4. **Set environment variables**
```bash
heroku config:set JWT_SECRET="your_secret_key"
heroku config:set SMTP_USER="your_email@gmail.com"
heroku config:set SMTP_PASS="your_app_password"
heroku config:set FRONTEND_URL="your_frontend_url"
```

5. **Deploy**
```bash
git push heroku main
```

6. **View logs**
```bash
heroku logs --tail
```

---

## 2. Railway.app Deployment

### Steps

1. **Install Railway CLI**
```bash
npm install -g railway
```

2. **Login**
```bash
railway login
```

3. **Initialize project**
```bash
cd backend
railway init
```

4. **Add MongoDB**
```bash
railway add
# Select MongoDB from options
```

5. **Set environment variables**
```bash
railway variables
# Add JWT_SECRET, SMTP_USER, SMTP_PASS, etc.
```

6. **Deploy**
```bash
railway up
```

---

## 3. Render.com Deployment

### Steps

1. **Push to GitHub** (if not already)
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Go to https://render.com**
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repo
   - Select the backend folder

3. **Configure**
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add environment variables**
   - Go to Environment in dashboard
   - Add all variables from `.env`

5. **Deploy** (automatic on push)

---

## 4. Vercel Deployment

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd backend
vercel
```

3. **Follow prompts** and add environment variables

---

## 5. AWS EC2 Deployment

### Steps

1. **Launch EC2 instance**
   - Ubuntu 22.04 LTS
   - t3.micro (free tier eligible)

2. **SSH into instance**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Clone repository**
```bash
git clone your-repo-url
cd backend
npm install
```

5. **Install PM2** (process manager)
```bash
sudo npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

6. **Set up Nginx** as reverse proxy
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/default
```

7. **Configure Nginx** to forward to localhost:5000

8. **SSL Certificate** (Let's Encrypt)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 6. Google Cloud Run Deployment

1. **Create Dockerfile** (in backend folder)
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

2. **Deploy**
```bash
gcloud run deploy staynearU-backend --source . --platform managed --region us-central1
```

---

## 7. DigitalOcean App Platform

1. Go to https://cloud.digitalocean.com/apps
2. Click "Create Apps"
3. Connect GitHub repo
4. Select backend folder
5. Add environment variables
6. Deploy!

---

## Database Options

### MongoDB Atlas (Recommended - Free)
- Go to https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Add to `MONGODB_ATLAS_URI` environment variable

### Self-hosted MongoDB
- Install MongoDB locally
- Use `MONGODB_URI=mongodb://localhost:27017/staynearU`

---

## Domain Setup

### For custom domain:
1. Buy domain (Namecheap, GoDaddy, etc.)
2. Point DNS to your hosting provider
3. Update `FRONTEND_URL` environment variable

---

## Testing Your Deployment

```bash
# Test health endpoint
curl https://your-app-url/api/health

# Test authentication
curl -X POST https://your-app-url/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test","email":"test@example.com","password":"password123"}'
```

---

## Troubleshooting

### Port already in use
- Change PORT in .env file
- Or kill process: `lsof -i :5000` then `kill -9 PID`

### MongoDB connection error
- Check MONGODB_ATLAS_URI is correct
- Whitelist IP in MongoDB Atlas
- Check credentials

### Email not sending
- Enable "Less secure app access" in Gmail
- Use App Password instead of Gmail password
- Check SMTP credentials

### CORS errors
- Update FRONTEND_URL in environment variables
- Ensure CORS middleware is configured

---

## Monitor Your Application

### With PM2
```bash
pm2 logs
pm2 status
pm2 restart all
```

### With Docker
```bash
docker build -t staynearU-backend .
docker run -p 5000:5000 staynearU-backend
```

---

## Support

For deployment issues, check:
- Environment variables are set correctly
- Database connection string is valid
- Port is accessible
- Firewall rules allow incoming connections
