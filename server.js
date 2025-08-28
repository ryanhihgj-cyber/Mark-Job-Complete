const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzSOCoHZg7BSi0KfUsIiQptsBfmzVdb0rJvD9m5rqttLp4GHkB2A5Uai8xxYABUZ78tMA/exec';

app.post('/slack/actions', async (req, res) => {
  try {
    const payload = JSON.parse(req.body.payload);
    const rowIndex = payload.actions[0].value;
    const responseUrl = payload.response_url;

    // ✅ Respond immediately to Slack to keep buttons visible
    res.status(200).send();

    // 🔁 Forward to Google Apps Script
    const scriptResponse = await axios.post(GOOGLE_SCRIPT_URL, { rowIndex });

    // ✅ Send a subtle follow-up (optional)
    if (scriptResponse.data.success) {
      await axios.post(responseUrl, {
        response_type: "ephemeral",
        text: `✅ Job marked complete.`
      });
    } else {
      await axios.post(responseUrl, {
        response_type: "ephemeral",
        text: `❌ Failed to mark job complete.`
      });
    }
  } catch (error) {
    console.error('Slack action error:', error.message);

    try {
      const payload = JSON.parse(req.body.payload);
      await axios.post(payload.response_url, {
        response_type: "ephemeral",
        text: `❌ Server error: ${error.message}`
      });
    } catch (err) {
      console.error('Failed to send error response to Slack:', err.message);
    }

    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
