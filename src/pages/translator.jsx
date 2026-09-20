import { useState } from 'react'

function Translator() {
  const [text, setText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [language, setLanguage] = useState('hi')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const translateText = async () => {
    if (!text.trim()) {
      setError('Please enter some text.')
      return
    }

    setLoading(true)
    setError('')
    setTranslatedText('')

    try {
      const response = await fetch(
        'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'google-translate113.p.rapidapi.com',
            'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
          },
          body: JSON.stringify({
            from: 'en',
            to: language,
            text: text,
          }),
        }
      )

      const data = await response.json()

      console.log('API Response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Translation failed')
      }

      if (!data.trans) {
        throw new Error('Translation not found')
      }

      setTranslatedText(data.trans)
    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="text-center text-3xl font-bold text-blue-600">
          Text Translator
        </h1>

        <p className="mt-2 text-center text-gray-600">
          Translate English text into your favorite language
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter English text..."
          rows="6"
          className="mt-8 w-full rounded-xl border p-4 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="mt-5">
          <label className="mb-2 block font-semibold">
            Select Language
          </label>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-lg border p-3"
          >
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
          </select>
        </div>

        <button
          onClick={translateText}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>

        {error && (
          <div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {translatedText && (
          <div className="mt-6 rounded-xl bg-gray-100 p-5">
            <h2 className="font-bold text-gray-800">
              Translation:
            </h2>

            <p className="mt-3 text-lg text-gray-700">
              {translatedText}
            </p>
          </div>
        )}

      </div>
    </main>
  )
}

export default Translator

