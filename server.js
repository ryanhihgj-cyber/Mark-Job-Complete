const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

app.use(cors());
app.use(express.json());

app.post('/receive-data', async (req, res) => {
  // Respond immediately to avoid timeout
  res.status(200).send('Received!');

  const payload = req.body;

  if (!slackWebhookUrl) {
    console.error('SLACK_WEBHOOK_URL is not defined in environment variables.');
    return;
  }

  try {
    const response = await axios.post(slackWebhookUrl, {
      text: `New submission received:\n${JSON.stringify(payload, null, 2)}`
    });
    console.log('Slack message sent successfully:', response.status);
  } catch (error) {
    console.error('Error sending to Slack:', error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
