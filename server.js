const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzAkfV8LUEW21rWN_EbomVbJTmeaQORTElHEgyV2aWxElj9xVbN-du2haOB3rEn5Ay7QQ/exec';

app.post('/mark-complete', async (req, res) => {
  try {
    const response = await axios.post(GOOGLE_SCRIPT_URL, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error forwarding to Google Apps Script:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
