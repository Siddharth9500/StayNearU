# Frontend-Backend Integration Guide

Guide to connect your React frontend with the StayNearU backend.

## Step 1: Update API Configuration

Create or update your API client file:

### Option A: Using Environment Variables (Recommended)

**Create `.env` in your frontend root:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

For production:
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

### Option B: API Service File

Create `src/services/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiClient = {
  // Authentication
  auth: {
    register: (data) => fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    
    login: (email, password) => fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }),
    
    getCurrentUser: (token) => fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },
  
  // Properties
  properties: {
    getAll: (filters = {}) => {
      const params = new URLSearchParams(filters);
      return fetch(`${API_BASE_URL}/properties?${params}`);
    },
    
    getOne: (id) => fetch(`${API_BASE_URL}/properties/${id}`),
    
    create: (data, token) => fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }),
    
    update: (id, data, token) => fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }),
    
    delete: (id, token) => fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },
  
  // Reviews
  reviews: {
    getByProperty: (propertyId) => 
      fetch(`${API_BASE_URL}/reviews/property/${propertyId}`),
    
    create: (data, token) => fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
  },
  
  // Wishlist
  wishlist: {
    getAll: (token) => fetch(`${API_BASE_URL}/wishlist`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    
    add: (propertyId, token) => fetch(`${API_BASE_URL}/wishlist/add/${propertyId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    
    remove: (propertyId, token) => fetch(`${API_BASE_URL}/wishlist/remove/${propertyId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },
  
  // Contact
  contact: {
    sendInquiry: (data, token) => fetch(`${API_BASE_URL}/contact/send-inquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
  }
};
```

## Step 2: Update Your Components

### Example: Property List Component

```javascript
import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: '', property_type: '' });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await apiClient.properties.getAll(filters);
      const data = await response.json();
      setProperties(data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          name="city"
          placeholder="City"
          value={filters.city}
          onChange={handleFilterChange}
        />
        <select
          name="property_type"
          value={filters.property_type}
          onChange={handleFilterChange}
        >
          <option value="">All Types</option>
          <option value="pg">PG</option>
          <option value="hostel">Hostel</option>
          <option value="room">Room</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="properties-grid">
          {properties.map(property => (
            <div key={property.id} className="property-card">
              <h3>{property.title}</h3>
              <p>{property.address}, {property.city}</p>
              <p>₹{property.rent_amount}/{property.rent_type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Example: Authentication

```javascript
import { useState } from 'react';
import { apiClient } from '../services/api';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.auth.login(email, password);
      const data = await response.json();
      
      if (response.ok) {
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
}
```

## Step 3: Token Management

Create a hook for token management:

```javascript
// hooks/useAuth.js
import { useState, useEffect } from 'react';

export function useAuth() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return { token, user, loading, login, logout };
}
```

Usage in component:

```javascript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { token, user, logout } = useAuth();

  if (!token) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.full_name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Step 4: Protected API Calls

Create a helper for authenticated requests:

```javascript
// utils/apiUtils.js
export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${process.env.REACT_APP_API_URL}${endpoint}`,
    { ...options, headers }
  );

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error(data.message || 'An error occurred');
  }

  return data;
}
```

Usage:

```javascript
// Create property
const data = await apiCall('/properties', {
  method: 'POST',
  body: JSON.stringify(propertyData)
});
```

## Step 5: CORS Configuration

The backend is configured with CORS. Make sure:

1. **Frontend URL** is set in backend's `.env`:
```env
FRONTEND_URL=http://localhost:3000
# or for production:
FRONTEND_URL=https://your-frontend-domain.com
```

2. **No hardcoded URLs** in your React code - use environment variables

## Step 6: Testing Integration

1. **Start backend:**
```bash
cd backend
npm run dev
```

2. **Start frontend:**
```bash
npm start
```

3. **Test endpoints:**

Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test","email":"test@test.com","password":"pass123"}'
```

4. **Check in browser console** for any errors

## Deployment Checklist

- [ ] Update `REACT_APP_API_URL` to production backend URL
- [ ] Remove any hardcoded localhost URLs
- [ ] Test all API endpoints in production
- [ ] Verify CORS is working
- [ ] Check token persistence across page reloads
- [ ] Test authentication flow (login/register/logout)
- [ ] Verify protected routes redirect to login if needed
- [ ] Test error handling and display

## Common Issues

| Issue | Solution |
|-------|----------|
| CORS error | Check FRONTEND_URL in backend .env |
| 401 Unauthorized | Verify token is saved and sent in header |
| Network error | Ensure backend is running and URL is correct |
| Token lost after refresh | Use useEffect to restore from localStorage |
| API returns 404 | Check endpoint URL and HTTP method |

## Environment Variables Checklist

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_KEY=your_key_here
```

### Backend (.env)
```env
PORT=5000
MONGODB_ATLAS_URI=your_connection_string
JWT_SECRET=your_secret
FRONTEND_URL=http://localhost:3000
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Ready to Deploy!

Once integrated and tested:

1. Deploy backend to your chosen platform
2. Update frontend's `REACT_APP_API_URL` to production backend URL
3. Deploy frontend
4. Test end-to-end functionality

Your StayNearU platform is now live! 🎉
