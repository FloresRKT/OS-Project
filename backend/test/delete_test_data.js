const axios = require("axios");
const BASE_URL = "http://localhost:3000/api";

const NUMBER_OF_USERS = 3; // Number of users to create
const NUMBER_OF_COMPANIES = 3; // Number of companies to create

async function deleteTestData() {
  try {
    // 1. Delete Users
    for (i = 0; i < NUMBER_OF_USERS; i++) {
      const deleteUserResponse = await axios.delete(`${BASE_URL}/users/${i+1}`, {
        id: i + 1
      });
      console.log(`Deleted User ${i}:`, deleteUserResponse.data);
    }

    // 2. Delete Companies
    let deleteUserResponse = await axios.delete(`${BASE_URL}/users/4`, {
      id: 4
    });
    console.log(`Deleted Company 1:`, deleteUserResponse.data);

    deleteUserResponse = await axios.delete(`${BASE_URL}/users/5`, {
      id: 5
    });
    console.log(`Deleted Company 2:`, deleteUserResponse.data);

    // 3. Delete all listings
    const deleteListingResponse = await axios.delete(`${BASE_URL}/listings/1`, {
      id: 1
    });
    console.log("Create listing 1:", deleteListingResponse.data);

    deleteListingResponse = await axios.delete(`${BASE_URL}/listings/2`, {
      id: 2
    });
    console.log("Create listing 2:", deleteListingResponse.data);

    console.log("All data deleted successfully!");
  } catch (error) {
    console.error("Test Failed:", error.response?.data || error.message);
  }
}

deleteTestData();
