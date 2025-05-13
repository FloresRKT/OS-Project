const express = require("express");
const router = express.Router();

const {
  createRental, // POST rents/
  getRentalById, // GET rents/:id
  updateRental, // PUT rents/:id
  getRentalByUserId, // GET rents/users/:id
} = require("../controllers/rents");


// Rental management routes
router.route("/rents").post(createRental); // POST /rents
router
  .route("/rents/:id")
  .get(getRentalById) // GET /rents/123
  .put(updateRental); // PUT /rents/123

router.get("/user-rentals/:id", getRentalByUserId); // GET /user-rentals/1

module.exports = router;