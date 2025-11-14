# 📚 Smart Study Assistant

An AI-powered full-stack web application that helps students learn smarter by providing AI-generated summaries, quiz questions, and study tips for any topic.

## 🌟 Features

- **AI-Powered Summaries**: Get 3 concise bullet points summarizing key concepts
- **Interactive Quizzes**: Test your knowledge with 3 multiple-choice questions
- **Study Tips**: Receive personalized tips to help retain information
- **Math Mode**: Generate quantitative/logic questions with detailed explanations
- **Dark Mode**: Toggle between light and dark themes
- **Topic History**: Save and quickly access your recent study topics (up to 10)
- **Smooth Animations**: Modern UI with engaging transitions
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Live Demo

- **Frontend**: [https://smartstudying.netlify.app/](https://smartstudying.netlify.app/)
- **Backend API**: [https://smartstudybackend.onrender.com](https://smartstudybackend.onrender.com)

> **Note**: The backend is hosted on Render's free tier, which may enter deep sleep mode after inactivity. The first request after inactivity may take 30-60 seconds to wake up the server. If you encounter any issues, please wait a moment and try again.

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express
- **Gemini AI** (Google's generative AI)
- **Wikipedia API** for topic information
- **CORS** enabled for cross-origin requests

### Frontend
- **React** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Icons** for beautiful icons
- **localStorage** for history persistence

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

## 🔧 Local Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your Gemini API key to `.env`:
```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3000
GEMINI_MODEL=gemini-pro
```

> **Note**: The `GEMINI_MODEL` is optional and defaults to `gemini-pro`. Other available models include `gemini-1.5-pro` and `gemini-1.5-flash` (availability may vary by region).

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure the API URL in `.env`:
```env
# For local development
VITE_API_URL=http://localhost:3000

# For production (if testing against deployed backend)
# VITE_API_URL=https://smartstudybackend.onrender.com
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📡 API Documentation

### Base URL
- Local: `http://localhost:3000`
- Production: `https://smartstudybackend.onrender.com`

### Endpoints

#### GET `/`
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "message": "Smart Study Assistant API is running",
  "endpoints": {
    "study": "/study?topic=<topic>&mode=<normal|math>"
  }
}
```

#### GET `/study`
Main endpoint for generating study content

**Query Parameters:**
- `topic` (required): The study topic (e.g., "Photosynthesis")
- `mode` (optional): Either "normal" (default) or "math"

**Example Requests:**
```bash
# Normal mode
GET /study?topic=Photosynthesis

# Math mode
GET /study?topic=Calculus&mode=math
```

**Success Response (200):**
```json
{
  "topic": "Photosynthesis",
  "mode": "normal",
  "summary": [
    "Plants convert light energy into chemical energy",
    "Process occurs in chloroplasts using chlorophyll",
    "Produces glucose and oxygen from CO2 and water"
  ],
  "quiz": [
    {
      "question": "What is the primary pigment in photosynthesis?",
      "options": [
        "A. Chlorophyll",
        "B. Carotene",
        "C. Xanthophyll",
        "D. Melanin"
      ],
      "correctAnswer": 0
    }
  ],
  "studyTip": "Create a diagram showing the light-dependent and light-independent reactions to visualize the process.",
  "mathQuestion": null,
  "source": {
    "title": "Photosynthesis",
    "url": "https://en.wikipedia.org/wiki/Photosynthesis"
  }
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "error": "Bad Request",
  "message": "Topic parameter is required"
}
```

404 Not Found:
```json
{
  "error": "Topic Not Found",
  "message": "Topic 'XYZ' not found on Wikipedia",
  "suggestion": "Try a different topic or check your spelling"
}
```

500 Internal Server Error:
```json
{
  "error": "AI Generation Failed",
  "message": "Failed to generate study content. Please try again."
}
```

## 🧪 Testing

### Test Plan

See `TEST_PLAN.md` for detailed test cases.

#### Quick Test Cases

**Test Case 1: Normal Mode with Valid Topic**
```bash
# Local
curl "http://localhost:3000/study?topic=Photosynthesis"

# Production
curl "https://smartstudybackend.onrender.com/study?topic=Photosynthesis"
```
Expected: 200 OK with summary, quiz, and study tip

**Test Case 2: Math Mode**
```bash
# Local
curl "http://localhost:3000/study?topic=Calculus&mode=math"

# Production
curl "https://smartstudybackend.onrender.com/study?topic=Calculus&mode=math"
```
Expected: 200 OK with additional math question

**Test Case 3: Invalid Topic**
```bash
# Local
curl "http://localhost:3000/study?topic=asdfghjkl12345"

# Production
curl "https://smartstudybackend.onrender.com/study?topic=asdfghjkl12345"
```
Expected: 404 Not Found with error message

### Frontend Testing

1. Enter a topic like "Artificial Intelligence"
2. Verify summary appears with 3 bullet points
3. Take the quiz and check answers
4. Read the study tip
5. Toggle dark mode
6. Check topic history in localStorage
7. Try Math Mode with a topic like "Statistics"

## 📦 Deployment

### Backend Deployment (Render)

1. Push your code to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add `GEMINI_API_KEY`
5. Deploy

Alternatively, use the included `render.yaml` for automatic configuration.

### Frontend Deployment (Netlify)

1. Push your code to GitHub
2. Import your project on [Netlify](https://netlify.com)
3. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**: Add `VITE_API_URL` with your Render backend URL (e.g., `https://smartstudybackend.onrender.com`)
4. Deploy

The included `netlify.toml` provides automatic configuration.

**Deployed URLs:**
- Frontend: [https://smartstudying.netlify.app/](https://smartstudying.netlify.app/)
- Backend: [https://smartstudybackend.onrender.com](https://smartstudybackend.onrender.com)

## 🎯 Prompt Examples

Try these topics to test the application:

**Science:**
- "Quantum Mechanics"
- "DNA Replication"
- "Photosynthesis"

**History:**
- "World War II"
- "Ancient Rome"
- "Industrial Revolution"

**Math (with Math Mode):**
- "Calculus"
- "Probability Theory"
- "Linear Algebra"

**Technology:**
- "Machine Learning"
- "Blockchain"
- "Cloud Computing"

## 🤖 AI Tools Disclosure

This project uses the following AI technologies:

1. **Google Gemini AI (gemini-pro)**
   - Purpose: Generate summaries, quiz questions, study tips, and math problems
   - API: `@google/generative-ai` package
   - Used for all AI-powered content generation

2. **Wikipedia API**
   - Purpose: Fetch reliable topic information
   - Provides context for AI content generation

3. **Development Assistance - Anthropic Claude Sonnet**
   - **AI Model Used**: Claude Sonnet 
   - **Purpose**: Frontend development assistance, UI/UX improvements, and bug fixes
   - **Usage**: Claude Sonnet was used to assist with:
     - React component development and structure
     - Tailwind CSS styling and dark mode implementation
     - UI consistency fixes and responsive design
     - Frontend code optimization and best practices
   - **Note**: Backend architecture and implementation were developed independently, with AI assistance primarily focused on frontend UI/UX refinement

### Example Prompts Used for Frontend Development

Here are some example prompts that were used to assist with frontend UI/UX development:

**UI/UX Improvements:**
```
Fix the dark mode implementation - the toggle button works but the UI doesn't change. 
Ensure all components properly respond to dark mode state with distinct light and dark 
color schemes. Make sure text is readable in both modes.
```

**Component Development:**
```
Create a Quiz component that displays multiple-choice questions with interactive answer 
selection. Include visual feedback for correct/incorrect answers, score tracking, and 
support for math mode with quantitative questions. Ensure proper styling for both light 
and dark themes.
```

**Styling Fixes:**
```
The recent topics buttons appear black in light mode and text in cards is white making 
it invisible. Fix all text colors to be consistent - dark text on light backgrounds in 
light mode, light text on dark backgrounds in dark mode. Ensure all components have 
proper contrast ratios.
```

**Code Quality:**
```
Refactor the dark mode implementation to use inline styles with the darkMode prop 
instead of Tailwind dark: variants since they're not working properly. Ensure all 
components receive the darkMode prop and update reactively when toggled.
```

**Feature Enhancement:**
```
Add a topic history feature that saves the last 10 searched topics to localStorage. 
Display them as clickable buttons below the main content. Include a clear history 
button and show a badge for math mode topics.
```

**Responsive Design:**
```
Ensure the application is fully responsive and works well on mobile devices. Fix any 
layout issues on smaller screens and optimize touch interactions for mobile users.
```

These prompts demonstrate how AI assistance was used specifically for frontend development to create a polished, user-friendly interface.

## 📁 Project Structure

```
SmartStudy/
├── backend/
│   ├── services/
│   │   ├── wikipediaService.js    # Wikipedia API integration
│   │   └── geminiService.js       # Gemini AI integration
│   ├── server.js                  # Express server & API endpoints
│   ├── package.json
│   ├── render.yaml                # Render deployment config
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StudyForm.jsx      # Input form with math mode toggle
│   │   │   ├── Summary.jsx        # Display summary bullets
│   │   │   ├── Quiz.jsx           # Interactive quiz component
│   │   │   ├── StudyTip.jsx       # Study tip display
│   │   │   └── TopicHistory.jsx   # Recent topics list
│   │   ├── hooks/
│   │   │   └── useLocalStorage.js # localStorage custom hook
│   │   ├── App.jsx                # Main app component
│   │   └── index.css              # Tailwind styles
│   ├── package.json
│   ├── netlify.toml               # Netlify deployment config
│   ├── tailwind.config.js
│   └── .env.example
├── README.md
└── .gitignore
```

## 🐛 Troubleshooting

### Backend Issues

**Error: "Gemini AI not initialized"**
- Solution: Ensure `GEMINI_API_KEY` is set in your `.env` file

**Error: "Topic not found"**
- Solution: Try a different topic or check spelling. Use common, well-documented topics.

### Frontend Issues

**Blank page or build errors**
- Solution: Ensure all dependencies are installed with `npm install`
- Check that `VITE_API_URL` is correctly set

**API connection errors**
- Solution: Verify backend is running and CORS is properly configured
- Check that frontend is using correct backend URL
- If using production backend, note that Render free tier may have cold start delays (30-60 seconds)

**Render Deep Sleep Mode**
- Solution: The backend may take 30-60 seconds to respond on the first request after inactivity
- This is normal behavior for Render's free tier
- Wait a moment and try again if the first request times out

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🎥 Demo Video

[Link to demo video - max 1 minute]

The demo showcases:
- Topic input and submission
- AI-generated summary, quiz, and study tip
- Math mode with quantitative question
- Dark mode toggle
- Topic history feature

## 👨‍💻 Author

Built as a 2-day full-stack AI challenge project.

## 🙏 Acknowledgments

- Google Gemini AI for powerful content generation
- Wikipedia for reliable topic information
- Tailwind CSS for beautiful styling
- Framer Motion for smooth animations
- Render for backend hosting
- Netlify for frontend hosting

---
