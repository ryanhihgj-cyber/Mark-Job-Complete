const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware to parse URL-encoded and JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint to handle Slack button interactions
app.post('/mark-complete', async (req, res) => {
  try {
    const payload = JSON.parse(req.body.payload);
    const jobName = payload.actions[0].value;

    // Forward jobName to your Apps Script endpoint
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxyoh5D_INucY3JmOBYg4t45kfvvWFXDCcg1XgoytEahN-oCbBUCR8qZgsRwvUvt0NB/exec'; // Replace with your actual Apps Script URL

    await axios.post(scriptUrl, null, {
      params: { jobName }
    });

    res.status(200).send({ text: `✅ Job *${jobName}* marked complete.` });
  } catch (error) {
    console.error('Error marking job complete:', error);
    res.status(500).send({ text: '❌ Failed to mark job complete.' });
  }
});

// Root endpoint for testing
app.get('/', (req, res) => {
  res.send('Mark Job Complete service is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
