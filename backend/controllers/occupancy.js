const db = require("../db/database");

// Check-in: Mark rental as active and update occupancy
exports.checkIn = async (req, res) => {
  const { rent_id } = req.params;
  
  // Use a transaction to ensure consistency
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    try {
      // 1. Update rental status to active
      db.run(
        `UPDATE rents 
         SET status = 'active', check_in_time = CURRENT_TIMESTAMP 
         WHERE rent_id = ? AND status = 'pending'`,
        [rent_id],
        function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(400).json({ error: err.message });
          }
          
          if (this.changes === 0) {
            db.run('ROLLBACK');
            return res.status(404).json({ 
              error: "Rental not found or already checked in" 
            });
          }
          
          // 2. Get the listing_id for this rental
          db.get(
            `SELECT listing_id FROM rents WHERE rent_id = ?`, 
            [rent_id], 
            (err, row) => {
              if (err || !row) {
                db.run('ROLLBACK');
                return res.status(400).json({ error: err?.message || "Rental not found" });
              }
              
              const listing_id = row.listing_id;
              
              // 3. Update listing occupancy
              db.run(
                `UPDATE listings 
                 SET occupancy = occupancy + 1 
                 WHERE listing_id = ?`,
                [listing_id],
                function(err) {
                  if (err) {
                    db.run('ROLLBACK');
                    return res.status(400).json({ error: err.message });
                  }
                  
                  // 4. Commit transaction if everything succeeded
                  db.run('COMMIT', err => {
                    if (err) {
                      db.run('ROLLBACK');
                      return res.status(400).json({ error: err.message });
                    }
                    
                    res.json({ 
                      message: "Check-in successful", 
                      rent_id: rent_id,
                      listing_id: listing_id 
                    });
                  });
                }
              );
            }
          );
        }
      );
    } catch (err) {
      db.run('ROLLBACK');
      res.status(500).json({ error: "Server error" });
    }
  });
};

// Check-out: Mark rental as completed and update occupancy
exports.checkOut = async (req, res) => {
  const { rent_id } = req.params;
  
  // Use a transaction to ensure consistency
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    try {
      // 1. Update rental status to completed
      db.run(
        `UPDATE rents 
         SET status = 'completed', check_out_time = CURRENT_TIMESTAMP 
         WHERE rent_id = ? AND status = 'active'`,
        [rent_id],
        function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(400).json({ error: err.message });
          }
          
          if (this.changes === 0) {
            db.run('ROLLBACK');
            return res.status(404).json({ 
              error: "Rental not found or not checked in" 
            });
          }
          
          // 2. Get the listing_id for this rental
          db.get(
            `SELECT listing_id FROM rents WHERE rent_id = ?`, 
            [rent_id], 
            (err, row) => {
              if (err || !row) {
                db.run('ROLLBACK');
                return res.status(400).json({ error: err?.message || "Rental not found" });
              }
              
              const listing_id = row.listing_id;
              
              // 3. Update listing occupancy
              db.run(
                `UPDATE listings 
                 SET occupancy = MAX(0, occupancy - 1) 
                 WHERE listing_id = ?`,
                [listing_id],
                function(err) {
                  if (err) {
                    db.run('ROLLBACK');
                    return res.status(400).json({ error: err.message });
                  }
                  
                  // 4. Commit transaction if everything succeeded
                  db.run('COMMIT', err => {
                    if (err) {
                      db.run('ROLLBACK');
                      return res.status(400).json({ error: err.message });
                    }
                    
                    res.json({ 
                      message: "Check-out successful", 
                      rent_id: rent_id,
                      listing_id: listing_id 
                    });
                  });
                }
              );
            }
          );
        }
      );
    } catch (err) {
      db.run('ROLLBACK');
      res.status(500).json({ error: "Server error" });
    }
  });
};