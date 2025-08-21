// const express = require("express");
// const CampaignController = require("../controllers/campaignController");
// const { authenticateToken } = require("../middleware/auth");
// const { validateCampaign, handleValidationErrors } = require("../middleware/validation");

import express from "express"; // Use ES6 import if your environment supports it
import CampaignController from "../controllers/campaignController.js";
import screenshotController from "../controllers/screenshotController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateCampaign, handleValidationErrors } from "../middleware/validation.js";

const router = express.Router();

// Apply authentication middleware to all campaign routes
router.use(authenticateToken);

// Campaign routes
router.post("/", validateCampaign, handleValidationErrors, CampaignController.createCampaign);
router.post("/get-screenshot", screenshotController.getScreenshots); // Endpoint to take screenshots

router.get("/", CampaignController.getCampaigns);
router.get("/:id", CampaignController.getCampaignById);
router.delete("/:id", CampaignController.deleteCampaign);

// module.exports = router;
export default router; // Use ES6 export if your environment supports it
