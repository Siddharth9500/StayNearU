# Quick Start Guide for StayNearU Backend

## Option 1: Local Development (Recommended for beginners)

### Step 1: Install dependencies
```bash
cd backend
npm install
```

### Step 2: Set up MongoDB locally
- Download MongoDB from https://www.mongodb.com/try/download/community
- Install and start MongoDB service
- Or use MongoDB Atlas (cloud):
  - Create account at https://www.mongodb.com/cloud/atlas
  - Create a free cluster
  - Copy connection string

### Step 3: Create `.env` file
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```
MONGODB_ATLAS_URI=your_connection_string_here
JWT_SECRET=your_secret_key_here
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
```

### Step 4: Start development server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## Option 2: Docker (Recommended for production-like setup)

### Step 1: Install Docker
- Download from https://www.docker.com/products/docker-desktop

### Step 2: Start services
```bash
cd backend
docker-compose up
```

This will start:
- MongoDB on localhost:27017
- Backend server on localhost:5000

### Stop services
```bash
docker-compose down
```

---

## Option 3: Railway (Easiest cloud deployment)

### Step 1: Install Railway CLI
```bash
npm install -g railway
```

### Step 2: Login and deploy
```bash
railway login
cd backend
railway init
railway variables
# Add your environment variables
railway up
```

Your backend will be live! 🚀

---

## Testing the Backend

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the `token` from response.

### Get all properties
```bash
curl http://localhost:5000/api/properties
```

### Create a property (as owner - requires token)
```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "1 BHK Near College",
    "property_type": "pg",
    "rent_amount": 8000,
    "address": "123 Main Street",
    "city": "Bangalore",
    "owner_name": "John Doe",
    "owner_phone": "9999999999",
    "owner_email": "john@example.com",
    "facilities": ["WiFi", "AC", "Parking"]
  }'
```

---

## Frontend Integration

Connect your React frontend to the backend:

```javascript
// src/api/config.js
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Or in your fetch calls
const response = await fetch(`${API_BASE_URL}/properties`);
```

Update your API client to point to your backend URL.

---

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running
- Check MONGODB_URI or MONGODB_ATLAS_URI in .env
- Verify database credentials if using Atlas

### "Port 5000 already in use"
- Change PORT in .env file to 5001, 5002, etc.
- Or kill the process using that port

### "SMTP connection error"
- Enable 2-factor authentication in Gmail
- Use App Password instead of Gmail password
- Update SMTP_USER and SMTP_PASS in .env

### "CORS errors in frontend"
- Ensure FRONTEND_URL in .env matches your frontend URL
- For development, use `http://localhost:3000`

---

## Next Steps

1. **Update frontend** to use your backend API
2. **Set up MongoDB Atlas** for cloud database
3. **Configure email service** for notifications
4. **Deploy backend** to production platform
5. **Deploy frontend** to your hosting platform
6. **Connect frontend and backend** URLs

---

## Recommended Deployment Platforms

| Platform | Tier | Database | Cost |
|----------|------|----------|------|
| Railway | 5 GB free/month | MongoDB Atlas Free | Free ($5/month paid) |
| Render | Free tier limited | MongoDB Atlas Free | Free (Paid plans available) |
| Heroku | Discontinued | MongoDB Atlas Free | Paid only |
| AWS EC2 | t3.micro free tier | Free tier | Mostly free (1 year) |
| DigitalOcean | $5/month | MongoDB Atlas Free | $5+/month |

**Best for beginners**: Railway or Render (simple deployment, free tier)

---

## Support & Resources

- Backend API Docs: See README.md
- Deployment Guide: See DEPLOYMENT.md
- Frontend Setup: Check frontend folder
- Issues: Create GitHub issue
- Email: support@staynearU.com

Happy Coding! 🚀
