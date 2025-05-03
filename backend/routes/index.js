const express = require("express");
const router = express.Router();
const db = require("../db/database");

const {
  getUsers, // GET all users
  createUser, // POST a new user
  loginUser, // POST users/login
  getUserById, // GET users/:id
  updateUser, // PUT users/:id
  deleteUser, // DELETE users/:id
} = require("../controllers/users");

const {
  createListing, // POST a new listing
  getAllListings, // GET listing/
  getListingById, // GET listing/:id
  updateListing, // PUT listing/:id
  deleteListing, // DELETE listing/:id
} = require("../controllers/listings");

const {
  createRental, // POST a new rental
  getRentalById, // GET rental/:id
  updateRental, // PUT rental/:id
} = require("../controllers/rents");

// RESTful routes
router
  .route("/users")
  .get(getUsers) // GET /users
  .post(createUser); // POST /users

router.post("/users/login", loginUser); // POST /users/login

router
  .route("/users/:id")
  .get(getUserById) // GET /users/123
  .put(updateUser) // PUT /users/123
  .delete(deleteUser); // DELETE /users/123

router
  .route("/listings")
  .post(createListing) // POST /listings
  .get(getAllListings); // GET /listings

router
  .route("/listings/:id")
  .get(getListingById) // GET /listings/123
  .put(updateListing) // PUT /listings/123
  .delete(deleteListing); // DELETE /listings/123

router.route("/rents").post(createRental); // POST /listings

router
  .route("/rents/:id")
  .get(getRentalById) // GET /rents/123
  .put(updateRental); // PUT /rents/123

// router.get("/listings/:id/earnings", getListingEarnings);
// router.get("/listings/:id/occupancy", getListingOccupancy);
// router.get("/users/:id/dashboard", getDashboardMetrics);

module.exports = router;
