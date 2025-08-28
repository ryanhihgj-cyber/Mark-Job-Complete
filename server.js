const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

app.use(cors());
app.use(express.json());

app.post('/receive-data', (req, res) => {
  // Respond immediately to avoid timeout
  res.status(200).send('Received!');

  // Handle Slack notification asynchronously
  const payload = req.body;

  axios.post(slackWebhookUrl, {
    text: `New submission received:\n${JSON.stringify(payload, null, 2)}`
  })
  .then(() => console.log('Slack message sent successfully'))
  .catch(err => console.error('Error sending to Slack:', err));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
