const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL; // Add this to your .env file

app.use(cors());
app.use(express.json());

app.post('/receive-data', async (req, res) => {
  res.status(200).send('Received!');
  const payload = req.body;

  if (!slackWebhookUrl || !googleScriptUrl) {
    console.error('Missing webhook or script URL in environment variables.');
    return;
  }

  try {
    // Send message to Slack
    const slackResponse = await axios.post(slackWebhookUrl, {
      text: `New submission received:\n${JSON.stringify(payload, null, 2)}`
    });
    console.log('Slack message sent successfully:', slackResponse.status);

    // Forward payload to Google Apps Script
    const scriptResponse = await axios.post(googleScriptUrl, payload);
    console.log('Google Script response:', scriptResponse.status);
  } catch (error) {
    console.error('Error forwarding data:', error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

