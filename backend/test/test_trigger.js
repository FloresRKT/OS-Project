const db = require("../db/database");

// Function to test trigger operation
async function testTrigger() {
  console.log("Testing occupancy trigger operation...");
  
  // Clear logs for clean test
  await runQuery(`DELETE FROM logs`);
  console.log("Cleared logs table");
  
  // Get an existing rental to test with
  const rental = await getQuery(`SELECT * FROM rents LIMIT 1`);
  if (!rental) {
    console.log("No rental found. Creating a test rental...");
    await createTestData();
    return;
  }
  
  console.log(`Found rental #${rental.rent_id} with status '${rental.status}'`);
  const listingId = rental.listing_id;
  
  // Get initial occupancy
  const initialListing = await getQuery(`SELECT occupancy FROM listings WHERE listing_id = ?`, [listingId]);
  console.log(`Initial occupancy for listing #${listingId}: ${initialListing.occupancy}`);
  
  // Update status based on current status (toggle between pending and active)
  const newStatus = rental.status === 'active' ? 'pending' : 'active';
  console.log(`Updating rental #${rental.rent_id} status from '${rental.status}' to '${newStatus}'`);
  
  // Update rental status
  await runQuery(`UPDATE rents SET status = ? WHERE rent_id = ?`, [newStatus, rental.rent_id]);
  
  // Check logs to see if trigger fired
  const logs = await getAllQuery(`SELECT * FROM logs ORDER BY log_id DESC LIMIT 5`);
  console.log("\nTrigger Logs:");
  logs.forEach(log => console.log(`${log.timestamp}: ${log.message}`));
  
  // Check if occupancy changed
  const updatedListing = await getQuery(`SELECT occupancy FROM listings WHERE listing_id = ?`, [listingId]);
  console.log(`\nFinal occupancy for listing #${listingId}: ${updatedListing.occupancy}`);
  
  // Report whether trigger worked correctly
  const expectedChange = newStatus === 'active' ? 1 : -1;
  const initialOccupancy = initialListing.occupancy === null ? 0 : initialListing.occupancy;
  const expectedOccupancy = Math.max(0, initialOccupancy + expectedChange);
  
  if (updatedListing.occupancy === expectedOccupancy) {
    console.log("✅ TRIGGER WORKING CORRECTLY!");
  } else {
    console.log("❌ TRIGGER NOT WORKING CORRECTLY!");
    console.log(`Expected: ${expectedOccupancy}, Actual: ${updatedListing.occupancy}`);
  }
}

// Helper functions for database operations
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function getAllQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Create test data if needed
async function createTestData() {
  try {
    console.log("Creating test data...");
    
    // Create test user
    const userResult = await runQuery(
      `INSERT INTO users (user_type, name, email, password) 
       VALUES (?, ?, ?, ?)`, 
      ['COMPANY', 'Test Company', 'test@example.com', 'password']
    );
    const userId = userResult.lastID;
    console.log(`Created test user ID: ${userId}`);
    
    // Create test listing
    const listingResult = await runQuery(
      `INSERT INTO listings (
        user_id, unit_number, street, barangay, municipality, region,
        zip_code, total_spaces, occupancy, rate_per_day, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, '123', 'Test St', 'Test Area', 'Test City', 'Test Region', 
       '12345', 5, 0, 100.0, 'Test listing']
    );
    const listingId = listingResult.lastID;
    console.log(`Created test listing ID: ${listingId}`);
    
    // Create test rental
    const rentalResult = await runQuery(
      `INSERT INTO rents (
        owner_id, renter_id, plate_number, listing_id, 
        start_date, end_date, total_cost, remaining_cost, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, userId, 'TEST123', listingId, 
       '2025-05-04', '2025-05-10', 600, 600, 'pending']
    );
    const rentalId = rentalResult.lastID;
    console.log(`Created test rental ID: ${rentalId}`);
    
    // Now test the trigger
    console.log("\nNow testing trigger with the created data...");
    testTrigger();
    
  } catch (error) {
    console.error("Error creating test data:", error);
  }
}

// Run the test
testTrigger();