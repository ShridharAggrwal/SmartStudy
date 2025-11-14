import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaQuestionCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function Quiz({ quiz, mathQuestion, darkMode }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  if (!quiz || quiz.length === 0) return null;

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    if (showResults) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const score = showResults ? calculateScore() : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaQuestionCircle className="text-blue-500 text-2xl mr-3" />
          <h2 className="text-2xl font-bold" style={{ color: darkMode ? '#f9fafb' : '#111827' }}>Quiz Time!</h2>
        </div>
        {showResults && (
          <div className="text-lg font-semibold" style={{ color: darkMode ? '#f9fafb' : '#111827' }}>
            Score: <span style={{ color: darkMode ? '#60a5fa' : '#2563eb' }}>{score}/{quiz.length}</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {quiz.map((question, qIndex) => (
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: qIndex * 0.15 }}
            className="border-b pb-4 last:border-b-0"
            style={{
              borderColor: darkMode ? '#374151' : '#e5e7eb'
            }}
          >
            <p className="font-semibold mb-3" style={{ color: darkMode ? '#e5e7eb' : '#1f2937' }}>
              {qIndex + 1}. {question.question}
            </p>
            <div className="space-y-2">
              {question.options.map((option, oIndex) => {
                const isSelected = selectedAnswers[qIndex] === oIndex;
                const isCorrect = question.correctAnswer === oIndex;
                const showCorrect = showResults && isCorrect;
                const showWrong = showResults && isSelected && !isCorrect;

                return (
                  <button
                    key={oIndex}
                    onClick={() => handleAnswerSelect(qIndex, oIndex)}
                    disabled={showResults}
                    className="w-full text-left p-3 rounded-lg border-2 transition-all duration-200"
                    style={{
                      backgroundColor: showCorrect
                        ? (darkMode ? 'rgba(34, 197, 94, 0.2)' : '#f0fdf4')
                        : showWrong
                        ? (darkMode ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2')
                        : isSelected
                        ? (darkMode ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff')
                        : 'transparent',
                      borderColor: showCorrect
                        ? '#22c55e'
                        : showWrong
                        ? '#ef4444'
                        : isSelected
                        ? '#3b82f6'
                        : (darkMode ? '#4b5563' : '#d1d5db'),
                      color: darkMode ? '#f9fafb' : '#111827'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className={showWrong || showCorrect ? 'font-medium' : ''}>
                        {option}
                      </span>
                      {showCorrect && <FaCheckCircle className="text-green-500" />}
                      {showWrong && <FaTimesCircle className="text-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {mathQuestion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 p-4 rounded-lg border-2"
          style={{
            backgroundColor: darkMode ? 'rgba(88, 28, 135, 0.2)' : '#faf5ff',
            borderColor: darkMode ? '#7e22ce' : '#c084fc'
          }}
        >
          <h3 className="font-bold text-lg mb-2" style={{ color: darkMode ? '#c084fc' : '#6b21a8' }}>
            🔢 Math Challenge
          </h3>
          <p className="mb-3" style={{ color: darkMode ? '#e5e7eb' : '#1f2937' }}>{mathQuestion.problem}</p>
          {showResults && (
            <div className="mt-3 space-y-2">
              <p className="font-semibold" style={{ color: darkMode ? '#4ade80' : '#15803d' }}>
                Answer: {mathQuestion.answer}
              </p>
              <p className="text-sm" style={{ color: darkMode ? '#d1d5db' : '#374151' }}>
                <strong>Explanation:</strong> {mathQuestion.explanation}
              </p>
            </div>
          )}
        </motion.div>
      )}

      <div className="mt-6 flex gap-3">
        {!showResults ? (
          <button
            onClick={handleCheckAnswers}
            disabled={Object.keys(selectedAnswers).length !== quiz.length}
            className="btn-primary flex-1"
          >
            Check Answers
          </button>
        ) : (
          <button onClick={handleReset} className="btn-primary flex-1">
            Try Again
          </button>
        )}
      </div>
    </motion.div>
  );
}

