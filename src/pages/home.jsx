import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="min-h-screen bg-gray-100 px-6 py-16">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Utility Hub
        </h1>

        <p className="mt-4 text-gray-600">
          Useful React applications built with React and Tailwind CSS.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Link
            to="/translator"
            className="rounded-xl bg-white p-8 shadow hover:shadow-lg"
          >
            <h2 className="text-2xl font-bold text-blue-600">
              Text Translator
            </h2>

            <p className="mt-3 text-gray-600">
              Translate text into your favorite language.
            </p>
          </Link>

          <Link
            to="/random-generator"
            className="rounded-xl bg-white p-8 shadow hover:shadow-lg"
          >
            <h2 className="text-2xl font-bold text-green-600">
              Random String Generator
            </h2>

            <p className="mt-3 text-gray-600">
              Generate random strings with different options.
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Home