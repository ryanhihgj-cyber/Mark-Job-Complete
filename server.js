const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app://script.google.com/macros/s/AKfycbzSOCoHZg7BSi0KfUsIiQptsBfmzVdb0rJvD9m5rqttLp4GHkB2A5Uai8xxYABUZ78tMA/exec';

app.post('/slack/actions', async (req, res) => {
  const payload = JSON.parse(req.body.payload);
  const rowIndex = payload.actions[0].value; // assuming value contains rowIndex
  const responseUrl = payload.response_url;

  // ✅ Respond immediately to Slack
  res.status(200).send();

  try {
    // 🔁 Forward to Google Apps Script
    await axios.post(GOOGLE_SCRIPT_URL, { rowIndex });

    // ✅ Send follow-up message to Slack
    await axios.post(responseUrl, {
      text: `✅ Job marked complete for row ${rowIndex}`
    });
  } catch (error) {
    console.error('Error:', error.message);
    await axios.post(responseUrl, {
      text: `❌ Failed to mark job complete: ${error.message}`
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
