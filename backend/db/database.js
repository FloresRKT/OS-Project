const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database
const db = new sqlite3.Database("./db.sqlite", (err) => {
  if (err) console.error(err.message);
  console.log("Connected to SQLite database");
});

// db.run(`DROP TABLE IF EXISTS users`);
// db.run(`DROP TABLE IF EXISTS listings`);
// db.run(`DROP TABLE IF EXISTS rents`);
// db.run(`DROP TABLE IF EXISTS listing_images`);

// User table
function createTables() {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      plate_number TEXT,
      serial_number TEXT,
      car_type TEXT,
      user_type TEXT NOT NULL DEFAULT 'USER'
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating users table:", err.message);
      } else {
        createCompanyTable();
      }
    }
  );
}

// Company table
function createCompanyTable() {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS companies (
      company_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      username TEXT,
      password TEXT NOT NULL,
      address TEXT,
      contact_number TEXT,
      user_type TEXT NOT NULL DEFAULT 'COMPANY'
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating companies table:", err.message);
      } else {
        createListingsTable();
      }
    }
  );
}

// Listing table
function createListingsTable() {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS listings (
      listing_id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id TEXT NOT NULL,
      unit_number TEXT NOT NULL,
      street TEXT NOT NULL,
      barangay TEXT NOT NULL,
      municipality TEXT NOT NULL,
      region TEXT NOT NULL,
      zip_code TEXT NOT NULL,
      latitude REAL DEFAULT 0,
      longitude REAL DEFAULT 0,
      total_spaces INTEGER NOT NULL,
      occupancy INTEGER NOT NULL DEFAULT 0,
      rate_per_day REAL NOT NULL,
      description TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      isActive INTEGER DEFAULT 1,
      FOREIGN KEY (company_id) REFERENCES companies(company_id)
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating listings table:", err.message);
      } else {
        createRentsTable();
      }
    }
  );
}

// Rents table
function createRentsTable() {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS rents (
      rent_id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      renter_id INTEGER NOT NULL,
      plate_number TEXT NOT NULL,
      listing_id INTEGER NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      total_cost REAL NOT NULL,
      remaining_cost REAL NOT NULL,
      status TEXT NOT NULL,
      check_in_time TEXT,
      check_out_time TEXT,
      FOREIGN KEY (owner_id) REFERENCES companies(company_id),
      FOREIGN KEY (renter_id) REFERENCES users(user_id),
      FOREIGN KEY (listing_id) REFERENCES listings(listing_id)
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating rents table:", err.message);
      } else {
        createListingImageTables();
      }
    }
  );
}

// Listing images table
function createListingImageTables() {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS listing_images (
      image_id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id INTEGER NOT NULL,
      FOREIGN KEY (listing_id) REFERENCES listings(listing_id)
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating listing_images table:", err.message);
      } else {
        createProfileImageTables();
      }
    }
  );
}

// Profile images table
function createProfileImageTables() {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS profile_images (
      image_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
    `,
    (err) => {
      if (err) {
        console.error("Error creating profile_images table:", err.message);
      } else {
        createTriggers();
      }
    }
  );
}

// Create triggers for automatic occupancy updates
function createTriggers() {
  // Drop existing trigger first to ensure clean recreation
  db.run(`DROP TRIGGER IF EXISTS update_occupancy_on_status_change`, (err) => {
    if (err) {
      console.error("Error dropping existing trigger:", err.message);
    } else {
      console.log("Dropped existing trigger if it existed");

      // Create the trigger with improved logging
      db.run(
        `
        CREATE TRIGGER update_occupancy_on_status_change
        AFTER UPDATE OF status ON rents
        BEGIN
          -- Debug: Log the trigger execution
          INSERT INTO logs (message) VALUES ('Trigger fired: ' || OLD.status || ' -> ' || NEW.status || ' for listing ' || NEW.listing_id);
          
          -- Increase occupancy when status changes to 'active'
          UPDATE listings 
          SET occupancy = occupancy + 1
          WHERE listing_id = NEW.listing_id AND NEW.status = 'active' AND OLD.status != 'active';
          
          -- Decrease occupancy when status changes from 'active' to anything else
          UPDATE listings 
          SET occupancy = MAX(0, occupancy - 1)
          WHERE listing_id = NEW.listing_id AND NEW.status != 'active' AND OLD.status = 'active';
        END;
        `,
        (err) => {
          if (err) {
            console.error("Error creating trigger:", err.message);
          } else {
            console.log("Occupancy update trigger created successfully");

            // Create logs table for debugging if it doesn't exist
            db.run(
              `
              CREATE TABLE IF NOT EXISTS logs (
                log_id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                message TEXT
              )
            `,
              (err) => {
                if (err)
                  console.error("Error creating logs table:", err.message);
                else console.log("Logs table created or already exists");
              }
            );
          }
        }
      );
    }
  });
}

// Start the table creation sequence
createTables();

module.exports = db;
