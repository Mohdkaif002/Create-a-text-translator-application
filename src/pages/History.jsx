import { useMemo, useState } from 'react'
import { jsPDF } from 'jspdf'

function History() {
  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = JSON.parse(
        localStorage.getItem('translationHistory') || '[]'
      )

      return savedHistory.map((item) => ({
        ...item,
        type: item.type || 'translator',
      }))
    } catch {
      return []
    }
  })
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterLanguage, setFilterLanguage] = useState('all')

  // Get all languages
  const languages = useMemo(() => {
    const languageSet = new Set()

    history.forEach((item) => {
      if (item.targetLanguage) {
        languageSet.add(item.targetLanguage)
      }
    })

    return Array.from(languageSet).sort()
  }, [history])

  // Search + Filter
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const searchText = search.toLowerCase()

      const inputText = (
        item.input ||
        item.originalText ||
        ''
      ).toLowerCase()

      const resultText = (
        item.result ||
        item.translatedText ||
        ''
      ).toLowerCase()

      const modeText = (
        item.mode ||
        ''
      ).toLowerCase()

      const languageText = (
        item.targetLanguage ||
        item.targetLang ||
        ''
      ).toLowerCase()

      const matchesSearch =
        inputText.includes(searchText) ||
        resultText.includes(searchText) ||
        modeText.includes(searchText) ||
        languageText.includes(searchText)

      const matchesType =
        filterType === 'all' ||
        (filterType === 'translator' &&
          item.type === 'translator') ||
        (filterType === 'ai' &&
          item.type === 'ai')

      const itemLanguage =
        item.targetLanguage ||
        item.targetLang ||
        ''

      const matchesLanguage =
        filterLanguage === 'all' ||
        itemLanguage === filterLanguage

      return (
        matchesSearch &&
        matchesType &&
        matchesLanguage
      )
    })
  }, [
    history,
    search,
    filterType,
    filterLanguage,
  ])

  // Get input text
  const getInput = (item) => {
    return (
      item.input ||
      item.originalText ||
      ''
    )
  }

  // Get result text
  const getResult = (item) => {
    return (
      item.result ||
      item.translatedText ||
      ''
    )
  }

  // Get mode name
  const getModeName = (item) => {
    if (item.type === 'ai') {
      const modes = {
        grammar: '✍️ Grammar Correction',
        rewrite: '🔄 Rewrite Text',
        summary: '📝 Summary',
        explain: '🧠 Explanation',
        translate: '🌐 AI Translation',
      }

      return (
        modes[item.mode] ||
        '🤖 AI Assistant'
      )
    }

    return '🌐 Translator'
  }

  // Get type label
  const getTypeLabel = (item) => {
    if (item.type === 'ai') {
      return '🤖 AI Assistant'
    }

    return '🌐 Translator'
  }

  // Format date
  const formatDate = (date) => {
    if (!date) {
      return ''
    }

    return new Date(date).toLocaleString()
  }

  // Copy result
  const copyResult = async (result) => {
    try {
      await navigator.clipboard.writeText(result)

      alert('Result copied!')
    } catch {
      alert('Unable to copy result.')
    }
  }

  // Delete one history item
  const deleteItem = (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this history item?'
    )

    if (!confirmDelete) {
      return
    }

    const updatedHistory = history.filter(
      (item) => item.id !== id
    )

    localStorage.setItem(
      'translationHistory',
      JSON.stringify(updatedHistory)
    )

    setHistory(updatedHistory)
  }

  // Clear all history
  const clearAllHistory = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete all history?'
    )

    if (!confirmDelete) {
      return
    }

    localStorage.removeItem(
      'translationHistory'
    )

    setHistory([])
  }

  // Download PDF
  const downloadPDF = (item) => {
    const doc = new jsPDF()

    let y = 20

    const input = getInput(item)
    const result = getResult(item)

    // Title
    doc.setFontSize(18)
    doc.text(
      'TranslateHub - History',
      20,
      y
    )

    y += 14

    // Type
    doc.setFontSize(12)
    doc.text(
      `Type: ${getTypeLabel(item)}`,
      20,
      y
    )

    y += 8

    // Mode
    doc.text(
      `Mode: ${getModeName(item)}`,
      20,
      y
    )

    y += 8

    // Language
    const targetLanguage =
      item.targetLanguage ||
      item.targetLang ||
      ''

    if (targetLanguage) {
      doc.text(
        `Target Language: ${targetLanguage}`,
        20,
        y
      )

      y += 8
    }

    // Date
    doc.text(
      `Date: ${formatDate(item.date)}`,
      20,
      y
    )

    y += 14

    // Input
    doc.setFontSize(13)
    doc.text(
      'Input:',
      20,
      y
    )

    y += 8

    doc.setFontSize(11)

    const inputLines =
      doc.splitTextToSize(
        input || '',
        170
      )

    // New page if necessary
    if (
      y + inputLines.length * 6 >
      275
    ) {
      doc.addPage()
      y = 20
    }

    doc.text(
      inputLines,
      20,
      y
    )

    y +=
      inputLines.length * 6 +
      12

    // Result
    doc.setFontSize(13)
    doc.text(
      'Result:',
      20,
      y
    )

    y += 8

    doc.setFontSize(11)

    const resultLines =
      doc.splitTextToSize(
        result || '',
        170
      )

    // Handle multiple PDF pages
    for (
      let i = 0;
      i < resultLines.length;
      i++
    ) {
      if (y > 275) {
        doc.addPage()
        y = 20
      }

      doc.text(
        resultLines[i],
        20,
        y
      )

      y += 6
    }

    // File name
    const typeName =
      item.type === 'ai'
        ? 'AI'
        : 'Translator'

    doc.save(
      `TranslateHub-${typeName}-${item.id}.pdf`
    )
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-10 sm:px-6">

      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-4xl shadow-sm">
            📚
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-blue-600 sm:text-4xl">
            History
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            View and manage all your Translator and AI Assistant history in one place.
          </p>

        </div>

        {/* Controls */}

        {history.length > 0 && (
          <div className="mt-8 rounded-2xl bg-white p-5 shadow-lg">

            <div className="grid gap-4 md:grid-cols-3">

              {/* Search */}

              <div className="md:col-span-1">

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  🔍 Search
                </label>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search history..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* Type Filter */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  🎯 Filter Type
                </label>

                <select
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="all">
                    All History
                  </option>

                  <option value="translator">
                    🌐 Translator
                  </option>

                  <option value="ai">
                    🤖 AI Assistant
                  </option>
                </select>

              </div>

              {/* Language Filter */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  🌍 Filter Language
                </label>

                <select
                  value={filterLanguage}
                  onChange={(e) =>
                    setFilterLanguage(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="all">
                    All Languages
                  </option>

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

              </div>

            </div>

            {/* Activity Info */}

            <div className="mt-5 flex flex-col justify-between gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center">

              <div>

                <h2 className="text-lg font-bold text-gray-800">
                  Your Activity
                </h2>

                <p className="text-sm text-gray-500">
                  Showing{' '}
                  {filteredHistory.length}{' '}
                  of {history.length}{' '}
                  record
                  {history.length !== 1
                    ? 's'
                    : ''}
                </p>

              </div>

              <button
                onClick={
                  clearAllHistory
                }
                className="rounded-xl bg-red-50 px-5 py-2.5 font-semibold text-red-600 transition hover:bg-red-100"
              >
                🗑️ Clear All
              </button>

            </div>

          </div>
        )}

        {/* Empty History */}

        {history.length === 0 && (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-lg">

            <div className="text-6xl">
              📚
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-800">
              No History Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              Your Translator and AI Assistant results will appear here.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">

              <a
                href="/translator"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                🌐 Open Translator
              </a>

              <a
                href="/ai-assistant"
                className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
              >
                🤖 Open AI Assistant
              </a>

            </div>

          </div>
        )}

        {/* No Search Results */}

        {history.length > 0 &&
          filteredHistory.length === 0 && (
            <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-lg">

              <div className="text-5xl">
                🔍
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-800">
                No Results Found
              </h2>

              <p className="mt-2 text-gray-500">
                Try changing your search or filter.
              </p>

            </div>
          )}

        {/* History Cards */}

        <div className="mt-8 space-y-6">

          {filteredHistory.map(
            (item) => {

              const input =
                getInput(item)

              const result =
                getResult(item)

              const targetLanguage =
                item.targetLanguage ||
                item.targetLang ||
                ''

              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white p-6 shadow-lg transition hover:shadow-xl"
                >

                  {/* Card Header */}

                  <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="text-lg font-bold text-gray-800">
                          {getModeName(item)}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.type === 'ai'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {getTypeLabel(item)}
                        </span>

                      </div>

                      {targetLanguage && (
                        <p className="mt-2 text-sm font-medium text-purple-600">
                          🌍 Target Language:{' '}
                          {targetLanguage}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(
                          item.date
                        )}
                      </p>

                    </div>

                    {/* Delete */}

                    <button
                      onClick={() =>
                        deleteItem(
                          item.id
                        )
                      }
                      className="self-start rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 sm:self-auto"
                    >
                      🗑️ Delete
                    </button>

                  </div>

                  {/* Input */}

                  <div className="mt-5">

                    <p className="mb-2 text-sm font-bold text-gray-700">
                      Input
                    </p>

                    <div className="rounded-xl bg-gray-50 p-4">

                      <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                        {input}
                      </p>

                    </div>

                  </div>

                  {/* Result */}

                  <div className="mt-5">

                    <p className="mb-2 text-sm font-bold text-gray-700">
                      {item.type === 'ai'
                        ? 'AI Result'
                        : 'Translation'}
                    </p>

                    <div
                      className={`rounded-xl p-4 ${
                        item.type === 'ai'
                          ? 'bg-purple-50'
                          : 'bg-blue-50'
                      }`}
                    >

                      <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-800">
                        {result}
                      </p>

                    </div>

                  </div>

                  {/* Buttons */}

                  <div className="mt-5 flex flex-wrap gap-3">

                    {/* Copy */}

                    <button
                      onClick={() =>
                        copyResult(
                          result
                        )
                      }
                      className="rounded-lg border border-green-200 px-4 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-50"
                    >
                      📋 Copy
                    </button>

                    {/* PDF */}

                    <button
                      onClick={() =>
                        downloadPDF(
                          item
                        )
                      }
                      className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                      📄 Download PDF
                    </button>

                    {/* Delete */}

                    <button
                      onClick={() =>
                        deleteItem(
                          item.id
                        )
                      }
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>
              )
            }
          )}

        </div>

      </div>

    </main>
  )
}

export default History