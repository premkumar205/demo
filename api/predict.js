const fs = require('fs');
const path = require('path');

// Local Storage Setup (JSON File) - for serverless, use /tmp
const DB_FILE = process.env.VERCEL ? '/tmp/predictions.json' : path.join(__dirname, '../server/predictions.json');

// Initialize the JSON file if it doesn't exist
const initDB = () => {
    try {
        if (!fs.existsSync(DB_FILE)) {
            fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
        }
    } catch (err) {
        console.log('Using in-memory storage');
    }
};

// Prediction Logic (Simple Linear Weighting)
const predictPerformance = (studyHours, attendance, prevScore) => {
    const w_hours = 2.0;
    const w_attendance = 0.2;
    const w_prevScore = 0.6;

    let prediction = (studyHours * w_hours) + (attendance * w_attendance) + (prevScore * w_prevScore);
    const variation = (Math.random() * 5);
    prediction += variation;
    prediction = Math.min(100, Math.max(0, prediction));

    return parseFloat(prediction.toFixed(2));
};

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        return res.status(200).json({ message: 'AI Student Performance Prediction API is Running.' });
    }

    if (req.method === 'POST') {
        try {
            const { studyHours, attendance, prevScore, studentName } = req.body;

            if (studyHours === undefined || attendance === undefined || prevScore === undefined) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const prediction = predictPerformance(Number(studyHours), Number(attendance), Number(prevScore));

            // Try to save to local JSON file
            initDB();
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
                console.log('Storage error (non-critical):', err.message);
            }

            // Determine Status
            let status = 'Pass';
            if (prediction < 40) status = 'Fail';
            else if (prediction >= 75) status = 'Distinction';

            return res.status(200).json({
                success: true,
                data: {
                    prediction,
                    status,
                    message: 'Predicted score based on current metrics.'
                }
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
