// const CampaignModel = require('../models/campaignModel');
import CampaignModel from "../models/campaignModel.js";
import { sendCampaignToExternalService, mapLinksToChannels } from "../services/campaignService.js";
import { takeScreenshot } from "../services/screenshotService.js"; // Import screenshot service

class CampaignController {
    static async createCampaign(req, res, next) {
        try {
            const { camp_num, camp_text, selected_channels } = req.body;
            const userId = req.user.id;

            // Create campaign
            const campaignId = await CampaignModel.createCampaign({
                camp_num,
                camp_text,
                user_id: userId,
            });

            // Create campaign channels
            await CampaignModel.createCampaignChannels(campaignId, selected_channels, camp_num);

            // Fetch the created campaign with channels
            const campaign = await CampaignModel.getCampaignById(campaignId, userId);

            console.log("Created Campaign:", campaign);

            // ⬇️ Send campaign data to external service
            const apiResponse = await sendCampaignToExternalService({
                // id: campaignId,
                // camp_num,
                text: camp_text,
                // user_id: userId,
                // channels: selected_channels,
                // createdAt: campaign.createdAt,
            });

            const channelLinks = mapLinksToChannels(apiResponse, selected_channels);

            // 7. Send postlinks to take screenshots as array and send as response
            const postlinksArr = channelLinks.map((link) => link.post_link);

            const screenshotData = {
                given_url: postlinksArr,
            };

            const screenshotResponse = await takeScreenshot(screenshotData);

            console.log("Screenshot Response:", screenshotResponse);

            if (screenshotResponse.success) {
                // Update the campaign status to "processing"
                await CampaignModel.updateCampaignStatus(campaignId, "processing-to-screenshot");

                if (channelLinks.length > 0) {
                    await CampaignModel.updateChannelPostLinks(campaignId, channelLinks);
                }
            }
            // 10. Return the response
            res.status(201).json({
                status: "success",
                message: "Campaign created successfully",
                data: {
                    campaign,
                    screenshot: screenshotResponse,
                    message: "urls are being processed, please wait",
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getCampaigns(req, res, next) {
        try {
            const userId = req.user.id;
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;

            const campaigns = await CampaignModel.getCampaignsByUserId(userId, limit, offset);

            res.status(200).json({
                status: "success",
                message: "Campaigns retrieved successfully",
                data: {
                    campaigns,
                    pagination: {
                        page,
                        limit,
                        total: campaigns.length,
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getCampaignById(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const campaign = await CampaignModel.getCampaignById(id, userId);

            if (!campaign) {
                return res.status(404).json({
                    status: "error",
                    message: "Campaign not found",
                });
            }

            res.status(200).json({
                status: "success",
                message: "Campaign retrieved successfully",
                data: {
                    campaign,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteCampaign(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const deleted = await CampaignModel.deleteCampaign(id, userId);

            if (!deleted) {
                return res.status(404).json({
                    status: "error",
                    message: "Campaign not found",
                });
            }

            res.status(200).json({
                status: "success",
                message: "Campaign deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

// module.exports = CampaignController;
export default CampaignController;
