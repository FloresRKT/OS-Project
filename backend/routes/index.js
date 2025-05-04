const express = require("express");
const router = express.Router();
const db = require("../db/database");

const {
  getUsers, // GET all users
  createUser, // POST a new user
  createCompany, // POST a new company
  loginCompany, // POST company/login
  loginUser, // POST users/login
  getUserById, // GET users/:id
  getCompanyById, // GET company/:id
  updateUser, // PUT users/:id
  deleteUser, // DELETE users/:id
  deleteTestUsers, // DELETE test users
  deleteTestCompanies, // DELETE test companies
} = require("../controllers/users");

const {
  createListing, // POST a new listing
  getAllListings, // GET listing/
  getListingById, // GET listing/:id
  updateListing, // PUT listing/:id
  deleteListing, // DELETE listing/:id
} = require("../controllers/listings");

const {
  createRental, // POST rents/
  getRentalById, // GET rents/:id
  updateRental, // PUT rents/:id
  getRentalByUserId, // GET rents/users/:id
} = require("../controllers/rents");

const { addUserToQueue, getQueueByListingId, processQueue } = require("../controllers/queue");

const { checkIn, checkOut } = require("../controllers/occupancy");
  
// User management routes
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

router.post("/company", createCompany); // POST /company
router.post("/company/login", loginCompany); // POST /company/login
router.get("/company/:id", getCompanyById); // GET /company/123
  
// Listing management routes
router
  .route("/listings")
  .post(createListing) // POST /listings
  .get(getAllListings); // GET /listings
router
  .route("/listings/:id")
  .get(getListingById) // GET /listings/123
  .put(updateListing) // PUT /listings/123
  .delete(deleteListing); // DELETE /listings/123

// Rental management routes
router.route("/rents").post(createRental); // POST /rents
router
  .route("/rents/:id")
  .get(getRentalById) // GET /rents/123
  .put(updateRental); // PUT /rents/123

router.get("/user-rentals/:id", getRentalByUserId); // GET /user-rentals/1

// Occupancy management routes
router.post("/rentals/:rent_id/check-in", checkIn);
router.post("/rentals/:rent_id/check-out", checkOut);

// Queue management routes
router.post('/queue', addUserToQueue); // POST /api/queue
router.get('/listings/:id/queue', getQueueByListingId); // GET /api/listings/:id/queue
router.post("/listings/:id/process-queue", processQueue); // GET /api/listings/:id/process-queue

// Special route for cleaning up test data
router.delete("/cleanup/test-users", deleteTestUsers);
router.delete("/cleanup/test-companies", deleteTestCompanies);

module.exports = router;
