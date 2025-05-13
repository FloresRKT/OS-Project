const express = require("express");
const router = express.Router();

const {
  deleteTestUsers, // DELETE test users
  deleteTestCompanies, // DELETE test companies
} = require("../controllers/users");

router.delete("/cleanup/test-users", deleteTestUsers);
router.delete("/cleanup/test-companies", deleteTestCompanies);

module.exports = router;