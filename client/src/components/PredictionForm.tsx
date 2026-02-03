import { useState } from 'react';
import { BookOpen, UserCheck, BarChart2, Zap } from 'lucide-react';
import axios from 'axios';
import ResultCard from './ResultCard';

const PredictionForm: React.FC = () => {
    const [formData, setFormData] = useState({
        studyHours: '',
        attendance: '',
        prevScore: '',
    });
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            // Use relative URL for Vercel, absolute for local dev
            const apiUrl = import.meta.env.DEV ? 'http://localhost:3000/predict' : '/api/predict';
            const response = await axios.post(apiUrl, {
                studyHours: Number(formData.studyHours),
                attendance: Number(formData.attendance),
                prevScore: Number(formData.prevScore),
            });

            setResult(response.data.data);
        } catch (err) {
            setError('Failed to get prediction. Ensure backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Enter Details</h2>

                <div style={{ marginBottom: '1rem' }}>
                    <label><BookOpen size={16} style={{ display: 'inline', marginRight: '5px' }} /> Daily Study Hours (0-10)</label>
                    <input
                        type="number"
                        name="studyHours"
                        min="0" max="24"
                        value={formData.studyHours}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 5"
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label><UserCheck size={16} style={{ display: 'inline', marginRight: '5px' }} /> Attendance (%)</label>
                    <input
                        type="number"
                        name="attendance"
                        min="0" max="100"
                        value={formData.attendance}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 85"
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label><BarChart2 size={16} style={{ display: 'inline', marginRight: '5px' }} /> Previous Score (0-100)</label>
                    <input
                        type="number"
                        name="prevScore"
                        min="0" max="100"
                        value={formData.prevScore}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 78"
                    />
                </div>

                {error && <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}

                <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} disabled={loading}>
                    {loading ? 'Analyzing...' : <><Zap size={18} /> Predict Performance</>}
                </button>
            </form>

            {result && <ResultCard prediction={result.prediction} status={result.status} />}
        </div>
    );
};

export default PredictionForm;
