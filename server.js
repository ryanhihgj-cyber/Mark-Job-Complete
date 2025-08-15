app.post('/slack-interaction', async (req, res) => {
  const payload = JSON.parse(req.body.payload);
  const jobName = payload.actions[0].value;

  // Respond to Slack immediately
  res.send({
    response_type: "ephemeral",
    text: `✅ Received request to mark "${jobName}" complete. Processing...`
  });

  // Continue processing in the background
  try {
    await axios.post('https://script.google.com/macros/s/AKfycbxyoh5D_INucY3JmOBYg4t45kfvvWFXDCcg1XgoytEahN-oCbBUCR8qZgsRwvUvt0NB/exec', null, {
      params: { jobName }
    });
  } catch (error) {
    console.error("Error forwarding to Apps Script:", error.message);
  }
});
