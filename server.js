const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/mark-complete', async (req, res) => {
  try {
    const payload = JSON.parse(req.body.payload);
    const rowIndex = payload.actions[0].value; // row index sent from Slack

    // Ack Slack immediately
    res.sendStatus(200);

    // Update Slack message
    try {
      await axios.post(payload.response_url, {
        replace_original: true,
        text: `✅ Job at row ${rowIndex} marked complete!`
      });
    } catch (slackErr) {
      console.error('Failed to update Slack message:', slackErr.response?.data || slackErr.message);
    }

    // Forward to GAS (use query params so GAS sees it in e.parameter)
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbyOQNCYrOpKsPJ4kgEBTqT6IrrpYTvNolswecOeeIggb5G0kbwhQVO8U5s-2IRZ2GPp/exec';
    try {
      const response = await axios.post(scriptUrl, null, {
        params: { rowIndex }
      });
      console.log('GAS response:', response.data);
    } catch (gasErr) {
      console.error('Failed to call GAS:', gasErr.response?.data || gasErr.message);
    }

  } catch (error) {
    console.error('Error handling Slack payload:', error);
    res.sendStatus(200);
  }
});

app.get('/', (req, res) => {
  res.send('Mark Job Complete service is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

