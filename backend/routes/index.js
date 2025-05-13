const express = require("express");
const router = express.Router();

// Import route modules
const userRoutes = require("./userRoutes");
const companyRoutes = require("./companyRoutes");
const listingRoutes = require("./listingRoutes");
const rentalRoutes = require("./rentalRoutes");
const queueRoutes = require("./queueRoutes");
const testRoutes = require("./testRoutes");

// Mount routes with appropriate base paths
router.use("/", userRoutes);
router.use("/", companyRoutes);
router.use("/", listingRoutes);
router.use("/", rentalRoutes);
router.use("/", queueRoutes);
router.use("/", testRoutes);

module.exports = router;