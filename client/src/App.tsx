
import { motion } from 'framer-motion';
import { BrainCircuit, GraduationCap } from 'lucide-react';
import PredictionForm from './components/PredictionForm';

function App() {
  return (
    <div className="min-h-screen">
      <nav style={{
        padding: '1.5rem 2rem',
        borderBottom: '1px solid var(--glass-border)',
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            padding: '0.5rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BrainCircuit color="white" size={24} />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            EduPredict.AI
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
          <GraduationCap size={20} />
          <span style={{ fontSize: '0.9rem' }}>Student Performance System</span>
        </div>
      </nav>

      <main className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '600px' }}
        >
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>
            Predict Your Academic <span style={{ color: '#3b82f6' }}>Future</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
            Leverage our advanced AI model to forecast your exam performance based on your study habits and historical data.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          style={{ width: '100%', maxWidth: '500px' }}
        >
          <PredictionForm />
        </motion.div>
      </main>

      <footer style={{ textAlign: 'center', padding: '2rem', color: '#475569', fontSize: '0.8rem' }}>
        &copy; {new Date().getFullYear()} AI Student Performance Prediction System. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
