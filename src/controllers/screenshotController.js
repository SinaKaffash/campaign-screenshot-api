import axios from "axios";
import { takeScreenshot } from "../services/screenshotService.js"; // Import screenshot service
import CampaignModel from "../models/campaignModel.js";

class ScreenshotController {
    static async getScreenshots(req, res, next) {
        try {
            // sample received data:
            /*
            {
                status: 'completed',
                total: 9,
                processed: 9,
                results: [
                    {
                    url: 'https://t.me/akhbarefori/577753',
                    screenshot_url: 'https://bot.test-tlg.ir/screen_images/2025/08/21/577753-1755763271.webp',
                    status: 'success'
                    },
                    {
                    url: 'https://t.me/akhbarefori/576079',
                    screenshot_url: 'https://bot.test-tlg.ir/screen_images/2025/08/21/576079-1755763283.webp',
                    status: 'success'
                    },
                    ...
                ]
            }
            */
            // send the received data to a url in post request
            const options = {
                method: "POST",
                url: "https://your-webhook-endpoint.com/api/screenshot", // Replace with your actual URL
                headers: {
                    "Content-Type": "application/json",
                },
                data: req.body, // Use the request body directly
            };
            const response = await axios(options);
            // if successful, update the status of the campaign channels
            if (response.status === 200) {
                // Update the campaign channels status in your database
                await CampaignModel.updateChannelStatus(req.body.channel_ids, "screenshot_taken");
            }
            console.log("Screenshot data sent successfully:", response.data);
        } catch (error) {
            next(error);
        }
    }
}

// module.exports = CampaignController;
export default ScreenshotController;
