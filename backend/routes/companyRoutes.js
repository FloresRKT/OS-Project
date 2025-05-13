const express = require("express");
const router = express.Router();

const {
  createCompany, // POST a new company
  loginCompany, // POST company/login
  getCompanyById, // GET company/:id
} = require("../controllers/users");

// Company routes
router.post("/company", createCompany); // POST /company
router.post("/company/login", loginCompany); // POST /company/login
router.get("/company/:id", getCompanyById); // GET /company/123

module.exports = router;