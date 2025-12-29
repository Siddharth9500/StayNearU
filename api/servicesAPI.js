import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const servicesAPI = {
  // Get all services with filters
  getAll: (params) => fetch(`${API_BASE_URL}/services`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  }).then(res => res.json()),

  // Get services by city and category
  getByCity: (city, category) => fetch(`${API_BASE_URL}/services/city/${city}${category ? `?category=${category}` : ''}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json()),

  // Search services with filters
  search: (filters) => {
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.latitude) params.append('latitude', filters.latitude);
    if (filters.longitude) params.append('longitude', filters.longitude);
    if (filters.maxDistance) params.append('maxDistance', filters.maxDistance);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    return fetch(`${API_BASE_URL}/services?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json());
  },

  // Get single service
  getById: (id) => fetch(`${API_BASE_URL}/services/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json()),

  // Create service (Owner only)
  create: (data, token) => fetch(`${API_BASE_URL}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  // Update service (Owner only)
  update: (id, data, token) => fetch(`${API_BASE_URL}/services/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  // Delete service (Owner only)
  delete: (id, token) => fetch(`${API_BASE_URL}/services/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json()),

  // Get owner's services
  getOwnerServices: (token) => fetch(`${API_BASE_URL}/services/owner/my-services`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json()),

  // Record click (analytics)
  recordClick: (id) => fetch(`${API_BASE_URL}/services/${id}/click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json())
};

export default servicesAPI;
