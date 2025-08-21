// src/services/campaignService.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const SCREENSHOT_URL =
    process.env.SCREENSHOT_URL || "https://your-webhook-endpoint.com/api/screenshot"; // Set in .env

export const takeScreenshot = async (screenshotData) => {
    try {
        const response = await axios.post(SCREENSHOT_URL, screenshotData, {
            headers: {
                "Content-Type": "application/json",
            },
            // timeout: 5000, // Set a timeout for the request
        });

        // console.log("✅ Campaign sent successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Failed to send campaign to external service:",
            error.response?.data || error.message
        );
        throw new Error(`Failed to notify external service: ${error.message}`);
    }
};
