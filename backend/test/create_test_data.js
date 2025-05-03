const axios = require("axios");
const BASE_URL = "http://localhost:3000/api";

const NUMBER_OF_USERS = 3; // Number of users to create
const NUMBER_OF_COMPANIES = 3; // Number of companies to create

async function createTestData() {
  try {
    // 1. Create Users
    for (i = 0; i < NUMBER_OF_USERS; i++) {
      const createUserResponse = await axios.post(`${BASE_URL}/users`, {
        user_type: "USER",
        name: `Test User ${i}`,
        email: `testuser${i}@example.com`,
        password: "pass123",
        plate_number: `ABC-000${i}`,
      });
      console.log(`Create User ${i}:`, createUserResponse.data);
    }

    // 2. Create Companies
    let createCompanyResponse = await axios.post(`${BASE_URL}/users`, {
      user_type: "COMPANY",
      name: `ParkWay Solutions`,
      email: `parkwaysolutions@example.com`,
      password: "pass123",
      plate_number: "",
    });
    console.log(`Create Company 1:`, createCompanyResponse.data);

    createCompanyResponse = await axios.post(`${BASE_URL}/users`, {
      user_type: "COMPANY",
      name: `PrimePark Management`,
      email: `primeparkmgmt@example.com`,
      password: "pass123",
      plate_number: "",
    });
    console.log(`Create Company 2:`, createCompanyResponse.data);

    // 3. Create a listing for each company
    let createListingResponse = await axios.post(`${BASE_URL}/listings/`, {
      user_id: 4,
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

    createListingResponse = await axios.post(`${BASE_URL}/listings/`, {
      user_id: 5,
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

    // 4. Create a rent for the listing
    // const createRentalResponse = await axios.post(`${BASE_URL}/users`, {
    //   user_type: "COMPANY",
    //   name: `Test Company 1`,
    //   email: `testcompany1@example.com`,
    //   password: "pass123",
    //   plate_number: "",
    // });
    // console.log("User by ID:", createRentalResponse.data);

    // // 5. Create bookings
    // // NOTE: Booking logic not implemented yet
    // const updateResponse = await axios.put(`${BASE_URL}/users/${userId}`, {
    //   name: "Updated Name",
    //   email: "updated@example.com",
    // });
    // console.log("Update User:", updateResponse.data);

    console.log("All data inserted successfully!");
  } catch (error) {
    console.error("Test Failed:", error.response?.data || error.message);
  }
}

createTestData();
