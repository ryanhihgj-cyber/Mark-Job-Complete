const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

// ✅ Slack sends payloads as URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 🔗 Your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzSOCoHZg7BSi0KfUsIiQptsBfmzVdb0rJvD9m5rqttLp4GHkB2A5Uai8xxYABUZ78tMA/exec';

// ✅ Slack interactive button handler
app.post('/slack/actions', async (req, res) => {
  try {
    // Parse Slack payload
    const payload = JSON.parse(req.body.payload);
    const rowIndex = payload.actions[0].value;
    const responseUrl = payload.response_url;

    // Respond immediately to avoid Slack timeout
    res.status(200).send();

    // Forward to Google Apps Script
    await axios.post(GOOGLE_SCRIPT_URL, { rowIndex });

    // Send follow-up message to Slack
    await axios.post(responseUrl, {
      text: `✅ Job marked complete for row ${rowIndex}`
    });
  } catch (error) {
    console.error('Slack action error:', error.message);

    // Respond with error message to Slack
    if (req.body.payload) {
      const payload = JSON.parse(req.body.payload);
      await axios.post(payload.response_url, {
        text: `❌ Failed to mark job complete: ${error.message}`
      });
    }

    res.status(500).send('Internal Server Error');
  }
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
