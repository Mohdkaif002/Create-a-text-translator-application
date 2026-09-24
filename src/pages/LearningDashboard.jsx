import { useState } from 'react'

function LearningDashboard() {
  const [stats, setStats] = useState(() => {
    try {
      const savedStats = JSON.parse(
        localStorage.getItem(
          'translateHubLearningStats'
        ) || '{}'
      )

      const vocabulary = JSON.parse(
        localStorage.getItem(
          'translateHubVocabulary'
        ) || '[]'
      )

      return {
        wordsLearned:
          savedStats.wordsLearned ||
          vocabulary.length ||
          0,

        quizzesCompleted:
          savedStats.quizzesCompleted || 0,

        streak: savedStats.streak || 0,

        xp: savedStats.xp || 0,
      }
    } catch {
      return {
        wordsLearned: 0,
        quizzesCompleted: 0,
        streak: 0,
        xp: 0,
      }
    }
  })

  const getLevel = () => {
    if (stats.xp >= 1000) return 5
    if (stats.xp >= 750) return 4
    if (stats.xp >= 500) return 3
    if (stats.xp >= 250) return 2

    return 1
  }

  const getProgress = () => {
    const levelXP =
      ((getLevel() - 1) * 250)

    const progress =
      ((stats.xp - levelXP) / 250) * 100

    return Math.min(
      Math.max(progress, 0),
      100
    )
  }

  const badges = [
    {
      name: 'First Step',
      icon: '🌱',
      unlocked:
        stats.wordsLearned >= 1,
    },
    {
      name: 'Word Collector',
      icon: '📚',
      unlocked:
        stats.wordsLearned >= 10,
    },
    {
      name: 'Quiz Master',
      icon: '🧠',
      unlocked:
        stats.quizzesCompleted >= 5,
    },
    {
      name: '3 Day Streak',
      icon: '🔥',
      unlocked:
        stats.streak >= 3,
    },
    {
      name: '7 Day Streak',
      icon: '🏆',
      unlocked:
        stats.streak >= 7,
    },
  ]

  return (
    <main className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">

        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-4xl">
            🗺️
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-blue-600 sm:text-4xl">
            Language Learning Dashboard
          </h1>

          <p className="mt-3 text-gray-600">
            Track your vocabulary, quizzes, XP and learning streak.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="text-3xl">📚</div>

            <p className="mt-3 text-sm font-semibold text-gray-500">
              Words Learned
            </p>

            <p className="mt-1 text-3xl font-extrabold text-blue-600">
              {stats.wordsLearned}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="text-3xl">🧠</div>

            <p className="mt-3 text-sm font-semibold text-gray-500">
              Quizzes Completed
            </p>

            <p className="mt-1 text-3xl font-extrabold text-purple-600">
              {stats.quizzesCompleted}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="text-3xl">🔥</div>

            <p className="mt-3 text-sm font-semibold text-gray-500">
              Learning Streak
            </p>

            <p className="mt-1 text-3xl font-extrabold text-orange-500">
              {stats.streak}
            </p>

            <p className="text-sm text-gray-500">
              days
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="text-3xl">⭐</div>

            <p className="mt-3 text-sm font-semibold text-gray-500">
              Total XP
            </p>

            <p className="mt-1 text-3xl font-extrabold text-green-600">
              {stats.xp}
            </p>
          </div>

        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                Current Level
              </p>

              <h2 className="text-2xl font-bold text-gray-800">
                Level {getLevel()}
              </h2>
            </div>

            <div className="text-4xl">
              🚀
            </div>
          </div>

          <div className="mt-5 h-4 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${getProgress()}%`,
              }}
            />
          </div>

          <p className="mt-2 text-right text-sm text-gray-500">
            {Math.round(getProgress())}% complete
          </p>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                🏆 Learning Streak
              </h2>

              <p className="mt-1 text-gray-500">
                Keep practicing every day!
              </p>
            </div>

            <div className="text-4xl">
              🔥
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-orange-50 p-5 text-center">
            <p className="text-4xl font-extrabold text-orange-500">
              {stats.streak}
            </p>

            <p className="mt-1 font-semibold text-orange-700">
              Day Streak
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">

          <h2 className="text-xl font-bold text-gray-800">
            🎖️ Badges
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

            {badges.map((badge) => (
              <div
                key={badge.name}
                className={`rounded-xl border p-5 text-center ${
                  badge.unlocked
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className="text-4xl">
                  {badge.icon}
                </div>

                <p className="mt-2 font-bold text-gray-800">
                  {badge.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {badge.unlocked
                    ? 'Unlocked'
                    : 'Locked'}
                </p>
              </div>
            ))}

          </div>
        </div>

      </div>
    </main>
  )
}

export default LearningDashboard