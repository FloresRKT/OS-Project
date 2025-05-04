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

    // Validate required fields
    if (
      !owner_id ||
      !renter_id ||
      !listing_id ||
      !start_date ||
      !end_date ||
      !total_cost
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = `INSERT INTO rents (
      owner_id,
      renter_id,
      listing_id,
      plate_number,
      start_date,
      end_date,
      total_cost,
      remaining_cost,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Prepare parameters with default values if needed
    const params = [
      owner_id,
      renter_id,
      listing_id,
      plate_number || "",
      start_date,
      end_date,
      total_cost,
      remaining_cost !== undefined ? remaining_cost : total_cost,
      status || "pending",
    ];

    db.run(sql, params, function (err) {
      if (err) {
        console.error("Database error:", err.message);
        return res.status(400).json({ error: err.message });
      }
      res.json({
        rent_id: this.lastID,
        message: "Rental created successfully",
      });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new rental in the database
exports.updateRental = async (req, res) => {
  try {
    // Get rent_id from URL params
    const rent_id = req.params.id;
    const { status, remaining_cost, check_in_time, check_out_time } = req.body;

    db.get(
      `SELECT * FROM rents WHERE rent_id = ?`,
      [rent_id],
      (err, currentRental) => {
        if (err) {
          console.error("Error fetching current rental:", err.message);
          return res.status(500).json({ error: err.message });
        }

        if (!currentRental) {
          return res.status(404).json({ error: "Rental not found" });
        }

        console.log(
          `Current rental status: ${currentRental.status}, New status: ${status}`
        );
        console.log(`Associated listing ID: ${currentRental.listing_id}`);

        // Build the SET clause dynamically based on provided fields
        const updates = [];
        const params = [];

        if (status !== undefined) {
          updates.push("status = ?");
          params.push(status);
        }
        if (remaining_cost !== undefined) {
          updates.push("remaining_cost = ?");
          params.push(remaining_cost);
        }
        if (check_in_time !== undefined) {
          updates.push("check_in_time = ?");
          params.push(check_in_time);
        }
        if (check_out_time !== undefined) {
          updates.push("check_out_time = ?");
          params.push(check_out_time);
        }

        // Add the rent_id as the last parameter
        params.push(rent_id);

        if (updates.length === 0) {
          return res.status(400).json({ error: "No fields to update" });
        }

        const query = `UPDATE rents SET ${updates.join(
          ", "
        )} WHERE rent_id = ?`;
        console.log("SQL Query:", query);
        console.log("Parameters:", params);

        // Execute in a transaction to ensure consistency
        db.run("BEGIN TRANSACTION", () => {
          db.run(query, params, function (err) {
            if (err) {
              console.error("Error updating rental:", err.message);
              db.run("ROLLBACK");
              return res.status(400).json({ error: err.message });
            }

            if (this.changes === 0) {
              db.run("ROLLBACK");
              return res.status(404).json({ error: "Rental not found" });
            }

            // Check if the trigger worked by querying the listing
            if (status !== undefined && status !== currentRental.status) {
              db.get(
                `SELECT occupancy FROM listings WHERE listing_id = ?`,
                [currentRental.listing_id],
                (err, listing) => {
                  if (err) {
                    console.error("Error checking occupancy:", err.message);
                    // Continue anyway
                  }

                  console.log(
                    `Current occupancy for listing ${
                      currentRental.listing_id
                    }: ${listing ? listing.occupancy : "unknown"}`
                  );

                  // Check logs table for trigger execution
                  db.all(
                    "SELECT * FROM logs ORDER BY log_id DESC LIMIT 5",
                    [],
                    (err, logs) => {
                      if (err) {
                        console.error("Error checking logs:", err.message);
                      } else if (logs && logs.length > 0) {
                        console.log("Recent trigger logs:", logs);
                      }

                      // Commit the transaction
                      db.run("COMMIT");

                      // Send the response
                      res.json({
                        rent_id: rent_id,
                        message: "Rental updated successfully",
                        changes: this.changes,
                        occupancy: listing ? listing.occupancy : "unknown",
                      });
                    }
                  );
                }
              );
            } else {
              // No status change, just commit and respond
              db.run("COMMIT");
              res.json({
                rent_id: rent_id,
                message: "Rental updated successfully",
                changes: this.changes,
              });
            }
          });
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get rental by ID
exports.getRentalById = async (req, res) => {
  try {
    const rent_id = req.params.id;

    db.get(`SELECT * FROM rents WHERE rent_id = ?`, [rent_id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Rental not found" });
      res.json(row);
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all rentals by user ID
exports.getRentalByUserId = async (req, res) => {
  try {
    const user_id = req.params.id;

    db.all(
      `SELECT r.*, l.unit_number, l.street, l.barangay, l.municipality, 
      l.region, l.zip_code, u.first_name || " " || u.last_name AS renter_name, c.name AS owner_name 
      FROM rents r 
      LEFT JOIN users u ON r.renter_id = u.user_id 
      LEFT JOIN companies c ON r.owner_id = c.company_id
      LEFT JOIN listings l ON r.listing_id = l.listing_id
      WHERE u.user_id = ?`,
      [user_id],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!rows || rows.length === 0)
          return res.status(404).json({ error: "No rentals found" });
        res.json(rows);
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
