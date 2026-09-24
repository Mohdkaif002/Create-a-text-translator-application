import { Routes, Route } from 'react-router-dom'

import Navbar from './components/navbar'
import Footer from './components/footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/home'
import Translator from './pages/translator'
import RandomGenerator from './pages/randomgenerator'
import History from './pages/history'
import AIAssistant from './pages/AIAssistant'
import Vocabulary from './pages/Vocabulary'
import QuizGenerator from './pages/QuizGenerator'
import Conversation from './pages/Conversation'
import DailyPractice from './pages/DailyPractice'
import LearningDashboard from './pages/LearningDashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/notfound'

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* =========================
            HOME
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* =========================
            AUTHENTICATION
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* =========================
            TRANSLATOR
        ========================= */}

        <Route
          path="/translator"
          element={
            <ProtectedRoute>
              <Translator />
            </ProtectedRoute>
          }
        />


        {/* =========================
            RANDOM GENERATOR
        ========================= */}

        <Route
          path="/random-generator"
          element={
            <ProtectedRoute>
              <RandomGenerator />
            </ProtectedRoute>
          }
        />


        {/* =========================
            COMBINED HISTORY
        ========================= */}

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />


        {/* =========================
            AI ASSISTANT
        ========================= */}

        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AIAssistant />
            </ProtectedRoute>
          }
        />


        {/* =========================
            VOCABULARY BUILDER
        ========================= */}

        <Route
          path="/vocabulary"
          element={
            <ProtectedRoute>
              <Vocabulary />
            </ProtectedRoute>
          }
        />

          <Route
  path="/quiz"
  element={
    <ProtectedRoute>
      <QuizGenerator />
    </ProtectedRoute>
  }
/>
<Route
  path="/conversation"
  element={
    <ProtectedRoute>
      <Conversation />
    </ProtectedRoute>
  }
/>
<Route
  path="/daily-practice"
  element={
    <ProtectedRoute>
      <DailyPractice />
    </ProtectedRoute>
  }
/>

<Route
  path="/learning-dashboard"
  element={
    <ProtectedRoute>
      <LearningDashboard />
    </ProtectedRoute>
  }
/>

        {/* =========================
            404 PAGE
        ========================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

      <Footer />
    </>
  )
}

export default App