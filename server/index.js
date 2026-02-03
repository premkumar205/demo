const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Local Storage Setup (JSON File)
const DB_FILE = path.join(__dirname, 'predictions.json');

// Initialize the JSON file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
  console.log("Created local database: predictions.json");
}

console.log("Using local JSON file for storage.");

// Prediction Logic (Simple Linear Weighting)
const predictPerformance = (studyHours, attendance, prevScore) => {
  // Model Weights (Simplified for academic mini-project)
  // Max potential score = 100

  // 1. Study Hours (Max 10 hours/day). Weight: 20%
  // 10 hours -> 20 points. 1 hour -> 2 points.
  const w_hours = 2.0;

  // 2. Attendance (0-100%). Weight: 20%
  // 100% -> 20 points.
  const w_attendance = 0.2;

  // 3. Previous Score (0-100). Weight: 60%
  // 100 -> 60 points.
  const w_prevScore = 0.6;

  // Calculate Base Prediction
  let prediction = (studyHours * w_hours) + (attendance * w_attendance) + (prevScore * w_prevScore);

  // Add a small random variation (0-5%) to simulate "real-world" uncertainty
  const variation = (Math.random() * 5);
  prediction += variation;

  // Cap at 100 and Min at 0
  prediction = Math.min(100, Math.max(0, prediction));

  return parseFloat(prediction.toFixed(2));
};

// Routes
app.get('/', (req, res) => {
  res.send('AI Student Performance Prediction API is Running.');
});

app.post('/predict', async (req, res) => {
  try {
    const { studyHours, attendance, prevScore, studentName } = req.body;

    if (studyHours === undefined || attendance === undefined || prevScore === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prediction = predictPerformance(Number(studyHours), Number(attendance), Number(prevScore));

    // Save to local JSON file
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      data.push({
        id: Date.now(),
        student_name: studentName || 'Anonymous',
        study_hours: studyHours,
        attendance: attendance,
        prev_score: prevScore,
        predicted_score: prediction,
        created_at: new Date().toISOString()
      });
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Error saving to local DB:', err);
    }

    // Determine Status
    let status = 'Pass';
    if (prediction < 40) status = 'Fail';
    else if (prediction >= 75) status = 'Distinction';

    res.json({
      success: true,
      data: {
        prediction,
        status,
        message: `Predicted score based on current metrics.`
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
