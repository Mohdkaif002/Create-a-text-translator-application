import { useState } from 'react'

const languages = [
  'English',
  'Hindi',
  'Sanskrit',
  'Urdu',
  'Bengali',
  'Gujarati',
  'Marathi',
  'Punjabi',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Odia',
  'Assamese',
  'Nepali',
  'Arabic',
  'Persian',
  'Hebrew',
  'Turkish',
  'French',
  'Spanish',
  'German',
  'Italian',
  'Portuguese',
  'Russian',
  'Ukrainian',
  'Polish',
  'Dutch',
  'Greek',
  'Czech',
  'Slovak',
  'Hungarian',
  'Romanian',
  'Bulgarian',
  'Serbian',
  'Croatian',
  'Slovenian',
  'Swedish',
  'Norwegian',
  'Danish',
  'Finnish',
  'Icelandic',
  'Estonian',
  'Latvian',
  'Lithuanian',
  'Irish',
  'Welsh',
  'Albanian',
  'Armenian',
  'Georgian',
  'Azerbaijani',
  'Kazakh',
  'Uzbek',
  'Turkmen',
  'Kyrgyz',
  'Tajik',
  'Mongolian',
  'Chinese',
  'Japanese',
  'Korean',
  'Thai',
  'Vietnamese',
  'Indonesian',
  'Malay',
  'Filipino',
  'Burmese',
  'Khmer',
  'Lao',
  'Swahili',
  'Zulu',
  'Xhosa',
  'Afrikaans',
  'Amharic',
  'Somali',
  'Hausa',
  'Yoruba',
  'Igbo',
  'Tigrinya',
  'Sesotho',
  'Setswana',
  'Shona',
  'Malagasy',
  'Maori',
  'Samoan',
  'Tongan',
  'Fijian',
  'Latin',
  'Esperanto',
  'Basque',
  'Catalan',
  'Galician',
  'Maltese',
  'Luxembourgish',
  'Bosnian',
  'Macedonian',
  'Belarusian',
  'Pashto',
  'Kurdish',
  'Sindhi',
  'Kashmiri',
  'Bhojpuri',
  'Dogri',
  'Maithili',
]

function AIAssistant() {
  const [text, setText] = useState('')
  const [mode, setMode] = useState('grammar')
  const [targetLanguage, setTargetLanguage] = useState('Hindi')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert('Please enter some text.')
      return
    }

    setLoading(true)
    setResult('')

    try {
      const response = await fetch(
        'http://localhost:5000/api/ai',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            mode: mode,
            targetLanguage: targetLanguage,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'AI request failed.'
        )
      }

      setResult(data.result)

      // ==========================================
      // SAVE AI RESULT TO COMMON HISTORY
      // ==========================================

      const newHistory = {
        id: Date.now(),

        // Important:
        // This tells History.jsx that this is AI history
        type: 'ai',

        mode: mode,

        input: text,

        result: data.result,

        targetLanguage:
          mode === 'translate'
            ? targetLanguage
            : '',

        date: new Date().toISOString(),
      }

      // Get existing common history
      const oldHistory = JSON.parse(
        localStorage.getItem(
          'translationHistory'
        ) || '[]'
      )

      // Add new AI result at the top
      const updatedHistory = [
        newHistory,
        ...oldHistory,
      ].slice(0, 100)

      // Save everything in one history
      localStorage.setItem(
        'translationHistory',
        JSON.stringify(updatedHistory)
      )
    } catch (error) {
      console.error('AI Error:', error)

      setResult(
        'Something went wrong. Please make sure the AI backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setText('')
    setResult('')
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-10 sm:px-6">

      <div className="mx-auto max-w-5xl">

        {/* Header */}

        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-4xl shadow-sm">
            🤖
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-purple-600 sm:text-4xl">
            AI Language Assistant
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Improve, understand, translate and analyze
            your text with AI.
          </p>

        </div>

        {/* Main Card */}

        <div className="mt-10 rounded-2xl bg-white p-6 shadow-lg sm:p-8">

          {/* AI Task */}

          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Choose AI Task
          </label>

          <select
            value={mode}
            onChange={(e) =>
              setMode(e.target.value)
            }
            className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          >

            <option value="grammar">
              ✍️ Grammar Correction
            </option>

            <option value="rewrite">
              🔄 Rewrite Text
            </option>

            <option value="summary">
              📝 Summarize Text
            </option>

            <option value="explain">
              🧠 Explain Text
            </option>

            <option value="translate">
              🌐 AI Translation
            </option>

          </select>

          {/* Target Language */}

          {mode === 'translate' && (
            <>

              <label className="mb-2 mt-6 block text-sm font-semibold text-gray-700">
                Translate To
              </label>

              <select
                value={targetLanguage}
                onChange={(e) =>
                  setTargetLanguage(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              >

                {languages.map(
                  (language) => (
                    <option
                      key={language}
                      value={language}
                    >
                      {language}
                    </option>
                  )
                )}

              </select>

            </>
          )}

          {/* Text Input */}

          <label className="mb-2 mt-6 block text-sm font-semibold text-gray-700">
            Enter Your Text
          </label>

          <textarea
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
            rows={8}
            placeholder={
              mode === 'translate'
                ? 'Enter text you want to translate...'
                : 'Enter your sentence or paragraph...'
            }
            className="w-full resize-none rounded-xl border border-gray-300 p-4 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />

          {/* Character Count */}

          <div className="mt-2 text-right text-xs text-gray-500">
            {text.length} characters
          </div>

          {/* Buttons */}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="flex-1 rounded-xl bg-purple-600 px-6 py-3.5 font-bold text-white shadow-md transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading
                ? '🤖 AI is thinking...'
                : mode === 'translate'
                  ? '🌐 Translate with AI'
                  : '🤖 Analyze with AI'}
            </button>

            <button
              onClick={handleClear}
              disabled={loading}
              className="rounded-xl border border-gray-300 px-6 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear
            </button>

          </div>

        </div>

        {/* Result */}

        {result && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-lg sm:p-8">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-xl">
                🧠
              </div>

              <div>

                <h2 className="text-xl font-bold text-gray-800">
                  AI Result
                </h2>

                <p className="text-sm text-gray-500">
                  {mode === 'translate'
                    ? `Translated to ${targetLanguage}`
                    : 'Generated by TranslateHub AI Assistant'}
                </p>

              </div>

            </div>

            <div className="mt-5 rounded-xl bg-purple-50 p-5">

              <p className="whitespace-pre-wrap break-words leading-7 text-gray-800">
                {result}
              </p>

            </div>

            {/* Copy Result */}

            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  result
                )

                alert('AI result copied!')
              }}
              className="mt-4 rounded-lg border border-purple-200 px-4 py-2 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
            >
              📋 Copy Result
            </button>

          </div>
        )}

        {/* Features */}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-white p-5 text-center shadow-sm">

            <div className="text-3xl">
              ✍️
            </div>

            <h3 className="mt-2 font-bold text-gray-800">
              Grammar
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Correct grammatical mistakes.
            </p>

          </div>

          <div className="rounded-xl bg-white p-5 text-center shadow-sm">

            <div className="text-3xl">
              🔄
            </div>

            <h3 className="mt-2 font-bold text-gray-800">
              Rewrite
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Make your text clearer and
              professional.
            </p>

          </div>

          <div className="rounded-xl bg-white p-5 text-center shadow-sm">

            <div className="text-3xl">
              📝
            </div>

            <h3 className="mt-2 font-bold text-gray-800">
              Summarize
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Get a simple summary of your text.
            </p>

          </div>

          <div className="rounded-xl bg-white p-5 text-center shadow-sm">

            <div className="text-3xl">
              🌐
            </div>

            <h3 className="mt-2 font-bold text-gray-800">
              AI Translation
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Translate text into 100+ languages.
            </p>

          </div>

        </div>

      </div>

    </main>
  )
}

export default AIAssistant