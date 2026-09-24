import { useState } from 'react'

const dailyWords = [
  {
    word: 'Achieve',
    meaning: 'To successfully complete or reach something',
    sentence: 'She worked hard to achieve her goal.',
    options: [
      'To forget something',
      'To successfully reach something',
      'To explain something',
      'To avoid something',
    ],
    answer: 1,
  },
  {
    word: 'Brave',
    meaning: 'Having courage',
    sentence: 'The brave boy helped the injured dog.',
    options: [
      'Having courage',
      'Being tired',
      'Being confused',
      'Being silent',
    ],
    answer: 0,
  },
  {
    word: 'Improve',
    meaning: 'To make something better',
    sentence: 'I want to improve my English.',
    options: [
      'To reduce something',
      'To make something better',
      'To hide something',
      'To copy something',
    ],
    answer: 1,
  },
  {
    word: 'Journey',
    meaning: 'The act of travelling from one place to another',
    sentence: 'Our journey to Delhi was exciting.',
    options: [
      'A competition',
      'A journey or trip',
      'A lesson',
      'A celebration',
    ],
    answer: 1,
  },
  {
    word: 'Success',
    meaning: 'Achievement of a desired result',
    sentence: 'Hard work is important for success.',
    options: [
      'Failure',
      'Achievement of a desired result',
      'A problem',
      'A delay',
    ],
    answer: 1,
  },
  {
    word: 'Confident',
    meaning: 'Feeling sure about your abilities',
    sentence: 'She felt confident before the interview.',
    options: [
      'Feeling sure about yourself',
      'Feeling sleepy',
      'Feeling angry',
      'Feeling confused',
    ],
    answer: 0,
  },
  {
    word: 'Explore',
    meaning: 'To travel around or investigate something',
    sentence: 'We explored the beautiful city.',
    options: [
      'To destroy',
      'To explore or investigate',
      'To forget',
      'To repeat',
    ],
    answer: 1,
  },
  {
    word: 'Opportunity',
    meaning: 'A good chance to do something',
    sentence: 'This internship is a great opportunity.',
    options: [
      'A good chance',
      'A difficult problem',
      'A mistake',
      'A punishment',
    ],
    answer: 0,
  },
  {
    word: 'Challenge',
    meaning: 'A difficult task or situation',
    sentence: 'Learning a new language is a challenge.',
    options: [
      'An easy task',
      'A difficult task',
      'A celebration',
      'A reward',
    ],
    answer: 1,
  },
  {
    word: 'Discover',
    meaning: 'To find something new',
    sentence: 'I discovered a new way to learn vocabulary.',
    options: [
      'To lose something',
      'To find something new',
      'To hide something',
      'To delete something',
    ],
    answer: 1,
  },
]

function DailyPractice() {
  const getPracticeWords = () => {
    const today = new Date().toISOString().slice(0, 10)

    const dayNumber =
      Math.floor(
        new Date(today).getTime() /
          (1000 * 60 * 60 * 24)
      )

    const startIndex =
      (dayNumber * 5) % dailyWords.length

    const selected = []

    for (let i = 0; i < 5; i++) {
      selected.push(
        dailyWords[
          (startIndex + i) %
            dailyWords.length
        ]
      )
    }

    return selected
  }

  const [practiceWords, setPracticeWords] = useState(() => getPracticeWords())
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [todayCompleted, setTodayCompleted] =
    useState(() => {
      const today = new Date().toISOString().slice(0, 10)
      return (
        localStorage.getItem('translateHubDailyPracticeDate') ===
        today
      )
    })

  const selectAnswer = (questionIndex, answer) => {
    if (completed) return

    setSelectedAnswers((previous) => ({
      ...previous,
      [questionIndex]: answer,
    }))
  }

  const completePractice = () => {
    if (
      Object.keys(selectedAnswers).length !== 5
    ) {
      alert(
        'Please answer all 5 questions first.'
      )
      return
    }

    let finalScore = 0

    practiceWords.forEach((word, index) => {
      if (
        selectedAnswers[index] ===
        word.answer
      ) {
        finalScore++
      }
    })

    setScore(finalScore)
    setCompleted(true)

    const today =
      new Date().toISOString().slice(0, 10)

    localStorage.setItem(
      'translateHubDailyPracticeDate',
      today
    )

    const oldStats = JSON.parse(
      localStorage.getItem(
        'translateHubLearningStats'
      ) || '{}'
    )

    const previousWords =
      oldStats.wordsLearned || 0

    const previousQuizzes =
      oldStats.quizzesCompleted || 0

    const previousXP =
      oldStats.xp || 0

    const previousLastDate =
      oldStats.lastPracticeDate || ''

    const previousStreak =
      oldStats.streak || 0

    let newStreak = previousStreak

    if (previousLastDate !== today) {
      const yesterday = new Date()

      yesterday.setDate(
        yesterday.getDate() - 1
      )

      const yesterdayString =
        yesterday
          .toISOString()
          .slice(0, 10)

      if (
        previousLastDate ===
        yesterdayString
      ) {
        newStreak++
      } else {
        newStreak = 1
      }
    }

    const xpEarned =
      50 + finalScore * 10

    const newStats = {
      wordsLearned:
        previousWords + 5,

      quizzesCompleted:
        previousQuizzes + 1,

      xp:
        previousXP + xpEarned,

      streak: newStreak,

      lastPracticeDate: today,
    }

    localStorage.setItem(
      'translateHubLearningStats',
      JSON.stringify(newStats)
    )
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">

        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-4xl">
            📅
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-blue-600 sm:text-4xl">
            Daily Language Practice
          </h1>

          <p className="mt-3 text-gray-600">
            Learn 5 new words and test your knowledge.
          </p>
        </div>

        {todayCompleted && !completed && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
            <p className="font-bold text-green-700">
              ✅ Today's practice is already completed!
            </p>

            <p className="mt-1 text-sm text-green-600">
              Come back tomorrow for a new practice.
            </p>
          </div>
        )}

        <div className="mt-8 space-y-5">
          {practiceWords.map((item, index) => (
            <div
              key={item.word}
              className="rounded-2xl bg-white p-6 shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-sm font-semibold text-blue-500">
                    Word {index + 1}
                  </span>

                  <h2 className="mt-1 text-2xl font-bold text-gray-800">
                    {item.word}
                  </h2>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  Easy
                </span>
              </div>

              <p className="mt-3 text-gray-600">
                {item.meaning}
              </p>

              <div className="mt-4 rounded-xl bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-700">
                  Example
                </p>

                <p className="mt-1 text-gray-700">
                  {item.sentence}
                </p>
              </div>

              <div className="mt-5">
                <p className="mb-3 font-semibold text-gray-700">
                  Mini Quiz
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {item.options.map(
                    (option, optionIndex) => (
                      <button
                        key={option}
                        onClick={() =>
                          selectAnswer(
                            index,
                            optionIndex
                          )
                        }
                        disabled={completed}
                        className={`rounded-xl border p-3 text-left transition ${
                          selectedAnswers[index] ===
                          optionIndex
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!completed ? (
          <button
            onClick={completePractice}
            disabled={todayCompleted}
            className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            🎯 Complete Today's Practice
          </button>
        ) : (
          <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow-lg">
            <div className="text-5xl">
              {score === 5
                ? '🏆'
                : score >= 3
                  ? '🎉'
                  : '💪'}
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              Practice Completed!
            </h2>

            <p className="mt-2 text-gray-600">
              Your score: {score}/5
            </p>

            <p className="mt-2 font-semibold text-blue-600">
              +{50 + score * 10} XP earned
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

export default DailyPractice