// src/services/campaignService.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const CAMPAIGN_TDLIB_URL =
    process.env.CAMPAIGN_TDLIB_URL || "https://your-webhook-endpoint.com/api/campaigns"; // Set in .env

export const sendCampaignToExternalService = async (campaignData) => {
    try {
        const response = await axios.post(CAMPAIGN_TDLIB_URL, campaignData, {
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

export const mapLinksToChannels = (apiResponse, selectedChannels) => {
    const channelLinks = [];

    const extractChannel = (link) => {
        try {
            const url = new URL(link.trim());
            const pathParts = url.pathname.split("/").filter(Boolean);
            return pathParts[0] ? "@" + pathParts[0].toLowerCase() : null;
        } catch {
            return null;
        }
    };

    // Normalize selected channels
    const channelSet = new Set(selectedChannels.map((c) => c.toLowerCase()));

    if (Array.isArray(apiResponse.data)) {
        apiResponse.data.forEach((msg) => {
            const link = msg.link;
            const username = extractChannel(link);

            if (username && channelSet.has(username.toLowerCase())) {
                channelLinks.push({
                    channel_name: username,
                    post_link: link.trim(),
                });
            }
        });
    }

    return channelLinks;
};
