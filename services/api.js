// Base API URL
const BASE_URL = "http://192.168.1.9:3000/api";

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An error occurred with the API request",
    }));
    throw new Error(error.message || `HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

// Base fetch with common options
const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
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
    console.error("API request failed:", error);
    throw error;
  }
};

// API methods for authentication
export const authAPI = {
  userLogin: (email, password) => {
    return apiFetch("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  userRegister: (userData) => {
    return apiFetch("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },
  companyLogin: (email, password) => {
    return apiFetch("/company/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  companyRegister: (companyData) => {
    return apiFetch("/company", {
      method: "POST",
      body: JSON.stringify(companyData),
    });
  },
};

// API methods for parking lots
export const parkingAPI = {
  // Get all listings (for users)
  getAllListings: () => {
    return apiFetch("/listings/users");
  },

  // Get all listings (for companies)
  getCompanyListings: (id) => {
    return apiFetch(`/listings/company/${id}`);
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
    return apiFetch("/listings/company", {
      method: "POST",
      body: JSON.stringify(parkingLotData),
    });
  },

  getBookingQueue: (listingId) => {
    return apiFetch(`/listings/${listingId}/queue`);
  },

  addToQueue: (queueData) => {
    console.log("Adding to queue:", queueData);
    return apiFetch("/queue", {
      method: "POST",
      body: JSON.stringify(queueData),
    });
  },

  // Process the queue when a space becomes available
  processQueue: (listingId) => {
    return apiFetch(`/listings/${listingId}/process-queue`, {
      method: "POST",
    });
  },

  // Create a new booking
  createBooking: (bookingData) => {
    return apiFetch("/rents", {
      method: "POST",
      body: JSON.stringify(bookingData),
    });
  },

  checkIn: (rentalId) => {
    return apiFetch(`/rentals/${rentalId}/check-in`, {
      method: "POST",
    });
  },

  checkOut: (rentalId) => {
    return apiFetch(`/rentals/${rentalId}/check-out`, {
      method: "POST",
    });
  },

  // For companies: update parking lot details
  updateParkingLot: (id, parkingLotData) => {
    return apiFetch(`/parking-lots/${id}`, {
      method: "PUT",
      body: JSON.stringify(parkingLotData),
    });
  },

  // For companies: delete a parking lot
  deleteParkingLot: (id) => {
    return apiFetch(`/parking-lots/${id}`, {
      method: "DELETE",
    });
  },
};

// API methods for bookings
export const bookingAPI = {
  // Get all bookings for a user
  getUserBookings: (userId) => {
    if (!userId) {
      console.error("No user ID provided to getUserBookings");
      return Promise.resolve([]);
    }

    return apiFetch(`/user-rentals/${userId}`)
      .then((data) => {
        // Transform API data to match what the component expects
        return data.map((booking) => ({
          id: booking.rent_id,
          companyName: booking.owner_name,
          listingId: booking.listing_id,
          address: `${booking.unit_number} ${booking.street}, ${booking.barangay}, ${booking.municipality}, ${booking.region}, ${booking.zip_code}`,
          parkingName: booking.description || "Parking Space", // Using description as name
          startTime: booking.start_date,
          endTime: booking.end_date,
          status: booking.status,
          amount: booking.total_cost,
          remainingAmount: booking.remaining_cost,
          plateNumber: booking.plate_number,
          logo: "https://via.placeholder.com/50", // Placeholder image
          listing_id: booking.listing_id,
          check_in_time: booking.check_in_time,
          check_out_time: booking.check_out_time,
        }));
      })
      .catch((error) => {
        console.error("Error fetching user bookings:", error);
        return [];
      });
  },

  // Get all bookings for a company's parking lots
  getCompanyBookings: (companyId) => {
    return apiFetch(`/rents/company/${companyId}`);
  },
};

// API methods for user profile
export const userAPI = {
  // Update user profile
  updateUserProfile: (userId) => {
    return apiFetch(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  // Get user profile by ID
  getUser: (userId) => {
    return apiFetch(`/users/${userId}`);
  },

  // Get company profile by ID
  getCompany: (companyId) => {
    return apiFetch(`/company/${companyId}`);
  },
};

export default {
  auth: authAPI,
  parking: parkingAPI,
  booking: bookingAPI,
  user: userAPI,
};
