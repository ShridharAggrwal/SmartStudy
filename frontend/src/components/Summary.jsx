import { motion } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';

export default function Summary({ summary, topic, darkMode }) {
  if (!summary || summary.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card mb-6"
    >
      <div className="flex items-center mb-4">
        <FaLightbulb className="text-yellow-500 text-2xl mr-3" />
        <h2 className="text-2xl font-bold">Summary: {topic}</h2>
      </div>
      
      <ul className="space-y-3">
        {summary.map((point, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex items-start"
          >
            <span className="inline-flex items-center justify-center w-6 h-6 mr-3 text-sm font-bold text-white bg-blue-600 rounded-full flex-shrink-0 mt-0.5">
              {index + 1}
            </span>
            <span style={{ color: darkMode ? '#d1d5db' : '#374151' }}>{point}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

