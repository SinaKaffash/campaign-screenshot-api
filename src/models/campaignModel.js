// const { getConnection } = require("../config/database");
import { getConnection } from "../config/database.js"; // Use ES6 import if your environment supports it

class CampaignModel {
    static async createCampaign(campaignData) {
        const connection = getConnection();
        const { camp_num, camp_text, user_id } = campaignData;

        const [result] = await connection.execute(
            `INSERT INTO campaigns (camp_num, camp_text, user_id, created_at, updated_at) 
       VALUES (?, ?, ?, NOW(), NOW())`,
            [camp_num, camp_text, user_id]
        );

        return result.insertId;
    }

    static async createCampaignChannels(campaignId, channels, camp_num) {
        const connection = getConnection();

        if (!channels || channels.length === 0) return;

        const values = channels.map((channel) => [campaignId, channel, camp_num, new Date()]);
        const placeholders = values.map(() => "(?, ?, ?, ?)").join(", ");
        const flatValues = values.flat();

        await connection.execute(
            `INSERT INTO campaign_channels (campaign_id, channel_name, camp_num, created_at) 
       VALUES ${placeholders}`,
            flatValues
        );
    }

    static updateCampaignStatus(campaignId, status) {
        const connection = getConnection();

        return connection.execute(
            "UPDATE campaigns SET status = ?, updated_at = NOW() WHERE id = ?",
            [status, campaignId]
        );
    }
    static async updateChannelPostLinks(
        campaignId,
        channelLinks,
        status = "processing-to-screenshot"
    ) {
        const connection = getConnection();
        if (!channelLinks || channelLinks.length === 0) return;

        const cases = [];
        const caseValues = [];
        const whereConditions = [];
        const whereValues = [];

        channelLinks.forEach(({ channel_name, post_link }) => {
            cases.push(`WHEN channel_name = ? THEN ?`);
            caseValues.push(channel_name, post_link);

            whereConditions.push(`channel_name = ?`);
            whereValues.push(channel_name);
        });

        const sql = `
        UPDATE campaign_channels
        SET post_link = CASE ${cases.join(" ")} END,
            status = ?
        WHERE campaign_id = ? AND status = "finding-postlink"
        AND (${whereConditions.join(" OR ")})
    `;

        await connection.execute(sql, [...caseValues, status, campaignId, ...whereValues]);
    }
    /*  
    example usage:

    await CampaignModel.updateChannelStatus(
        [failedChannel.channel_name],
        "screenshot_failed"
    );

    */

    static async updateChannelStatus(channelNames, status) {
        const connection = getConnection();
        if (!channelNames || channelNames.length === 0) return;

        const placeholders = channelNames.map(() => "?").join(", ");
        await connection.execute(
            `UPDATE campaign_channels SET status = ?, updated_at = NOW() WHERE channel_name IN (${placeholders})`,
            [status, ...channelNames]
        );
    }

    static async getCampaignById(campaignId, userId) {
        const connection = getConnection();

        const [campaigns] = await connection.execute(
            `SELECT c.*, 
              GROUP_CONCAT(cc.channel_name) as channels
       FROM campaigns c
       LEFT JOIN campaign_channels cc ON c.id = cc.campaign_id 
       WHERE c.id = ? AND c.user_id = ? AND c.camp_num = cc.camp_num AND c.status = 'finding-postlinks' AND cc.status = 'finding-postlink'
       GROUP BY c.id`,
            [campaignId, userId]
        );

        if (campaigns.length === 0) return null;

        const campaign = campaigns[0];
        campaign.selected_channels = campaign.channels ? campaign.channels.split(",") : [];
        delete campaign.channels;

        return campaign;
    }

    static async getCampaignsByUserId(userId, limit = 10, offset = 0) {
        const connection = getConnection();

        const [campaigns] = await connection.execute(
            `SELECT c.*, 
              GROUP_CONCAT(cc.channel_name) as channels
       FROM campaigns c
       LEFT JOIN campaign_channels cc ON c.id = cc.campaign_id
       WHERE c.user_id = ?
       GROUP BY c.id
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
            [userId, limit, offset]
        );

        return campaigns.map((campaign) => {
            campaign.selected_channels = campaign.channels ? campaign.channels.split(",") : [];
            delete campaign.channels;
            return campaign;
        });
    }

    static async deleteCampaign(campaignId, userId) {
        const connection = getConnection();

        // Start transaction
        await connection.beginTransaction();

        try {
            // Delete campaign channels first
            await connection.execute("DELETE FROM campaign_channels WHERE campaign_id = ?", [
                campaignId,
            ]);

            // Delete campaign
            const [result] = await connection.execute(
                "DELETE FROM campaigns WHERE id = ? AND user_id = ?",
                [campaignId, userId]
            );

            await connection.commit();

            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    }

    static async getPostlinks() {}
}

// module.exports = CampaignModel;
export default CampaignModel;
