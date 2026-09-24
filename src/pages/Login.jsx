import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    setError('')

    // Email validation
    if (!email.trim()) {
      setError('Please enter your email.')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    // Password validation
    if (!password.trim()) {
      setError('Please enter your password.')
      return
    }

    if (password.length < 6) {
      setError(
        'Password must be at least 6 characters.'
      )
      return
    }

    try {
      setLoading(true)

      // Call backend login API
      const response = await fetch(
        'http://localhost:5000/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      )

      const data = await response.json()

      // Backend error
      if (!response.ok) {
        throw new Error(
          data.error || 'Login failed.'
        )
      }

      // Save login state
      localStorage.setItem(
        'isLoggedIn',
        'true'
      )

      localStorage.setItem(
        'userEmail',
        data.user.email
      )

      // Save complete user information
      localStorage.setItem(
        'translateHubUser',
        JSON.stringify(data.user)
      )

      // Save remember preference
      localStorage.setItem(
        'rememberMe',
        rememberMe.toString()
      )

      alert('Login successful!')

      navigate('/')
    } catch (error) {
      console.error('Login Error:', error)

      if (
        error.message.includes('Failed to fetch')
      ) {
        setError(
          'Backend server is not running. Please start the backend.'
        )
      } else {
        setError(
          error.message || 'Login failed.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    alert(
      'Password reset feature will be available soon.'
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-10 sm:px-6">

      <div className="flex min-h-[75vh] items-center justify-center">

        <div className="w-full max-w-md">

          {/* Login Card */}

          <div className="rounded-3xl bg-white p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-8 md:p-10">

            {/* Lock Icon */}

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl transition duration-300 hover:scale-110">
              🔐
            </div>

            {/* Heading */}

            <div className="mt-5 text-center">

              <h1 className="text-3xl font-bold text-blue-600 sm:text-4xl">
                Welcome Back
              </h1>

              <p className="mt-2 text-gray-600">
                Login to your TranslateHub account
              </p>

            </div>

            {/* Error Message */}

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                ❌ {error}
              </div>
            )}

            {/* Login Form */}

            <form
              onSubmit={handleLogin}
              className="mt-8"
            >

              {/* Email */}

              <div>

                <label className="mb-2 block font-semibold text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

              </div>

              {/* Password */}

              <div className="mt-5">

                <label className="mb-2 block font-semibold text-gray-700">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-gray-300 p-4 pr-14 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />

                  {/* Show / Hide Password */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xl transition hover:scale-110"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword
                      ? '🙈'
                      : '👁️'}
                  </button>

                </div>

              </div>

              {/* Remember Me + Forgot Password */}

              <div className="mt-5 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">

                <label className="flex cursor-pointer items-center gap-2 text-gray-600">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 cursor-pointer"
                  />

                  <span>
                    Remember me
                  </span>

                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-left font-semibold text-blue-600 transition hover:text-blue-800 hover:underline sm:text-right"
                >
                  Forgot Password?
                </button>

              </div>

              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="mt-7 w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-blue-300"
              >

                {loading ? (
                  <span className="flex items-center justify-center gap-3">

                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>

                    Logging in...

                  </span>
                ) : (
                  'Login'
                )}

              </button>

            </form>

            {/* Divider */}

            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-gray-200"></div>

              <span className="text-sm text-gray-400">
                or
              </span>

              <div className="h-px flex-1 bg-gray-200"></div>

            </div>

            {/* Sign Up */}

            <p className="text-center text-gray-600">

              Don't have an account?{' '}

              <Link
                to="/signup"
                className="font-bold text-blue-600 transition hover:text-blue-800 hover:underline"
              >
                Sign Up
              </Link>

            </p>

          </div>

          {/* Branding */}

          <p className="mt-6 text-center text-sm text-gray-500">
            🌐 TranslateHub — Simple & Fast Translation
          </p>

        </div>

      </div>

    </main>
  )
}

export default Login