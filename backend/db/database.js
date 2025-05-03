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
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_type TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    plate_number TEXT UNIQUE
  )
`);

// Listing table
db.run(`
  CREATE TABLE IF NOT EXISTS listings (
    listing_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    unit_number TEXT NOT NULL,
    street TEXT NOT NULL,
    barangay TEXT NOT NULL,
    municipality TEXT NOT NULL,
    region TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    latitude REAL DEFAULT 0,
    longitude REAL DEFAULT 0,
    total_spaces INTEGER NOT NULL,
    occupancy INTEGER DEFAULT 0,
    rate_per_day REAL NOT NULL,
    description TEXT NOT NULL,
    isActive INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  )
`);

// Rents table
db.run(`
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
    FOREIGN KEY (owner_id) REFERENCES users(user_id),
    FOREIGN KEY (renter_id) REFERENCES users(user_id),
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id)
  )
`);

// Listing images table
db.run(`
  CREATE TABLE IF NOT EXISTS listing_images (
    image_id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id)
  )
`);

// Profile images table
db.run(`
  CREATE TABLE IF NOT EXISTS profile_images (
    image_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES profile_images(user_id)
  )
`);

module.exports = db;
