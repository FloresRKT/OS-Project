const db = require("../db/database");

// Create a new rental in the database
exports.createRental = async (req, res) => {
  try {
    const {
      owner_id,
      renter_id,
      listing_id,
      plate_number,
      start_date,
      end_date,
      total_cost,
      remaining_cost,
      status,
    } = req.body;

    db.run(
      `INSERT INTO rents (
        owner_id,
        renter_id,
        listing_id,
        plate_number,
        start_date,
        end_date,
        total_cost,
        remaining_cost,
        status,
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        location_address,
        latitude,
        longitude,
        available_hours_start,
        available_hours_end,
        available_spaces,
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

// Create a new rental in the database
exports.updateRental = async (req, res) => {
  try {
    const {
      owner_id,
      renter_id,
      listing_id,
      plate_number,
      start_date,
      end_date,
      total_cost,
      remaining_cost,
      status,
    } = req.body;

    db.run(
      `INSERT INTO rents (
          owner_id,
          renter_id,
          listing_id,
          plate_number,
          start_date,
          end_date,
          total_cost,
          remaining_cost,
          status,
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        location_address,
        latitude,
        longitude,
        available_hours_start,
        available_hours_end,
        available_spaces,
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

// TODO: Rewrite this function
exports.getRentalById = async (req, res) => {
  try {
    const {
      owner_id,
      renter_id,
      listing_id,
      plate_number,
      start_date,
      end_date,
      total_cost,
      remaining_cost,
      status,
    } = req.body;

    db.run(
      `INSERT INTO rents (
          owner_id,
          renter_id,
          listing_id,
          plate_number,
          start_date,
          end_date,
          total_cost,
          remaining_cost,
          status,
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        location_address,
        latitude,
        longitude,
        available_hours_start,
        available_hours_end,
        available_spaces,
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
