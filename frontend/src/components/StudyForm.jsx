import { useState } from 'react';
import { FaSearch, FaCalculator } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function StudyForm({ onSubmit, isLoading }) {
  const [topic, setTopic] = useState('');
  const [mathMode, setMathMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic.trim(), mathMode ? 'math' : 'normal');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card mb-8"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium mb-2">
            What do you want to learn about?
          </label>
          <div className="relative">
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g., Photosynthesis, Quantum Physics)"
              className="input-field pr-10"
              disabled={isLoading}
              required
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <input
            id="mathMode"
            type="checkbox"
            checked={mathMode}
            onChange={(e) => setMathMode(e.target.checked)}
            disabled={isLoading}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="mathMode" className="flex items-center text-sm font-medium cursor-pointer">
            <FaCalculator className="mr-2" />
            Math Mode (Include quantitative question)
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="btn-primary w-full"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            'Start Learning'
          )}
        </button>
      </form>
    </motion.div>
  );
}

