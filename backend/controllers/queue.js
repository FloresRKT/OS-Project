const db = require("../db/database");

exports.addUserToQueue = async (req, res) => {
  const {
    listing_id,
    user_id,
    position,
    start_date,
    end_date,
  } = req.body;

  try {
    const result = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO reservation_queue 
           (listing_id, user_id, position, start_date, end_date) 
           VALUES (?, ?, ?, ?, ?)`,
        [
          listing_id,
          user_id,
          position,
          start_date,
          end_date,
        ],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, position });
        }
      );
    });

    res.status(201).json({
      queue_id: result.id,
      position,
      message: "Added to queue successfully",
    });
  } catch (error) {
    console.error("Error adding to queue:", error);
    res.status(500).json({ error: "Failed to add to queue" });
  }
};

exports.getQueueByListingId = async (req, res) => {
  const listingId = req.params.id;

  try {
    const queue = await new Promise((resolve, reject) => {
      db.all(
        `SELECT rq.*, u.first_name || " " || u.last_name as user_name
           FROM reservation_queue rq
           JOIN users u ON rq.user_id = u.user_id
           WHERE rq.listing_id = ? AND rq.status = "pending"
           ORDER BY rq.position ASC`,
        [listingId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    res.json(queue);
  } catch (error) {
    console.error("Error fetching queue:", error);
    res.status(500).json({ error: "Failed to fetch queue" });
  }
};

exports.processQueue = async (req, res) => {
  const listingId = req.params.id;

  try {
    // Get the first person in queue
    const nextInQueue = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM reservation_queue WHERE listing_id = ? AND status = "waiting" ORDER BY position ASC LIMIT 1',
        [listingId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!nextInQueue) {
      return res.status(404).json({ message: "Queue is empty" });
    }

    // Create a new rental from the queue entry
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO rents 
           (owner_id, renter_id, listing_id, plate_number, start_date, end_date, total_cost, remaining_cost, status)
           SELECT 
             (SELECT company_id FROM listings WHERE listing_id = ?), 
             ?, ?, ?, ?, ?, ?, ?, "pending"`,
        [
          listingId,
          nextInQueue.user_id,
          listingId,
          nextInQueue.plate_number,
          nextInQueue.start_date,
          nextInQueue.end_date,
          nextInQueue.total_cost,
          nextInQueue.total_cost,
        ],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    // Update queue entry to processed
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE reservation_queue SET status = "processed" WHERE queue_id = ?',
        [nextInQueue.queue_id],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Reorder remaining queue positions
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE reservation_queue SET position = position - 1 WHERE listing_id = ? AND status = "waiting"',
        [listingId],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({ message: "Queue processed successfully" });
  } catch (error) {
    console.error("Error processing queue:", error);
    res.status(500).json({ error: "Failed to process queue" });
  }
};
