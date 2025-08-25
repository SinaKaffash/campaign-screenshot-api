// src/services/campaignService.js
import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";
import fs from "fs";

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

export async function uploadScreenshot(imagePath) {
    const form = new FormData();
    form.append("image", fs.createReadStream(imagePath));

    const url = "https://ads.bamatop.ir/api/v1/fileuploader/?folder=robot";
    const headers = {
        ...form.getHeaders(),
        Accept: "application/json, text/plain, /",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjhlMmU4NDEwLTE0MDEtNDM0MC1hN2FkLTM5OWU5MTRiNGFjMCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IiIsImZ1bGxOYW1lIjoi2LHYqNin2KraqdmF2b7bjNmGIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InJvYm90QGNhbXBhaWduLmNvbSIsImlwQWRkcmVzcyI6IjgzLjEyMi4xNjguMjQzIiwidGVuYW50Ijoicm9vdCIsInJvbGVzIjoiW1wicm9ib3RcIixcImJhc2ljXCJdIiwiY2lkIjoiMCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL21vYmlsZXBob25lIjoiMDk5OTk5OTk5OTkiLCJleHAiOjE3NTU0OTg1NTl9.IfJ-iiVHMDIKcOOU0HS6xNc20aUpZVSemz8J2Gy13QQ",
        Connection: "keep-alive",
        Origin: "http://localhost:5173",
        Referer: "http://localhost:5173/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        "accept-language": "en",
        "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        tenant: "root",
    };

    try {
        const response = await axios.post(url, form, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
}
