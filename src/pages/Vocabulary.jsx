import { useMemo, useState } from 'react'

const meaningLanguages = [
  'Hindi',
  'English',
  'Urdu',
  'Sanskrit',
  'Bengali',
  'Gujarati',
  'Marathi',
  'Punjabi',
]

function Vocabulary() {
  const [text, setText] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('Hindi')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  // ==========================================
  // LOAD SAVED VOCABULARY
  // ==========================================

  const [words, setWords] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(
          'translateHubVocabulary'
        ) || '[]'
      )
    } catch {
      return []
    }
  })

  // ==========================================
  // SAVE VOCABULARY
  // ==========================================

  const saveVocabulary = (newWords) => {
    const savedVocabulary = JSON.parse(
      localStorage.getItem(
        'translateHubVocabulary'
      ) || '[]'
    )

    const wordsWithId = newWords.map(
      (item, index) => ({
        ...item,
        id:
          Date.now() +
          index +
          Math.random(),
        date: new Date().toISOString(),
      })
    )

    const updatedVocabulary = [
      ...wordsWithId,
      ...savedVocabulary,
    ].slice(0, 200)

    localStorage.setItem(
      'translateHubVocabulary',
      JSON.stringify(updatedVocabulary)
    )

    setWords(updatedVocabulary)
  }

  // ==========================================
  // BUILD VOCABULARY
  // ==========================================

  const buildVocabulary = async () => {
    if (!text.trim()) {
      alert(
        'Please enter some English text.'
      )
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:5000/api/vocabulary',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            text,
            targetLanguage,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Vocabulary generation failed.'
        )
      }

      if (
        !data.words ||
        !Array.isArray(data.words)
      ) {
        throw new Error(
          'Invalid vocabulary response.'
        )
      }

      saveVocabulary(data.words)

      alert(
        `${data.words.length} vocabulary words added!`
      )
    } catch (error) {
      console.error(
        'Vocabulary Error:',
        error
      )

      alert(
        error.message ||
          'Something went wrong. Please make sure the AI backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // DELETE ONE WORD
  // ==========================================

  const deleteWord = (id) => {
    const updatedWords =
      words.filter(
        (word) => word.id !== id
      )

    localStorage.setItem(
      'translateHubVocabulary',
      JSON.stringify(updatedWords)
    )

    setWords(updatedWords)
  }

  // ==========================================
  // CLEAR ALL
  // ==========================================

  const clearVocabulary = () => {
    const confirmDelete =
      window.confirm(
        'Are you sure you want to delete all vocabulary?'
      )

    if (!confirmDelete) {
      return
    }

    localStorage.removeItem(
      'translateHubVocabulary'
    )

    setWords([])
  }

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredWords = useMemo(() => {
    const searchText =
      search.trim().toLowerCase()

    if (!searchText) {
      return words
    }

    return words.filter((item) => {
      const word =
        item.word?.toLowerCase() || ''

      const meaning =
        item.meaning?.toLowerCase() || ''

      const definition =
        item.definition?.toLowerCase() ||
        ''

      const synonym =
        item.synonym?.toLowerCase() || ''

      const example =
        item.example?.toLowerCase() || ''

      return (
        word.includes(searchText) ||
        meaning.includes(searchText) ||
        definition.includes(searchText) ||
        synonym.includes(searchText) ||
        example.includes(searchText)
      )
    })
  }, [words, search])

  // ==========================================
  // CLEAR INPUT
  // ==========================================

  const clearInput = () => {
    setText('')
  }

  // ==========================================
  // COPY WORD
  // ==========================================

  const copyWord = async (item) => {
    const copyText = `${item.word}

Meaning: ${item.meaning}

Definition: ${item.definition}

Synonym: ${item.synonym}

Example: ${item.example}`

    try {
      await navigator.clipboard.writeText(
        copyText
      )

      alert(
        `"${item.word}" copied!`
      )
    } catch {
      alert(
        'Unable to copy vocabulary.'
      )
    }
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-10 sm:px-6">

      <div className="mx-auto max-w-6xl">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-4xl shadow-sm">
            📚
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-purple-600 sm:text-4xl">
            AI Vocabulary Builder
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Learn useful English words with
            meanings, definitions, synonyms
            and examples.
          </p>

        </div>


        {/* ==========================================
            INPUT CARD
        ========================================== */}

        <div className="mt-10 rounded-2xl bg-white p-6 shadow-lg sm:p-8">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-2xl">
              🧠
            </div>

            <div>

              <h2 className="text-xl font-bold text-gray-800">
                Generate Vocabulary
              </h2>

              <p className="text-sm text-gray-500">
                Enter an English paragraph
                and let AI find useful words.
              </p>

            </div>

          </div>


          {/* TEXT INPUT */}

          <label className="mb-2 mt-6 block text-sm font-semibold text-gray-700">
            Enter English Text
          </label>

          <textarea
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
            rows={8}
            placeholder="Paste an English paragraph here..."
            className="w-full resize-none rounded-xl border border-gray-300 p-4 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />

          <div className="mt-2 flex justify-between text-xs text-gray-500">

            <span>
              AI will extract 5–10 useful
              words.
            </span>

            <span>
              {text.length} characters
            </span>

          </div>


          {/* LANGUAGE */}

          <label className="mb-2 mt-6 block text-sm font-semibold text-gray-700">
            Meaning Language
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

            {meaningLanguages.map(
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


          {/* BUTTONS */}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">

            <button
              onClick={buildVocabulary}
              disabled={loading}
              className="flex-1 rounded-xl bg-purple-600 px-6 py-3.5 font-bold text-white shadow-md transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading
                ? '🤖 Building Vocabulary...'
                : '📚 Build Vocabulary'}
            </button>

            <button
              onClick={clearInput}
              disabled={
                loading ||
                !text
              }
              className="rounded-xl border border-gray-300 px-6 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear
            </button>

          </div>

        </div>


        {/* ==========================================
            SAVED VOCABULARY
        ========================================== */}

        {words.length > 0 && (
          <div className="mt-10">

            {/* HEADER */}

            <div className="rounded-2xl bg-white p-5 shadow-lg">

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                  <h2 className="text-2xl font-bold text-gray-800">
                    📖 My Vocabulary
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {words.length} saved
                    word
                    {words.length !==
                    1
                      ? 's'
                      : ''}
                  </p>

                </div>

                <button
                  onClick={
                    clearVocabulary
                  }
                  className="rounded-xl bg-red-50 px-5 py-2.5 font-semibold text-red-600 transition hover:bg-red-100"
                >
                  🗑️ Clear All
                </button>

              </div>


              {/* SEARCH */}

              <div className="mt-5">

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="🔍 Search vocabulary..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

              </div>

            </div>


            {/* ==========================================
                WORD CARDS
            ========================================== */}

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              {filteredWords.map(
                (item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-white p-6 shadow-lg transition hover:shadow-xl"
                  >

                    {/* WORD HEADER */}

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <h3 className="text-2xl font-extrabold text-purple-600">
                          {item.word}
                        </h3>

                        <p className="mt-1 text-sm font-semibold text-green-600">
                          Meaning:{' '}
                          {item.meaning}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          deleteWord(
                            item.id
                          )
                        }
                        className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 transition hover:bg-red-100"
                        title="Delete word"
                      >
                        🗑️
                      </button>

                    </div>


                    {/* DEFINITION */}

                    <div className="mt-5">

                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                        Definition
                      </p>

                      <p className="mt-1 leading-6 text-gray-700">
                        {item.definition}
                      </p>

                    </div>


                    {/* SYNONYM */}

                    <div className="mt-4">

                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                        Synonym
                      </p>

                      <span className="mt-1 inline-block rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-600">
                        {item.synonym}
                      </span>

                    </div>


                    {/* EXAMPLE */}

                    <div className="mt-4">

                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                        Example
                      </p>

                      <p className="mt-1 rounded-xl bg-purple-50 p-3 italic leading-6 text-gray-700">
                        "{item.example}"
                      </p>

                    </div>


                    {/* ACTIONS */}

                    <div className="mt-5 border-t border-gray-100 pt-4">

                      <button
                        onClick={() =>
                          copyWord(
                            item
                          )
                        }
                        className="rounded-lg border border-purple-200 px-4 py-2 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
                      >
                        📋 Copy
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>


            {/* NO SEARCH RESULT */}

            {filteredWords.length ===
              0 && (
              <div className="mt-6 rounded-2xl bg-white p-10 text-center shadow-lg">

                <div className="text-5xl">
                  🔍
                </div>

                <h3 className="mt-4 text-xl font-bold text-gray-800">
                  No Words Found
                </h3>

                <p className="mt-2 text-gray-500">
                  Try searching for another
                  word or meaning.
                </p>

              </div>
            )}

          </div>
        )}


        {/* ==========================================
            EMPTY STATE
        ========================================== */}

        {words.length === 0 && (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-lg">

            <div className="text-6xl">
              📖
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-800">
              Your Vocabulary Is Empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              Enter an English paragraph above
              and click Build Vocabulary to
              start learning new words.
            </p>

          </div>
        )}

      </div>

    </main>
  )
}

export default Vocabulary