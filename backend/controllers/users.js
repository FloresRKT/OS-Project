const db = require("../db/database");

// Create user
exports.createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, plate_number } = req.body;

    db.run(
      `INSERT INTO users (first_name, last_name, email, password, plate_number) 
       VALUES (?, ?, ?, ?, ?)`,
      [first_name, last_name, email, password, plate_number],
      function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({
          user_id: this.lastID,
          message: "User created successfully",
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create company
exports.createCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    db.run(
      `INSERT INTO companies (name, email, password) 
       VALUES (?, ?, ?)`,
      [name, email, password],
      function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({
          user_id: this.lastID,
          message: "User created successfully",
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Login Company
exports.loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    db.get(
      `SELECT * FROM companies WHERE email=? AND password=?`,
      [email, password],

      // Error handling and response
      (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
          res.json({
            user_id: row.company_id,
            message: "Company signed in successfully",
          });
        } else {
          res.status(401).json({ error: "Invalid email or password" });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    db.get(
      `SELECT * FROM users WHERE email=? AND password=?`,
      [email, password],

      // Error handling and response
      (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
          res.json({
            user_id: row.user_id,
            message: "User signed in successfully",
          });
        } else {
          res.status(401).json({ error: "Invalid email or password" });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows || []);
    }
  });
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user_id = req.params.id;
    db.get(
      `SELECT * FROM users WHERE user_id=?`,
      [ user_id ],

      // Error handling and response
      (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
          res.json(row);
        } else {
          res.status(404).json({ error: "User not found" });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company_id = req.params.id;
    db.get(
      `SELECT * FROM companies WHERE company_id=?`,
      [ company_id ],

      // Error handling and response
      (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
          res.json(row);
        } else {
          res.status(404).json({ error: "Company not found" });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update user details. Currently changes all fields, change this later and specify
// only necessary fields
exports.updateUser = async (req, res) => {
  try {
    const { user_id, user_type, name, email, password, device_id } = req.body;

    db.run(
      `UPDATE users SET user_type=?, name=?, email=?, password=?, device_id=? WHERE user_id=?`,
      [user_type, name, email, password, device_id, user_id],
      function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({
          message: "User updated successfully",
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user_id= req.params.id;
    db.run(`DELETE FROM users WHERE user_id=?`, [user_id], function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({
        message: "User deleted successfully",
      });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete test users
exports.deleteTestUsers = async (req, res) => {
  try {
    // Delete users with test emails
    db.run(`DELETE FROM users WHERE email LIKE '%test%' OR email LIKE '%example%'`, 
      function (err) {
        if (err) return res.status(400).json({ error: err.message });
        
        res.json({
          message: "Test users deleted successfully",
          rowsAffected: this.changes
        });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete test users
exports.deleteTestCompanies = async (req, res) => {
  try {
    // Delete users with test emails
    db.run(`DELETE FROM companies WHERE email LIKE '%test%' OR email LIKE '%example%'`, 
      function (err) {
        if (err) return res.status(400).json({ error: err.message });
        
        res.json({
          message: "Test companies deleted successfully",
          rowsAffected: this.changes
        });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};