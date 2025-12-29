# StayNearU Backend API

A Node.js/Express backend for the StayNearU student accommodation finder platform.

## Features

- **User Authentication**: Register, login, and manage user profiles
- **Property Management**: Create, read, update, delete property listings
- **Reviews & Ratings**: Students can review and rate properties
- **Wishlist**: Save favorite properties
- **Contact System**: Direct messaging between students and property owners
- **Search & Filtering**: Find properties by location, type, and price range

## Tech Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Nodemailer** - Email service

## Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. Clone the repository
```bash
git clone https://github.com/Siddharth9500/staynearu-backend.git
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`)
```bash
cp .env.example .env
```

4. Configure your environment variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/staynearU
MONGODB_ATLAS_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

5. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (Owner only)
- `PUT /api/properties/:id` - Update property (Owner only)
- `DELETE /api/properties/:id` - Delete property (Owner only)
- `GET /api/properties/owner/my-properties` - Get user's properties

### Reviews
- `GET /api/reviews/property/:propertyId` - Get property reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/add/:propertyId` - Add to wishlist
- `DELETE /api/wishlist/remove/:propertyId` - Remove from wishlist
- `GET /api/wishlist/check/:propertyId` - Check if in wishlist

### Contact
- `POST /api/contact/send-inquiry` - Send property inquiry
- `POST /api/contact/support` - Send support request

## Database Schema

### User
- full_name, email, phone, password, role, profile_photo, college_name, etc.

### Property
- title, description, property_type, rent_amount, address, city, facilities, photos, videos, owner_id, etc.

### Review
- property_id, user_id, rating, review_text, stay_duration, verified, createdAt

### Wishlist
- property_id, user_id, createdAt

## Deployment

### Deploy to Heroku
```bash
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy to Render
1. Push code to GitHub
2. Connect GitHub repo to Render
3. Set environment variables
4. Deploy!

### Deploy to Railway
```bash
npm install -g railway
railway login
railway init
railway up
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/staynearU
MONGODB_ATLAS_URI=your_atlas_connection_string

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SENDER_EMAIL=noreply@staynearU.com

# Frontend
FRONTEND_URL=http://localhost:3000
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

## Support

For support, email support@staynearU.com or create an issue on GitHub.
