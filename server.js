const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/slack-interaction', async (req, res) => {
  const payload = JSON.parse(req.body.payload);
  const jobName = payload.actions[0].value;

  await axios.post('https://script.google.com/macros/s/AKfycbxyoh5D_INucY3JmOBYg4t45kfvvWFXDCcg1XgoytEahN-oCbBUCR8qZgsRwvUvt0NB/exec', null, {
    params: { jobName }
  });

  res.send({ text: `✅ Job \"${jobName}\" marked complete.` });
});

app.get('/', (req, res) => {
  res.send('Render backend is running.');
});

app.listen(process.env.PORT || 3000);
