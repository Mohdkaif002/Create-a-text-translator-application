import { useState } from 'react'

function QuizGenerator() {
  const [text, setText] = useState('')
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [finished, setFinished] = useState(false)
  const [loading, setLoading] = useState(false)

  const generateQuiz = async () => {
    if (!text.trim()) {
      alert('Please enter some English text.')
      return
    }

    setLoading(true)
    setQuestions([])
    setCurrentQuestion(0)
    setSelectedAnswer('')
    setScore(0)
    setAnswered(false)
    setFinished(false)

    try {
      const response = await fetch(
        'http://localhost:5000/api/quiz',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Quiz generation failed.'
        )
      }

      if (
        !data.questions ||
        !Array.isArray(data.questions)
      ) {
        throw new Error(
          'Invalid quiz response.'
        )
      }

      setQuestions(data.questions)
    } catch (error) {
      console.error('Quiz Error:', error)

      alert(
        error.message ||
          'Something went wrong. Please make sure the AI backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (answer) => {
    if (answered) {
      return
    }

    setSelectedAnswer(answer)
    setAnswered(true)

    if (
      answer ===
      questions[currentQuestion].correctAnswer
    ) {
      setScore((previousScore) => previousScore + 1)
    }
  }

  const nextQuestion = () => {
    if (
      currentQuestion ===
      questions.length - 1
    ) {
      setFinished(true)
      return
    }

    setCurrentQuestion(
      (previousQuestion) =>
        previousQuestion + 1
    )

    setSelectedAnswer('')
    setAnswered(false)
  }

  const restartQuiz = () => {
    setQuestions([])
    setCurrentQuestion(0)
    setSelectedAnswer('')
    setScore(0)
    setAnswered(false)
    setFinished(false)
  }

  const clearText = () => {
    setText('')
    restartQuiz()
  }

  const currentQuiz =
    questions[currentQuestion]

  return (
    <main className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">

        {/* Header */}

        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-4xl shadow-sm">
            🧪
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-blue-600 sm:text-4xl">
            AI Quiz Generator
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Generate an interactive quiz from
            your English text using AI.
          </p>
        </div>

        {/* Input Section */}

        {questions.length === 0 && (
          <div className="mt-10 rounded-2xl bg-white p-6 shadow-lg sm:p-8">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                🧠
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Create Your Quiz
                </h2>

                <p className="text-sm text-gray-500">
                  Enter an English paragraph and
                  AI will create 5 questions.
                </p>
              </div>
            </div>

            <label className="mb-2 mt-6 block text-sm font-semibold text-gray-700">
              Enter English Text
            </label>

            <textarea
              value={text}
              onChange={(e) =>
                setText(e.target.value)
              }
              rows={9}
              placeholder="Paste an English paragraph here..."
              className="w-full resize-none rounded-xl border border-gray-300 p-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <div className="mt-2 text-right text-xs text-gray-500">
              {text.length} characters
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={generateQuiz}
                disabled={loading}
                className="flex-1 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading
                  ? '🤖 Generating Quiz...'
                  : '🧪 Generate Quiz'}
              </button>

              <button
                onClick={clearText}
                disabled={
                  loading || !text
                }
                className="rounded-xl border border-gray-300 px-6 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Quiz */}

        {questions.length > 0 &&
          !finished &&
          currentQuiz && (
            <div className="mt-10 rounded-2xl bg-white p-6 shadow-lg sm:p-8">

              {/* Progress */}

              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-500">
                  Question{' '}
                  {currentQuestion + 1}{' '}
                  of {questions.length}
                </p>

                <p className="text-sm font-bold text-blue-600">
                  Score: {score}
                </p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{
                    width: `${
                      ((currentQuestion + 1) /
                        questions.length) *
                      100
                    }%`,
                  }}
                />
              </div>

              {/* Question */}

              <div className="mt-8">
                <h2 className="text-xl font-bold leading-8 text-gray-800 sm:text-2xl">
                  {currentQuiz.question}
                </h2>
              </div>

              {/* Options */}

              <div className="mt-6 grid gap-4">
                {currentQuiz.options.map(
                  (option, index) => {
                    const isSelected =
                      selectedAnswer === option

                    const isCorrect =
                      option ===
                      currentQuiz.correctAnswer

                    let optionClass =
                      'border-gray-200 hover:border-blue-400 hover:bg-blue-50'

                    if (answered) {
                      if (isCorrect) {
                        optionClass =
                          'border-green-500 bg-green-50 text-green-700'
                      } else if (
                        isSelected
                      ) {
                        optionClass =
                          'border-red-500 bg-red-50 text-red-700'
                      } else {
                        optionClass =
                          'border-gray-200 bg-gray-50'
                      }
                    }

                    return (
                      <button
                        key={index}
                        onClick={() =>
                          handleAnswer(
                            option
                          )
                        }
                        disabled={answered}
                        className={`rounded-xl border-2 p-4 text-left font-semibold transition ${optionClass}`}
                      >
                        <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm">
                          {String.fromCharCode(
                            65 + index
                          )}
                        </span>

                        {option}
                      </button>
                    )
                  }
                )}
              </div>

              {/* Explanation */}

              {answered && (
                <div
                  className={`mt-6 rounded-xl p-5 ${
                    selectedAnswer ===
                    currentQuiz.correctAnswer
                      ? 'bg-green-50'
                      : 'bg-red-50'
                  }`}
                >
                  <p className="font-bold text-gray-800">
                    {selectedAnswer ===
                    currentQuiz.correctAnswer
                      ? '✅ Correct!'
                      : '❌ Incorrect'}
                  </p>

                  <p className="mt-2 leading-6 text-gray-700">
                    {currentQuiz.explanation}
                  </p>
                </div>
              )}

              {/* Next */}

              {answered && (
                <button
                  onClick={nextQuestion}
                  className="mt-6 w-full rounded-xl bg-purple-600 px-6 py-3.5 font-bold text-white transition hover:bg-purple-700"
                >
                  {currentQuestion ===
                  questions.length - 1
                    ? '🏆 Finish Quiz'
                    : 'Next Question →'}
                </button>
              )}
            </div>
          )}

        {/* Result */}

        {finished && (
          <div className="mt-10 rounded-2xl bg-white p-8 text-center shadow-lg sm:p-12">

            <div className="text-7xl">
              🏆
            </div>

            <h2 className="mt-5 text-3xl font-extrabold text-gray-800">
              Quiz Completed!
            </h2>

            <p className="mt-4 text-lg text-gray-600">
              You scored
            </p>

            <div className="mt-3 text-5xl font-extrabold text-blue-600">
              {score} / {questions.length}
            </div>

            <p className="mt-4 text-gray-500">
              {score === questions.length
                ? 'Excellent! Perfect score! 🎉'
                : score >=
                    Math.ceil(
                      questions.length * 0.6
                    )
                  ? 'Great job! Keep practicing. 👍'
                  : 'Keep learning and try again! 💪'}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={restartQuiz}
                className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                🔄 New Quiz
              </button>

              <button
                onClick={clearText}
                className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Feature Cards */}

        {questions.length === 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-3">

            <div className="rounded-xl bg-white p-5 text-center shadow-sm">
              <div className="text-3xl">
                🧠
              </div>

              <h3 className="mt-2 font-bold text-gray-800">
                AI Generated
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Questions are created from
                your text.
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 text-center shadow-sm">
              <div className="text-3xl">
                🎯
              </div>

              <h3 className="mt-2 font-bold text-gray-800">
                Interactive
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Select answers and get
                instant feedback.
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 text-center shadow-sm">
              <div className="text-3xl">
                🏆
              </div>

              <h3 className="mt-2 font-bold text-gray-800">
                Score
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                See your final score after
                completing the quiz.
              </p>
            </div>

          </div>
        )}

      </div>
    </main>
  )
}

export default QuizGenerator