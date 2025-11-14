import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

export default function StudyTip({ tip, darkMode }) {
  if (!tip) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card mb-6"
      style={{
        background: darkMode
          ? 'linear-gradient(to right, rgba(30, 58, 138, 0.2), rgba(88, 28, 135, 0.2))'
          : 'linear-gradient(to right, #eff6ff, #faf5ff)'
      }}
    >
      <div className="flex items-start">
        <FaStar className="text-yellow-500 text-2xl mr-3 flex-shrink-0 mt-1" />
        <div>
          <h2 className="text-xl font-bold mb-2">Study Tip</h2>
          <p className="leading-relaxed" style={{ 
            color: darkMode ? '#d1d5db' : '#374151' 
          }}>{tip}</p>
        </div>
      </div>
    </motion.div>
  );
}

