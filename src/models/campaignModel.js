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

    static async createCampaignChannels(campaignId, channels) {
        const connection = getConnection();

        if (!channels || channels.length === 0) return;

        const values = channels.map((channel) => [campaignId, channel, new Date()]);
        const placeholders = values.map(() => "(?, ?, ?)").join(", ");
        const flatValues = values.flat();

        await connection.execute(
            `INSERT INTO campaign_channels (campaign_id, channel_name, created_at) 
       VALUES ${placeholders}`,
            flatValues
        );
    }

    static async getCampaignById(campaignId, userId) {
        const connection = getConnection();

        const [campaigns] = await connection.execute(
            `SELECT c.*, 
              GROUP_CONCAT(cc.channel_name) as channels
       FROM campaigns c
       LEFT JOIN campaign_channels cc ON c.id = cc.campaign_id
       WHERE c.id = ? AND c.user_id = ?
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
}

// module.exports = CampaignModel;
export default CampaignModel;
