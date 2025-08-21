const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/mark-complete', async (req, res) => {
  try {
    const payload = JSON.parse(req.body.payload);
    const rowIndex = payload.actions[0].value;

    // Acknowledge Slack immediately
    res.sendStatus(200);

    // Forward to Google Apps Script
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbyOQNCYrOpKsPJ4kgEBTqT6IrrpYTvNolswecOeeIggb5G0kbwhQVO8U5s-2IRZ2GPp/exec';
    const response = await axios.post(scriptUrl, { rowIndex });

    console.log('GAS response:', response.data);
  } catch (error) {
    console.error('Error handling Slack payload:', error);
    res.sendStatus(200); // Still respond to Slack to avoid timeout
  }
});

app.get('/', (req, res) => {
  res.send('Mark Job Complete service is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
