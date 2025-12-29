# StayNearU Backend - Complete Setup

## Overview
A full-stack Node.js/Express backend for the StayNearU student accommodation platform with MongoDB database, JWT authentication, and comprehensive API endpoints.

## What's Included

### 📁 Project Structure
```
backend/
├── server.js                    # Main server entry point
├── package.json                 # Dependencies and scripts
├── .env.example                 # Environment variables template
├── docker-compose.yml           # Docker configuration
├── Dockerfile                   # Docker image
├── Procfile                     # Heroku deployment
├── app.yaml                     # Google Cloud Run config
├── 
├── config/
│   └── database.js             # MongoDB connection
├── 
├── models/
│   ├── User.js                 # User schema
│   ├── Property.js             # Property schema
│   ├── Review.js               # Review schema
│   └── Wishlist.js             # Wishlist schema
├── 
├── routes/
│   ├── authRoutes.js           # Auth endpoints
│   ├── propertyRoutes.js       # Property endpoints
│   ├── reviewRoutes.js         # Review endpoints
│   ├── wishlistRoutes.js       # Wishlist endpoints
│   └── contactRoutes.js        # Contact/inquiry endpoints
├── 
├── middleware/
│   └── auth.js                 # JWT authentication & authorization
├── 
├── README.md                    # Project documentation
├── QUICKSTART.md               # Quick start guide
├── DEPLOYMENT.md               # Deployment instructions
└── API_DOCUMENTATION.md        # Complete API reference
```

## Features Implemented

### ✅ Authentication
- User registration (student/owner/admin roles)
- JWT-based login
- Profile management
- Role-based access control

### ✅ Property Management
- List properties with pagination
- Create/update/delete properties (owners only)
- Filter by city, type, price range
- View count tracking
- Property verification status

### ✅ Reviews & Ratings
- Create/update/delete reviews
- Automatic rating calculation
- User verification badges
- Review helpful counts

### ✅ Wishlist
- Add/remove properties to wishlist
- View saved properties
- Unique property per user

### ✅ Contact System
- Send inquiries to property owners
- Email notifications
- Support request handling
- Multiple inquiry types

### ✅ Security
- Password hashing with bcryptjs
- JWT token authentication
- CORS configuration
- Rate limiting
- Helmet for HTTP headers
- Input validation

### ✅ Database
- MongoDB with Mongoose ODM
- Indexed queries for performance
- Schema validation
- Automatic timestamps

## Getting Started

### 1. Local Development

```bash
# Install dependencies
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your settings
# Set up MongoDB (local or Atlas)

# Start development server
npm run dev
```

Server runs on `http://localhost:5000`

### 2. Using Docker

```bash
cd backend
docker-compose up
```

Starts MongoDB and backend server automatically.

### 3. Deploy to Cloud

Choose your platform:
- **Railway** (Easiest): `railway init` → `railway up`
- **Render**: Connect GitHub repo, auto-deploy
- **Heroku**: `heroku create` → `git push heroku main`
- **AWS/GCP**: Follow platform-specific instructions

See `DEPLOYMENT.md` for detailed instructions.

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Properties
- `GET /api/properties` - List properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `GET /api/properties/owner/my-properties` - Owner's properties

### Reviews
- `GET /api/reviews/property/:id` - Get reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/add/:propertyId` - Add item
- `DELETE /api/wishlist/remove/:propertyId` - Remove item
- `GET /api/wishlist/check/:propertyId` - Check status

### Contact
- `POST /api/contact/send-inquiry` - Send inquiry
- `POST /api/contact/support` - Support request

## Environment Variables

```env
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/staynearU
MONGODB_ATLAS_URI=your_atlas_connection

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Email
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SENDER_EMAIL=noreply@staynearU.com

# Frontend
FRONTEND_URL=http://localhost:3000

# Google Maps
GOOGLE_MAPS_API_KEY=your_api_key
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Database | MongoDB |
| Authentication | JWT |
| Password Hashing | bcryptjs |
| Email | Nodemailer |
| Validation | Validator.js |
| Security | Helmet, CORS, Rate Limiting |
| Development | Nodemon |
| Containerization | Docker |

## Database Schema

### User
- User credentials and authentication
- Profile information
- Email verification status

### Property
- Property details (title, description, location)
- Pricing and availability
- Facilities and amenities
- Photos and videos
- Owner information
- Verification and featured status

### Review
- Property ratings (1-5 stars)
- User reviews
- Stay duration information
- Verification badges

### Wishlist
- User's saved properties
- Timestamps
- Unique constraint (one per user per property)

## Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"John","email":"john@test.com","password":"pass123"}'
```

### List Properties
```bash
curl http://localhost:5000/api/properties?city=Bangalore
```

See `API_DOCUMENTATION.md` for complete API reference and examples.

## Deployment Checklist

- [ ] Set up MongoDB Atlas (free tier available)
- [ ] Configure environment variables
- [ ] Update FRONTEND_URL
- [ ] Set up email service (Gmail or SendGrid)
- [ ] Test all endpoints
- [ ] Choose deployment platform
- [ ] Deploy backend
- [ ] Update frontend API_BASE_URL
- [ ] Deploy frontend
- [ ] Test end-to-end functionality

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Check connection string, whitelist IP in Atlas |
| Email not sending | Enable App Password in Gmail, check SMTP config |
| Port already in use | Change PORT in .env or kill process |
| CORS errors | Update FRONTEND_URL in .env |
| Token invalid | Check JWT_SECRET, token expiration |

## Next Steps

1. **Update Frontend** - Connect React app to backend API
2. **Set up Database** - Create MongoDB Atlas cluster
3. **Configure Email** - Set up Gmail or SendGrid
4. **Deploy Backend** - Push to production platform
5. **Deploy Frontend** - Host React app
6. **Set up Domain** - Connect custom domain
7. **Monitor** - Set up logging and error tracking

## Resources

- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [Deployment Guide](./DEPLOYMENT.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Quick Start](./QUICKSTART.md)

## Support

Need help?
- 📖 Read the documentation files
- 🐛 Check GitHub Issues
- 💬 Email support@staynearU.com
- 🚀 Deploy and start building!

---

**Backend is ready to use!** 🎉

Connect your frontend and deploy to take your StayNearU platform live!
