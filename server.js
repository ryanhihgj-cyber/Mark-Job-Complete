const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware to parse URL-encoded and JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint to handle Slack button interactions
app.post('/mark-complete', (req, res) => {
  try {
    const payload = JSON.parse(req.body.payload);
    const jobName = payload.actions[0].value;

    // Respond to Slack immediately to avoid timeout
    res.status(200).send({
      text: `✅ Marking *${jobName}* complete...`
    });

    // Forward jobName to your Apps Script endpoint asynchronously
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxyoh5D_INucY3JmOBYg4t45kfvvWFXDCcg1XgoytEahN-oCbBUCR8qZgsRwvUvt0NB/exec';

    axios.post(scriptUrl, null, {
      params: { jobName }
    }).then(response => {
      console.log(`Marked ${jobName} complete:`, response.data);
    }).catch(error => {
      console.error(`Failed to mark ${jobName} complete:`, error);
    });

  } catch (error) {
    console.error('Error parsing Slack payload:', error);
    res.status(200).send({ text: '⚠️ Failed to process request.' });
  }
});

// Root endpoint for testing
app.get('/', (req, res) => {
  res.send('Mark Job Complete service is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
