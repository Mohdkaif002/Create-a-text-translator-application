import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Navbar() {
  const navigate = useNavigate()

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  )

  const [userName, setUserName] = useState(() => {
    const savedUser = JSON.parse(
      localStorage.getItem('translateHubUser') || 'null'
    )

    return savedUser?.name || ''
  })

  // Dark / Light Mode
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem('translateHubTheme') === 'dark'
    )
  })

  // Apply theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Toggle theme
  const toggleDarkMode = () => {
    const newMode = !darkMode

    setDarkMode(newMode)

    localStorage.setItem(
      'translateHubTheme',
      newMode ? 'dark' : 'light'
    )
  }

  // Navigation link style
  const navClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition duration-200 md:text-base ${
      isActive
        ? 'bg-white/15 font-bold text-yellow-300'
        : 'text-white hover:bg-white/10 hover:text-yellow-200'
    }`

  // Logout
  const handleLogout = () => {
    // Remove authentication data
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('translateHubUser')
    localStorage.removeItem('rememberMe')

    // Update navbar state
    setIsLoggedIn(false)
    setUserName('')

    // Go to login page
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-blue-600 text-white shadow-md transition-colors duration-300 dark:bg-slate-950">

      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">

        {/* Logo */}

        <NavLink
          to="/"
          className="text-xl font-extrabold tracking-tight sm:text-2xl"
        >
          TranslateHub
        </NavLink>

        {/* Navigation */}

        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">

          {/* Home */}

          <NavLink
            to="/"
            className={navClass}
          >
            Home
          </NavLink>

          {/* Logged In Links */}

          {isLoggedIn && (
            <>

              {/* Translator */}

              <NavLink
                to="/translator"
                className={navClass}
              >
                Translator
              </NavLink>

              {/* Random Generator */}

              <NavLink
                to="/random-generator"
                className={navClass}
              >
                Random Generator
              </NavLink>

              {/* History */}

              <NavLink
                to="/history"
                className={navClass}
              >
                History
              </NavLink>

              {/* AI Assistant */}

              <NavLink
                to="/ai-assistant"
                className={navClass}
              >
                🤖 AI Assistant
              </NavLink>

              {/* AI Quiz */}

              <NavLink
                to="/quiz"
                className={navClass}
              >
                🧪 AI Quiz
              </NavLink>

              {/* Conversation */}

              <NavLink
                to="/conversation"
                className={navClass}
              >
                🗣️ Conversation
              </NavLink>

              {/* Daily Practice */}

              <NavLink
                to="/daily-practice"
                className={navClass}
              >
                📅 Daily Practice
              </NavLink>

              {/* Learning Dashboard */}

              <NavLink
                to="/learning-dashboard"
                className={navClass}
              >
                🗺️ Learning Dashboard
              </NavLink>

              {/* Vocabulary */}

              <NavLink
                to="/vocabulary"
                className={navClass}
              >
                📚 Vocabulary
              </NavLink>

              {/* Offline Phrasebook */}

              <NavLink
                to="/offline-phrasebook"
                className={navClass}
              >
                📶 Phrasebook
              </NavLink>

            </>
          )}

          {/* Logged Out */}

          {!isLoggedIn ? (
            <>

              {/* Login */}

              <NavLink
                to="/login"
                className={navClass}
              >
                Login
              </NavLink>

              {/* Sign Up */}

              <NavLink
                to="/signup"
                className={navClass}
              >
                Sign Up
              </NavLink>

            </>
          ) : (
            <>

              {/* User Name */}

              {userName && (
                <span className="hidden rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white sm:block">
                  👋 {userName}
                </span>
              )}

              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:bg-red-500 md:text-base"
              >
                Logout
              </button>

            </>
          )}

          {/* Dark / Light Mode */}

          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="ml-1 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white transition duration-300 hover:bg-white/20"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

        </div>

      </div>

    </nav>
  )
}

export default Navbar