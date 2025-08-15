const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express(); // ✅ This must come before app.post

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/slack-interaction', async (req, res) => {
  const payload = JSON.parse(req.body.payload);
  const jobName = payload.actions[0].value;

  // Respond to Slack immediately to avoid timeout
  res.send({
    response_type: "ephemeral",
    text: `✅ Received request to mark "${jobName}" complete. Processing...`
  });

  // Forward to Apps Script in the background
  try {
    await axios.post('https://script.google.com/macros/s/AKfycbxyoh5D_INucY3JmOBYg4t45kfvvWFXDCcg1XgoytEahN-oCbBUCR8qZgsRwvUvt0NB/exec', null, {
      params: { jobName }
    });
  } catch (error) {
    console.error("Error forwarding to Apps Script:", error.message);
  }
});

app.get('/', (req, res) => {
  res.send('Render backend is running.');
});

app.listen(process.env.PORT || 3000);
