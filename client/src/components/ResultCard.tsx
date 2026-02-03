import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ResultCardProps {
    prediction: number;
    status: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ prediction, status }) => {
    let color = 'text-green-400';
    let Icon = CheckCircle;
    let message = 'Excellent Performance!';

    if (prediction < 40) {
        color = '#ef4444'; // Red
        Icon = XCircle;
        message = 'At Risk - Needs Improvement';
    } else if (prediction < 75) {
        color = '#f59e0b'; // Amber
        Icon = AlertTriangle;
        message = 'Good - Can do better';
    } else {
        color = '#10b981'; // Green
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel"
            style={{ padding: '2rem', textAlign: 'center', marginTop: '2rem' }}
        >
            <h3 style={{ color: '#94a3b8', marginBottom: '1rem' }}>Predicted Score</h3>

            <div style={{ position: 'relative', display: 'inline-block' }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#334155" strokeWidth="10" />
                    <motion.circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke={color}
                        strokeWidth="10"
                        strokeDasharray="339.292"
                        strokeDashoffset={339.292 - (339.292 * prediction) / 100}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 339.292 }}
                        animate={{ strokeDashoffset: 339.292 - (339.292 * prediction) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        transform="rotate(-90 60 60)"
                    />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {prediction}%
                </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: color }}>
                <Icon size={24} color={color} />
                <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>{status}</span>
            </div>
            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>{message}</p>
        </motion.div>
    );
};

export default ResultCard;
