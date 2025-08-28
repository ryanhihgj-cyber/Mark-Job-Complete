const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/slack', async (req, res) => {
  try {
    const payload = JSON.parse(req.body.payload);
    const rowIndex = parseInt(payload.actions[0].value, 10);

    const response = await axios.post(SCRIPT_URL, { rowIndex });

    res.status(200).send(); // Slack expects a 200 OK
  } catch (error) {
    console.error('Error forwarding to Apps Script:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
