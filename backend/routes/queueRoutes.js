const express = require("express");
const router = express.Router();

const {
    addUserToQueue,
    getQueueByListingId,
    processQueue,
} = require("../controllers/queue");

router.use("/queue", addUserToQueue);
router.use("/listings/:id/queue", getQueueByListingId);
router.use("/listings/:id/process-queue", processQueue);

module.exports = router;