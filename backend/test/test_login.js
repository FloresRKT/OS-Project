const axios = require('axios');
const BASE_URL = 'http://localhost:3000/api';

async function testEndpoints() {
  try {
    const uniqueID = Math.random().toFixed(5)
    // 1. Create User
    const createResponse = await axios.post(`${BASE_URL}/users`, {
      user_type: 'test',
      name: 'Test User',
      email: `test${uniqueID}@example.com`,
      password: 'test123',
      device_id: 'test-device'
    });
    console.log('Create User:', createResponse.data);
    const userId = createResponse.data.user_id;
    console.log('User ID:', userId);

    // 2. Login
    const loginResponse = await axios.post(`${BASE_URL}/users/login`, {
      email: `test${uniqueID}@example.com`,
      password: 'test123'
    });
    console.log('Login:', loginResponse.data);

    // 3. Get All Users
    const allUsersResponse = await axios.get(`${BASE_URL}/users`);
    console.log('All Users:', allUsersResponse.data);

    // 4. Get User by ID
    const userByIdResponse = await axios.get(`${BASE_URL}/users/${userId}`);
    console.log('User by ID:', userByIdResponse.data);

    // 5. Update User
    const updateResponse = await axios.put(`${BASE_URL}/users/${userId}`, {
      name: 'Updated Name',
      email: 'updated@example.com'
    });
    console.log('Update User:', updateResponse.data);

    // 6. Delete User
    const deleteResponse = await axios.delete(`${BASE_URL}/users/${userId}`);
    console.log('Delete User:', deleteResponse.data);

    console.log('All tests passed successfully!');
  } catch (error) {
    console.error('Test Failed:', error.response?.data || error.message);
  }
}

testEndpoints();