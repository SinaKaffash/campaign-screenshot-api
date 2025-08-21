// index.js

// Import necessary libraries
// 'node-cron' for scheduling tasks
// 'axios' for making HTTP requests
const cron = require("node-cron");
const axios = require("axios");

// --- Configuration ---
// Replace these with your actual URLs
const FIRST_API_URL = "https://api.example.com/source";
const SECOND_API_URL = "https://api.example.com/destination";

// Cron schedule for every two hours.
// The pattern is: 'minute hour day-of-month month day-of-week'
// '0 */2 * * *' means at minute 0 of every 2nd hour.
const CRON_SCHEDULE = "0 */2 * * *";

/**
 * This is the main function that will be executed by the cron job.
 * It sends a POST request to the first URL, processes the response,
 * and then sends another POST request to the second URL.
 */
const performApiRequests = async () => {
    console.log(`[${new Date().toISOString()}] Running cron job...`);

    try {
        // --- Step 1: First POST Request ---
        console.log(`Sending POST request to ${FIRST_API_URL}`);

        // The data you want to send in the first request.
        const initialData = {
            id: 123,
            message: "Hello from the cron job!",
        };

        // Await the response from the first API call
        const firstResponse = await axios.post(FIRST_API_URL, initialData);
        console.log("Successfully received response from first API.");
        // console.log('First API Response Data:', firstResponse.data); // Uncomment for debugging

        // --- Step 2: Process the response and make the Second POST Request ---

        // Extract the specific data you need from the first response.
        // For this example, let's assume the response has an object like: { "token": "xyz789", "status": "success" }
        // and we need to pass the token to the next request.
        const dataFromFirstResponse = firstResponse.data;
        const requiredToken = dataFromFirstResponse.token; // Adjust this key based on the actual response structure

        if (!requiredToken) {
            console.error("Error: Token not found in the response from the first API.");
            return; // Stop execution if the required data is missing
        }

        // Prepare the data for the second request
        const secondRequestData = {
            authToken: requiredToken,
            source: "cron-job-processor",
            timestamp: new Date().toISOString(),
        };

        console.log(`Sending POST request to ${SECOND_API_URL}`);
        const secondResponse = await axios.post(SECOND_API_URL, secondRequestData);

        console.log("Successfully sent data to the second API.");
        // console.log('Second API Response Data:', secondResponse.data); // Uncomment for debugging

        console.log(`[${new Date().toISOString()}] Cron job finished successfully.`);
    } catch (error) {
        // --- Error Handling ---
        console.error(
            `[${new Date().toISOString()}] An error occurred during the cron job execution:`
        );
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Data:", error.response.data);
            console.error("Status:", error.response.status);
            console.error("Headers:", error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error("Request Error:", error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error Message:", error.message);
        }
    }
};

// --- Cron Job Scheduling ---
// Schedule the 'performApiRequests' function to run based on the CRON_SCHEDULE.
cron.schedule(CRON_SCHEDULE, performApiRequests);

console.log(`Cron job scheduled to run every two hours. Waiting for the next scheduled run.`);
console.log(
    'To test, you can temporarily change the CRON_SCHEDULE to "* * * * *" to run it every minute.'
);
