# StayNearU Backend API Documentation

Complete API reference for the StayNearU backend.

## Base URL
```
http://localhost:5000/api
```

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get a token by logging in or registering.

---

## Error Responses

All error responses follow this format:

```json
{
  "message": "Error description",
  "status": 400
}
```

---

## API Endpoints

### Authentication (`/auth`)

#### Register
```
POST /auth/register
```

**Request:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // or "owner" / "admin"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

#### Login
```
POST /auth/login
```

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "profile_photo": "https://example.com/photo.jpg"
  }
}
```

---

#### Get Current User
```
GET /auth/me
Headers: Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "9999999999",
  "role": "student",
  "profile_photo": "https://example.com/photo.jpg",
  "college_name": "XYZ University",
  "bio": "Looking for a PG near my college",
  "is_verified": false,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### Update Profile
```
PUT /auth/profile
Headers: Authorization: Bearer TOKEN
```

**Request:**
```json
{
  "full_name": "John Doe Updated",
  "phone": "9999999999",
  "college_name": "XYZ University",
  "bio": "New bio",
  "profile_photo": "https://example.com/photo.jpg"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": { /* updated user object */ }
}
```

---

### Properties (`/properties`)

#### Get All Properties
```
GET /properties?city=Bangalore&property_type=pg&min_rent=5000&max_rent=15000&page=1&limit=10
```

**Query Parameters:**
- `city` (optional): Filter by city
- `property_type` (optional): pg, hostel, room, flat, apartment
- `min_rent` (optional): Minimum rent amount
- `max_rent` (optional): Maximum rent amount
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Response:**
```json
{
  "properties": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "1 BHK Near College",
      "property_type": "pg",
      "rent_amount": 8000,
      "rent_type": "monthly",
      "address": "123 Main Street",
      "city": "Bangalore",
      "state": "Karnataka",
      "facilities": ["WiFi", "AC", "Parking"],
      "photos": ["https://example.com/photo1.jpg"],
      "owner_name": "Property Owner",
      "owner_phone": "9999999999",
      "rating": 4.5,
      "reviews_count": 10,
      "views_count": 150,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 45,
  "pages": 5,
  "current_page": 1
}
```

---

#### Get Single Property
```
GET /properties/:id
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "1 BHK Near College",
  "description": "Spacious room with all amenities",
  "property_type": "pg",
  "rent_amount": 8000,
  "security_deposit": 16000,
  "address": "123 Main Street",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "nearby_colleges": ["IIT Bangalore", "BIT Bangalore"],
  "distance_to_college": "2 km",
  "facilities": ["WiFi", "AC", "Parking", "Kitchen"],
  "photos": ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
  "videos": ["https://youtube.com/watch?v=..."],
  "owner_id": "507f1f77bcf86cd799439012",
  "owner_name": "Property Owner",
  "owner_phone": "9999999999",
  "owner_email": "owner@example.com",
  "owner_whatsapp": "9999999999",
  "availability_status": "available",
  "total_rooms": 10,
  "available_rooms": 3,
  "gender_preference": "any",
  "sharing_options": ["single", "double"],
  "is_verified": true,
  "featured": false,
  "rating": 4.5,
  "reviews_count": 10,
  "views_count": 150,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### Create Property
```
POST /properties
Headers: Authorization: Bearer TOKEN
```

**Request:**
```json
{
  "title": "1 BHK Near College",
  "description": "Spacious room with all amenities",
  "property_type": "pg",
  "rent_amount": 8000,
  "rent_type": "monthly",
  "security_deposit": 16000,
  "address": "123 Main Street",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "nearby_colleges": ["IIT Bangalore", "BIT Bangalore"],
  "distance_to_college": "2 km",
  "facilities": ["WiFi", "AC", "Parking"],
  "photos": ["https://example.com/photo1.jpg"],
  "videos": ["https://youtube.com/watch?v=..."],
  "owner_name": "John Doe",
  "owner_phone": "9999999999",
  "owner_email": "john@example.com",
  "owner_whatsapp": "9999999999",
  "total_rooms": 10,
  "available_rooms": 3,
  "gender_preference": "any",
  "sharing_options": ["single", "double"]
}
```

**Response:**
```json
{
  "message": "Property created successfully",
  "property": { /* property object */ }
}
```

---

#### Update Property
```
PUT /properties/:id
Headers: Authorization: Bearer TOKEN
```

**Request:** Same as create property (any field can be updated)

**Response:**
```json
{
  "message": "Property updated successfully",
  "property": { /* updated property object */ }
}
```

---

#### Delete Property
```
DELETE /properties/:id
Headers: Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "message": "Property deleted successfully"
}
```

---

#### Get Owner's Properties
```
GET /properties/owner/my-properties
Headers: Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "total": 5,
  "properties": [ /* array of property objects */ ]
}
```

---

### Reviews (`/reviews`)

#### Get Property Reviews
```
GET /reviews/property/:propertyId
```

**Response:**
```json
{
  "reviews": [
    {
      "id": "507f1f77bcf86cd799439011",
      "property_id": "507f1f77bcf86cd799439010",
      "user_id": "507f1f77bcf86cd799439009",
      "user_email": "student@example.com",
      "user_name": "Student Name",
      "rating": 5,
      "review_text": "Great property, very clean and well-maintained!",
      "stay_duration": "6_12_months",
      "verified": true,
      "helpful_count": 15,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 10,
  "average_rating": "4.5"
}
```

---

#### Create Review
```
POST /reviews
Headers: Authorization: Bearer TOKEN
```

**Request:**
```json
{
  "property_id": "507f1f77bcf86cd799439010",
  "rating": 5,
  "review_text": "Great property, very clean and well-maintained!",
  "stay_duration": "6_12_months"
}
```

**Response:**
```json
{
  "message": "Review created successfully",
  "review": { /* review object */ }
}
```

---

#### Update Review
```
PUT /reviews/:id
Headers: Authorization: Bearer TOKEN
```

**Request:**
```json
{
  "rating": 4,
  "review_text": "Updated review text"
}
```

**Response:**
```json
{
  "message": "Review updated successfully",
  "review": { /* updated review object */ }
}
```

---

#### Delete Review
```
DELETE /reviews/:id
Headers: Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "message": "Review deleted successfully"
}
```

---

### Wishlist (`/wishlist`)

#### Get User's Wishlist
```
GET /wishlist
Headers: Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "total": 3,
  "wishlist": [
    {
      "id": "507f1f77bcf86cd799439011",
      "property_id": {
        "id": "507f1f77bcf86cd799439010",
        "title": "1 BHK Near College",
        /* ... other property details ... */
      },
      "user_id": "507f1f77bcf86cd799439009",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

#### Add to Wishlist
```
POST /wishlist/add/:propertyId
Headers: Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "message": "Added to wishlist",
  "wishlist": { /* wishlist item object */ }
}
```

---

#### Remove from Wishlist
```
DELETE /wishlist/remove/:propertyId
Headers: Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "message": "Removed from wishlist"
}
```

---

#### Check if in Wishlist
```
GET /wishlist/check/:propertyId
Headers: Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "in_wishlist": true
}
```

---

### Contact (`/contact`)

#### Send Property Inquiry
```
POST /contact/send-inquiry
Headers: Authorization: Bearer TOKEN
```

**Request:**
```json
{
  "property_id": "507f1f77bcf86cd799439010",
  "message": "Hello, I am interested in this property. Can I schedule a visit?",
  "inquiry_type": "visit",
  "phone": "9999999999",
  "preferred_contact_time": "evening"
}
```

**Response:**
```json
{
  "message": "Inquiry sent successfully"
}
```

---

#### Send Support Request
```
POST /contact/support
```

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Issue with property listing",
  "message": "I have an issue with my property listing..."
}
```

**Response:**
```json
{
  "message": "Support request sent successfully"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Permission denied |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Example Requests

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }'

# Get properties
curl http://localhost:5000/api/properties?city=Bangalore

# Create property (with token)
curl -X POST http://localhost:5000/api/properties \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "1 BHK Near College",
    "property_type": "pg",
    "rent_amount": 8000,
    ...
  }'
```

### Using JavaScript/Fetch

```javascript
// Register
const register = async () => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      full_name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'student'
    })
  });
  return await response.json();
};

// Login
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return await response.json();
};

// Get properties
const getProperties = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  const response = await fetch(`/api/properties?${params}`);
  return await response.json();
};

// Create property
const createProperty = async (token, propertyData) => {
  const response = await fetch('/api/properties', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(propertyData)
  });
  return await response.json();
};
```

---

## Support

For issues or questions about the API:
- Email: support@staynearU.com
- GitHub Issues: [GitHub Repo](https://github.com/Siddharth9500/staynearu-backend)
