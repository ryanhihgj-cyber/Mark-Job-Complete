const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Mark Job Complete Integration</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
          background-color: #f9f9f9;
          color: #333;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        h1 {
          color: #2c3e50;
        }
        a {
          color: #0077cc;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        p {
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <h1>Mark Job Complete Integration</h1>

      <p>🔗 <strong>Render Backend:</strong><br>
        <a href="https://mark-job-complete.onrender.com" target="_blank">
          https://mark-job-complete.onrender.com
       tps://script.google.com/macros/s/AKfycbzSOCoHZg7BSi0KfUsIiQptsBfmzVdb0rJvD9m5rqttLp4GHkB2A5Uai8xxYABUZ78tMA/exec
      </p>

      <p>This integration allows Slack button clicks to trigger job completion updates in your Google Sheet via Render and Apps Script.</p>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
