const express = require("express");
const router = express.Router();

const {
  createListing, // POST a new listing
  getAllListings, // GET listing/users
  getCompanyListings, // GET listing/company/:id
  getListingById, // GET listing/:id
  updateListing, // PUT listing/:id
  deleteListing, // DELETE listing/:id
} = require("../controllers/listings");

const { checkIn, checkOut } = require("../controllers/occupancy");

// Listing management routes
router.get("/listings/users", getAllListings);  // GET /listings/users
router.post("/listings/company", createListing);  // POST /listings/company
router.get("/listings/company/:id", getCompanyListings); // GET /listings/company/123
router
  .route("/listings/:id")
  .get(getListingById) // GET /listings/123
  .put(updateListing) // PUT /listings/123
  .delete(deleteListing); // DELETE /listings/123

// Occupancy management routes
router.post("/rentals/:rent_id/check-in", checkIn);
router.post("/rentals/:rent_id/check-out", checkOut);
  
module.exports = router;