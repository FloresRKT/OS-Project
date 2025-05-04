const db = require("../db/database");

// Function to identify test user IDs
function getTestUserIds() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT user_id FROM users WHERE email LIKE '%test%' OR email LIKE '%example%'`, 
      function(err, rows) {
        if (err) reject(err);
        const userIds = rows.map(row => row.user_id);
        console.log(`Found ${userIds.length} test user IDs`);
        resolve(userIds);
      }
    );
  });
}

// Function to identify test user IDs
function getTestCompanyIds() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT company_id FROM companies WHERE email LIKE '%test%' OR email LIKE '%example%'`, 
      function(err, rows) {
        if (err) reject(err);
        const companyIds = rows.map(row => row.company_id);
        console.log(`Found ${companyIds.length} test company IDs`);
        resolve(companyIds);
      }
    );
  });
}

// Function to clean up rentals where test users are either renters or owners
function cleanupRentals(userIds) {
  if (!userIds.length) {
    console.log("No test user IDs found, skipping rentals cleanup");
    return Promise.resolve(0);
  }

  // Create placeholders for SQL query (?,?,?,...)
  const placeholders = userIds.map(() => '?').join(',');
  
  console.log(`Deleting rentals involving user IDs: ${userIds.join(', ')}`);
  
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM rents WHERE renter_id IN (${placeholders}) OR owner_id IN (${placeholders})`, 
      [...userIds, ...userIds], // Double the userIds array since we're using it twice in the query
      function(err) {
        if (err) reject(err);
        console.log(`Deleted ${this.changes} rentals involving test users`);
        resolve(this.changes);
      }
    );
  });
}

// Function to clean up test users
function cleanupTestUsers() {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM users WHERE email LIKE '%test%' OR email LIKE '%example%'`, 
      function(err) {
        if (err) reject(err);
        console.log(`Deleted ${this.changes} test users`);
        resolve(this.changes);
      }
    );
  });
}

// Function to clean up listings by user IDs
function cleanupListingsByUserIds(userIds) {
  if (!userIds.length) {
    console.log("No test user IDs found, skipping listings cleanup");
    return Promise.resolve(0);
  }

  // Create placeholders for SQL query (?,?,?,...)
  const placeholders = userIds.map(() => '?').join(',');

  console.log(`Deleting listings for user IDs: ${userIds.join(', ')}`);
  
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM listings WHERE company_id IN (${placeholders})`, 
      userIds,
      function(err) {
        if (err) reject(err);
        console.log(`Deleted ${this.changes} listings from test users`);
        resolve(this.changes);
      }
    );
  });
}

// Function to clean up test users
function cleanupTestUsers() {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM users WHERE email LIKE '%test%' OR email LIKE '%example%'`, 
      function(err) {
        if (err) reject(err);
        console.log(`Deleted ${this.changes} test users`);
        resolve(this.changes);
      }
    );
  });
}

// Function to clean up test companies
function cleanupTestCompanies() {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM companies WHERE email LIKE '%test%' OR email LIKE '%example%'`, 
      function(err) {
        if (err) reject(err);
        console.log(`Deleted ${this.changes} test companies`);
        resolve(this.changes);
      }
    );
  });
}

// Run all cleanup functions in the correct order
async function runCleanup() {
  try {
    const testUserIds = await getTestUserIds();
    const testCompanyIds = await getTestCompanyIds();
    
    // Turn off foreign key constraints temporarily if needed
    await new Promise((resolve, reject) => {
      db.run('PRAGMA foreign_keys = OFF', err => {
        if (err) reject(err);
        resolve();
      });
    });
    
    // Delete rentals involving test users
    await cleanupRentals(testUserIds);
    
    // Delete listings owned by test users
    await cleanupListingsByUserIds(testCompanyIds);
    
    // Delete test companies
    await cleanupTestCompanies();

    // Delete test users
    await cleanupTestUsers();
    
    // Turn foreign key constraints back on
    await new Promise((resolve, reject) => {
      db.run('PRAGMA foreign_keys = ON', err => {
        if (err) reject(err);
        resolve();
      });
    });
    
    console.log("Cleanup completed successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error during cleanup:", err);
    process.exit(1);
  }
}

// Run the cleanup
runCleanup();