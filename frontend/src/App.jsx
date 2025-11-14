import { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useLocalStorage } from './hooks/useLocalStorage';
import StudyForm from './components/StudyForm';
import Summary from './components/Summary';
import Quiz from './components/Quiz';
import StudyTip from './components/StudyTip';
import TopicHistory from './components/TopicHistory';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [history, setHistory] = useLocalStorage('topicHistory', []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studyData, setStudyData] = useState(null);

  // Apply dark mode to document
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.classList.add('dark');
      htmlElement.setAttribute('data-theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.setAttribute('data-theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    // Immediately apply to ensure it works
    const htmlElement = document.documentElement;
    if (newMode) {
      htmlElement.classList.add('dark');
      htmlElement.setAttribute('data-theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.setAttribute('data-theme', 'light');
    }
  };

  const handleStudyRequest = async (topic, mode) => {
    setIsLoading(true);
    setError(null);
    setStudyData(null);

    try {
      const response = await fetch(`${API_URL}/study?topic=${encodeURIComponent(topic)}&mode=${mode}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch study content');
      }

      const data = await response.json();
      setStudyData(data);

      // Add to history (max 10 items)
      const newHistoryItem = { topic, mode, timestamp: Date.now() };
      const updatedHistory = [newHistoryItem, ...history.filter(h => h.topic !== topic)].slice(0, 10);
      setHistory(updatedHistory);

    } catch (err) {
      console.error('Study request error:', err);
      setError(err.message || 'Failed to fetch study content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryTopicSelect = (topic, mode) => {
    handleStudyRequest(topic, mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your topic history?')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200" style={{
      backgroundColor: darkMode ? '#111827' : '#f9fafb',
      color: darkMode ? '#f9fafb' : '#111827'
    }}>
      {/* Header */}
      <header className="shadow-sm sticky top-0 z-50" style={{
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        color: darkMode ? '#f9fafb' : '#111827'
      }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              📚 Smart Study Assistant
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered learning companion
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg transition-colors border"
              style={{
                backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                borderColor: darkMode ? '#4b5563' : '#d1d5db'
              }}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FaSun className="text-xl" style={{ color: '#fbbf24' }} />
              ) : (
                <FaMoon className="text-xl" style={{ color: '#374151' }} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <StudyForm onSubmit={handleStudyRequest} isLoading={isLoading} />

        {error && (
          <div className="card mb-6 border-2" style={{
            backgroundColor: darkMode ? 'rgba(127, 29, 29, 0.2)' : '#fef2f2',
            borderColor: darkMode ? '#991b1b' : '#fca5a5'
          }}>
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="font-bold mb-1" style={{ color: darkMode ? '#fca5a5' : '#991b1b' }}>Error</h3>
                <p style={{ color: darkMode ? '#fca5a5' : '#b91c1c' }}>{error}</p>
              </div>
            </div>
          </div>
        )}

        {studyData && (
          <>
            <Summary summary={studyData.summary} topic={studyData.topic} darkMode={darkMode} />
            <Quiz quiz={studyData.quiz} mathQuestion={studyData.mathQuestion} darkMode={darkMode} />
            <StudyTip tip={studyData.studyTip} darkMode={darkMode} />
            {studyData.source && (
              <div className="text-center mb-6">
                <a
                  href={studyData.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-sm"
                  style={{ color: darkMode ? '#60a5fa' : '#2563eb' }}
                >
                  Learn more on Wikipedia →
                </a>
              </div>
            )}
          </>
        )}

        <TopicHistory
          history={history}
          onTopicSelect={handleHistoryTopicSelect}
          onClearHistory={handleClearHistory}
          darkMode={darkMode}
        />
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t" style={{
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        borderColor: darkMode ? '#374151' : '#e5e7eb'
      }}>
        <div className="max-w-4xl mx-auto px-4 text-center text-sm" style={{
          color: darkMode ? '#9ca3af' : '#4b5563'
        }}>
          <p>
            Powered by <strong>Gemini AI</strong> and <strong>Wikipedia</strong>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
