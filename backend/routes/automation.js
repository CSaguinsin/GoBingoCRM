// automation.js
const { spawn } = require('child_process');
const express = require('express');
const router = express.Router();

router.post('/fill-form', async (req, res) => {
  const { recordData } = req.body;
  
  // Spawn Python process
  const pythonProcess = spawn('python', [
    './services/selenium/form_filler.py',
    JSON.stringify(recordData)
  ]);

  // Handle Python script output
  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python Output: ${data}`);
  });

  // Handle completion
  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: 'Automation failed' });
    }
    res.json({ success: true });
  });
});

module.exports = router;