import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">404</h1>

        <p className="mt-4 text-xl text-gray-700">
          Page Not Found
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white"
        >
          Go Home
        </Link>
      </div>
    </main>
  )
}

export default NotFound