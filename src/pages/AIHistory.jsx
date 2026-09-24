import { useState } from 'react'

function AIHistory() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('aiHistory') || '[]'
      )
    } catch {
      return []
    }
  })

  const deleteItem = (id) => {
    const updatedHistory = history.filter(
      (item) => item.id !== id
    )

    localStorage.setItem(
      'aiHistory',
      JSON.stringify(updatedHistory)
    )

    setHistory(updatedHistory)
  }

  const clearAllHistory = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete all AI history?'
    )

    if (!confirmDelete) return

    localStorage.removeItem('aiHistory')
    setHistory([])
  }

  const copyResult = (result) => {
    navigator.clipboard.writeText(result)
    alert('AI result copied!')
  }

  const getModeName = (mode) => {
    const modes = {
      grammar: '✍️ Grammar Correction',
      rewrite: '🔄 Rewrite Text',
      summary: '📝 Summary',
      explain: '🧠 Explanation',
      translate: '🌐 AI Translation',
    }

    return modes[mode] || '🤖 AI Assistant'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString()
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-10 sm:px-6">

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-4xl shadow-sm">
            🧠
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-purple-600 sm:text-4xl">
            AI History
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            View your previous AI Assistant results.
          </p>

        </div>

        {/* History Header */}
        {history.length > 0 && (
          <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center">

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Your AI Activity
              </h2>

              <p className="text-sm text-gray-500">
                {history.length} saved result
                {history.length !== 1 ? 's' : ''}
              </p>
            </div>

            <button
              onClick={clearAllHistory}
              className="rounded-xl bg-red-50 px-5 py-2.5 font-semibold text-red-600 transition hover:bg-red-100"
            >
              🗑️ Clear All
            </button>

          </div>
        )}

        {/* Empty State */}
        {history.length === 0 && (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-lg">

            <div className="text-6xl">
              🧠
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-800">
              No AI History Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              Your AI Grammar, Rewrite, Summary, Explanation
              and Translation results will appear here.
            </p>

            <a
              href="/ai-assistant"
              className="mt-6 inline-block rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              🤖 Open AI Assistant
            </a>

          </div>
        )}

        {/* History Cards */}
        <div className="mt-8 space-y-6">

          {history.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white p-6 shadow-lg"
            >

              {/* Card Header */}
              <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">

                <div>

                  <h3 className="text-lg font-bold text-gray-800">
                    {getModeName(item.mode)}
                  </h3>

                  {item.mode === 'translate' &&
                    item.targetLanguage && (
                      <p className="mt-1 text-sm text-purple-600">
                        Target Language: {item.targetLanguage}
                      </p>
                    )}

                  <p className="mt-1 text-xs text-gray-400">
                    {formatDate(item.date)}
                  </p>

                </div>

                <button
                  onClick={() => deleteItem(item.id)}
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
                    {item.input}
                  </p>
                </div>

              </div>

              {/* Result */}
              <div className="mt-5">

                <p className="mb-2 text-sm font-bold text-gray-700">
                  AI Result
                </p>

                <div className="rounded-xl bg-purple-50 p-4">

                  <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-800">
                    {item.result}
                  </p>

                </div>

              </div>

              {/* Copy */}
              <button
                onClick={() => copyResult(item.result)}
                className="mt-4 rounded-lg border border-purple-200 px-4 py-2 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
              >
                📋 Copy Result
              </button>

            </div>
          ))}

        </div>

      </div>

    </main>
  )
}

export default AIHistory