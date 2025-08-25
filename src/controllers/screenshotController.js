import axios from "axios";
import { takeScreenshot, uploadScreenshot } from "../services/screenshotService.js"; // Import screenshot service
import CampaignModel from "../models/campaignModel.js";

class ScreenshotController {
    static async getScreenshots(req, res, next) {
        try {
            // sample received data structure
            /*
            {
                status: 'completed',
                total: 9,
                processed: 9,
                channel_ids: ["ch1","ch2"],
                results: [
                    {
                        url: 'https://t.me/akhbarefori/577753',
                        screenshot_url: 'https://bot.test-tlg.ir/screen_images/2025/08/21/577753-1755763271.webp',
                        status: 'success'
                    },
                    ...
                ]
            }
            */

            // loop through results
            for (const postObj of req.body.results) {
                if (postObj.status !== "success") {
                    // if you have channelLinks from db or request body, use it
                    const failedChannel = (req.body.channelLinks || []).find(
                        (ch) => ch.post_link === postObj.url
                    );

                    console.log("Failed Channel:", failedChannel);
                    if (failedChannel) {
                        await CampaignModel.updateChannelStatus(
                            [failedChannel.channel_name],
                            "screenshot_failed"
                        );
                    }
                }
            }

            // map received screenshot urls to local paths
            const imagePath = req.body.results.map((item) =>
                item.screenshot_url.replace(
                    "https://bot.test-tlg.ir",
                    "/home/test-tlg/domains/bot.test-tlg.ir/public_html"
                )
            );

            console.log("Image paths:", imagePath);

            // upload screenshots
            const response = await uploadScreenshot(imagePath);

            // if successful, update the status of the campaign channels
            if (response.succeeded === true) {
                await CampaignModel.updateChannelStatus(req.body.channel_ids, "screenshot_taken");
            }

            console.log("Screenshot data sent successfully:", response.data);

            res.status(200).json({
                status: "success",
                message: "Screenshots processed and uploaded successfully",
                data: response.data,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default ScreenshotController;
