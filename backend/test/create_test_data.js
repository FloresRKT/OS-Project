const axios = require("axios");
const BASE_URL = "http://localhost:3000/api";

const NUMBER_OF_USERS = 3; // Number of users to create
const NUMBER_OF_COMPANIES = 3; // Number of companies to create

async function createTestData() {
  try {
    // 1. Create Users
    const userIds = [];

    for (i = 0; i < NUMBER_OF_USERS; i++) {
      const createUserResponse = await axios.post(`${BASE_URL}/users`, {
        first_name: `Test`,
        last_name: `${i}`,
        email: `testuser${i}@example.com`,
        password: "pass123",
        plate_number: `ABC-000${i}`,
      });
      console.log(`Create User ${i}:`, createUserResponse.data);
      userIds.push(createUserResponse.data.user_id);
    }

    // 2. Create Companies
    const companyIds = [];

    let createCompanyResponse = await axios.post(`${BASE_URL}/company`, {
      user_type: "COMPANY",
      name: `ParkWay Solutions`,
      email: `parkwaysolutions@example.com`,
      password: "pass123",
      plate_number: "",
    });
    console.log(`Create Company 1:`, createCompanyResponse.data);
    companyIds.push(createCompanyResponse.data.user_id);

    createCompanyResponse = await axios.post(`${BASE_URL}/company`, {
      user_type: "COMPANY",
      name: `PrimePark Management`,
      email: `primeparkmgmt@example.com`,
      password: "pass123",
      plate_number: "",
    });
    console.log(`Create Company 2:`, createCompanyResponse.data);
    companyIds.push(createCompanyResponse.data.user_id);

    // 3. Create a listing for each company
    const listingIds = [];

    let createListingResponse = await axios.post(`${BASE_URL}/listings`, {
      company_id: companyIds[0], // First company ID
      unit_number: "58",
      street: "Mangga Street",
      barangay: "Tandang Sora",
      municipality: "Quezon City",
      region: "Metro Manila",
      zip_code: "1116",
      total_spaces: 4,
      rate_per_day: 250.0,
      description: "Gravel Parking Lot",
    });
    console.log("Create listing 1:", createListingResponse.data);
    listingIds.push(createListingResponse.data.listing_id);

    createListingResponse = await axios.post(`${BASE_URL}/listings`, {
      company_id: companyIds[1], // Second company ID
      unit_number: "21-A",
      street: "Dahlia Avenue",
      barangay: "Fairview",
      municipality: "Quezon City",
      region: "Metro Manila",
      zip_code: "1121",
      total_spaces: 8,
      rate_per_day: 300.0,
      description: "Dirt Parking Lot",
    });
    console.log("Create listing 2:", createListingResponse.data);
    listingIds.push(createListingResponse.data.listing_id);

    // 4. Create rentals - one active and one past rental for each user

    // Helper to create dates
    const today = new Date();
    const formatDate = (date) => date.toISOString().split("T")[0];

    // Past date (7 days ago)
    const pastStart = new Date(today);
    pastStart.setDate(pastStart.getDate() - 7);
    const pastEnd = new Date(today);
    pastEnd.setDate(pastEnd.getDate() - 5);

    // Future date (starting today)
    const futureStart = new Date(today);
    const futureEnd = new Date(today);
    futureEnd.setDate(futureEnd.getDate() + 3);

    // Create rentals for first user
    console.log("Creating rentals for first user...");

    // Active rental (current)
    let createRentalResponse = await axios.post(`${BASE_URL}/rents`, {
      owner_id: companyIds[0], // Company 1
      renter_id: userIds[0], // First user
      listing_id: listingIds[0], // First listing
      plate_number: "ABC-0000", // User's plate
      start_date: formatDate(today),
      end_date: formatDate(futureEnd),
      total_cost: 250.0 * 3, // 3 days at 250 per day
      remaining_cost: 250.0 * 3, // Full amount remaining
      status: "pending", // Start as pending
    });
    console.log("Created active rental:", createRentalResponse.data);

    // Update to active to test trigger
    let activateResponse = await axios.put(
      `${BASE_URL}/rents/${createRentalResponse.data.rent_id}`,
      {
        status: "active",
      }
    );
    console.log("Activated rental:", activateResponse.data);

    // Past rental (completed)
    createRentalResponse = await axios.post(`${BASE_URL}/rents`, {
      owner_id: companyIds[0], // Company 1
      renter_id: userIds[0], // First user
      listing_id: listingIds[0], // First listing
      plate_number: "ABC-0000", // User's plate
      start_date: formatDate(pastStart),
      end_date: formatDate(pastEnd),
      total_cost: 250.0 * 2, // 2 days at 250 per day
      remaining_cost: 0, // Paid in full
      status: "completed", // Already completed
    });
    console.log("Created past rental:", createRentalResponse.data);

    // 5. Create another rental for second listing
    createRentalResponse = await axios.post(`${BASE_URL}/rents`, {
      owner_id: companyIds[1], // Company 2
      renter_id: userIds[2], // Third user
      listing_id: listingIds[1], // Second listing
      plate_number: "ABC-0002", // User's plate
      start_date: formatDate(futureStart),
      end_date: formatDate(futureEnd),
      total_cost: 300.0 * 3, // 3 days at 300 per day
      remaining_cost: 300.0 * 3, // Full amount remaining
      status: "pending", // Start as pending
    });
    console.log("Created second listing rental:", createRentalResponse.data);

    console.log("All data inserted successfully!");
  } catch (error) {
    console.error("Test Failed:", error.response?.data || error.message);
  }
}

createTestData();
