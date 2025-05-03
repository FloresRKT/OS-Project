// Base API URL
const BASE_URL = 'http://192.168.1.5:3000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred with the API request'
    }));
    throw new Error(error.message || `HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

// Base fetch with common options
const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    return handleResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API methods for authentication
export const authAPI = {
  login: (email, password) => {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  register: (userData) => {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  logout: () => {
    return apiFetch('/auth/logout', {
      method: 'POST',
    });
  },
};

// API methods for parking lots
export const parkingAPI = {
  // Get all listings (for users)
  getAllListings: () => {
    return apiFetch('/listings');
  },
  
  // Get parking lot by ID
  getListingById: (id) => {
    return apiFetch(`/listings/${id}`);
  },
  
  // Search for parking lots by location
  searchParkingLots: (query) => {
    return apiFetch(`/listings/search?query=${encodeURIComponent(query)}`);
  },
  
  // For companies: add a new parking lot
  addParkingLot: (parkingLotData) => {
    return apiFetch('/parking-lots', {
      method: 'POST',
      body: JSON.stringify(parkingLotData),
    });
  },
  
  // For companies: update parking lot details
  updateParkingLot: (id, parkingLotData) => {
    return apiFetch(`/parking-lots/${id}`, {
      method: 'PUT',
      body: JSON.stringify(parkingLotData),
    });
  },
  
  // For companies: delete a parking lot
  deleteParkingLot: (id) => {
    return apiFetch(`/parking-lots/${id}`, {
      method: 'DELETE',
    });
  },
};

// API methods for bookings
export const bookingAPI = {
  // Get all bookings for a user
  getUserBookings: () => {
    return apiFetch('/bookings/user');
  },
  
  // Get all bookings for a company's parking lots
  getCompanyBookings: () => {
    return apiFetch('/bookings/company');
  },
  
  // Create a new booking
  createBooking: (bookingData) => {
    return apiFetch('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },
  
  // Get details of a specific booking
  getBookingDetails: (id) => {
    return apiFetch(`/bookings/${id}`);
  },
  
  // Cancel a booking
  cancelBooking: (id) => {
    return apiFetch(`/bookings/${id}/cancel`, {
      method: 'PUT',
    });
  },
};

// API methods for user profile
export const userAPI = {
  // Get current user profile
  getCurrentUser: () => {
    return apiFetch('/users/me');
  },
  
  // Update user profile
  updateUserProfile: (userData) => {
    return apiFetch('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  
  // Get user vehicles
  getUserVehicles: () => {
    return apiFetch('/users/vehicles');
  },
  
  // Add a new vehicle
  addVehicle: (vehicleData) => {
    return apiFetch('/users/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  },
  
  // Delete a vehicle
  deleteVehicle: (id) => {
    return apiFetch(`/users/vehicles/${id}`, {
      method: 'DELETE',
    });
  },
};

export default {
  auth: authAPI,
  parking: parkingAPI,
  booking: bookingAPI,
  user: userAPI,
};