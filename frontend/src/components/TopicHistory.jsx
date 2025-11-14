import { motion } from 'framer-motion';
import { FaHistory, FaTrash } from 'react-icons/fa';

export default function TopicHistory({ history, onTopicSelect, onClearHistory, darkMode }) {
  if (!history || history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaHistory className="text-gray-500 text-xl mr-3" />
          <h2 className="text-xl font-bold">Recent Topics</h2>
        </div>
        <button
          onClick={onClearHistory}
          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded"
          style={{
            backgroundColor: darkMode ? 'rgba(127, 29, 29, 0.2)' : '#fef2f2'
          }}
          title="Clear history"
        >
          <FaTrash />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {history.map((item, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => onTopicSelect(item.topic, item.mode)}
            className="px-3 py-1.5 rounded-full text-sm transition-colors duration-200 flex items-center gap-2"
            style={{
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
              color: darkMode ? '#f9fafb' : '#111827'
            }}
          >
            <span>{item.topic}</span>
            {item.mode === 'math' && (
              <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">
                Math
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

