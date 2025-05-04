const db = require("../db/database");

// Create a new listing in the database
exports.createListing = async (req, res) => {
  try {
    const {
      company_id,
      unit_number,
      street,
      barangay,
      municipality,
      region,
      zip_code,
      total_spaces,
      occupancy = 0,
      rate_per_day,
      description,
    } = req.body;

    db.run(
      `INSERT INTO listings (
        company_id,
        unit_number,
        street,
        barangay,
        municipality,
        region,
        zip_code,
        total_spaces,
        occupancy,
        rate_per_day,
        description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        company_id,
        unit_number,
        street,
        barangay,
        municipality,
        region,
        zip_code,
        total_spaces,
        occupancy,
        rate_per_day,
        description,
      ],
      function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({
          listing_id: this.lastID,
          message: "Listing created successfully",
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a listing in the database by ID
exports.deleteListing = async (req, res) => {
  try {
    const listing_id = req.params.id;

    db.run(
      `DELETE FROM listings WHERE listing_id = ?`,
      [listing_id],
      function (err) {
        if (err) return res.status(400).json({ error: err.message });
        if (this.changes === 0) {
          return res.status(404).json({ message: "Listing not found" });
        }
        res.json({ message: "Listing deleted successfully" });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all listings
exports.getAllListings = async (req, res) => {
  try {
    db.all(
      "SELECT * FROM listings l JOIN companies c ON c.company_id = l.company_id ORDER BY l.listing_id DESC",
      [],
      (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(rows || []);
        }
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get listing details by ID
exports.getListingById = async (req, res) => {
  try {
    const listing_id = req.params.id;
    db.get(
      `SELECT * FROM listings l LEFT JOIN companies c ON l.company_id = c.company_id WHERE listing_id=?`,
      [listing_id],

      // Error handling and response
      (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
          res.json(row);
        } else {
          res.status(404).json({ error: "Listing not found" });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update listing details by ID
exports.updateListing = async (req, res) => {
  try {
    const {
      available_hours_start,
      available_hours_end,
      available_spaces,
      rate_per_day,
      description,
    } = req.body;

    db.run(
      `UPDATE listings SET
            available_hours_start = ?,
            available_hours_end = ?,
            available_spaces = ?,
            rate_per_day = ?,
            description = ?
        WHERE listing_id = ?`,
      [
        available_hours_start,
        available_hours_end,
        available_spaces,
        rate_per_day,
        description,
        listing_id,
      ],
      function (err) {
        if (err) return res.status(400).json({ error: err.message });
        if (this.changes === 0) {
          return res.status(404).json({ message: "Listing not found" });
        }
        res.json({ message: "Listing updated successfully" });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
