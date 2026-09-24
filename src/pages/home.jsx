import { Link } from 'react-router-dom'

const learningFeatures = [
  {
    icon: '🤖',
    title: 'AI Assistant',
    description:
      'Improve grammar, rewrite text, summarize content and get AI-powered language help.',
    to: '/ai-assistant',
  },
  {
    icon: '🧪',
    title: 'AI Quiz',
    description:
      'Practice your language skills with AI-generated quizzes and instant explanations.',
    to: '/quiz',
  },
  {
    icon: '🗣️',
    title: 'Conversation',
    description:
      'Practice real conversations with speech recognition and text-to-speech support.',
    to: '/conversation',
  },
  {
    icon: '📅',
    title: 'Daily Practice',
    description:
      'Learn new words every day and build a consistent language-learning habit.',
    to: '/daily-practice',
  },
  {
    icon: '🗺️',
    title: 'Learning Dashboard',
    description:
      'Track your words, quizzes, XP, streaks and overall learning progress.',
    to: '/learning-dashboard',
  },
  {
    icon: '📚',
    title: 'Vocabulary',
    description:
      'Build and review your personal vocabulary collection while learning new words.',
    to: '/vocabulary',
  },
  {
    icon: '📶',
    title: 'Offline Phrasebook',
    description:
      'Access useful everyday phrases even when an internet connection is unavailable.',
    to: '/offline-phrasebook',
  },
]

const languages = [
  { flag: '🇮🇳', name: 'Hindi' },
  { flag: '🇪🇸', name: 'Spanish' },
  { flag: '🇫🇷', name: 'French' },
  { flag: '🇩🇪', name: 'German' },
  { flag: '🇮🇹', name: 'Italian' },
  { flag: '🇵🇹', name: 'Portuguese' },
]

function Home() {
  return (
    <main className="min-h-[calc(100vh-73px)] overflow-hidden bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(35px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeLeft {
          from {
            opacity: 0;
            transform: translateX(-45px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeRight {
          from {
            opacity: 0;
            transform: translateX(45px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes floatCard {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes floatSmall {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-7px) rotate(2deg);
          }
        }

        @keyframes pulseSoft {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255,255,255,0.25);
          }
          50% {
            transform: scale(1.06);
            box-shadow: 0 0 0 12px rgba(255,255,255,0);
          }
        }

        @keyframes bounceArrow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(7px);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }

        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          70% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-up {
          animation: fadeUp 0.8s ease-out both;
        }

        .animate-fade-left {
          animation: fadeLeft 0.8s ease-out both;
        }

        .animate-fade-right {
          animation: fadeRight 0.9s ease-out both;
        }

        .animate-float-card {
          animation: floatCard 4s ease-in-out infinite;
        }

        .animate-float-small {
          animation: floatSmall 3s ease-in-out infinite;
        }

        .animate-pulse-soft {
          animation: pulseSoft 2.5s ease-in-out infinite;
        }

        .animate-bounce-arrow {
          animation: bounceArrow 1.5s ease-in-out infinite;
        }

        .animate-pop {
          animation: popIn 0.7s ease-out both;
        }

        .gradient-animation {
          background-size: 200% 200%;
          animation: gradientMove 8s ease infinite;
        }

        .shine-button {
          position: relative;
          overflow: hidden;
        }

        .shine-button::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 35%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.35),
            transparent
          );
          transform: translateX(-120%);
        }

        .shine-button:hover::after {
          animation: shine 0.8s ease;
        }

        .feature-card {
          opacity: 0;
          animation: fadeUp 0.7s ease-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up,
          .animate-fade-left,
          .animate-fade-right,
          .animate-float-card,
          .animate-float-small,
          .animate-pulse-soft,
          .animate-bounce-arrow,
          .animate-pop,
          .gradient-animation,
          .feature-card {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-purple-700 px-4 py-20 text-white sm:px-6 lg:py-28">

        <div className="absolute -right-20 -top-20 h-72 w-72 animate-float-small rounded-full bg-white/10 blur-3xl" />

        <div
          className="absolute -bottom-24 -left-20 h-80 w-80 animate-float-small rounded-full bg-purple-400/20 blur-3xl"
          style={{ animationDelay: '1s' }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

          {/* Hero Content */}
          <div className="text-center lg:text-left">

            <div
              className="animate-fade-left mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm"
            >
              <span className="animate-pulse-soft inline-block rounded-full">
                ✨
              </span>
              AI-Powered Language Learning
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">

              <span
                className="inline-block animate-fade-up"
                style={{ animationDelay: '0.15s' }}
              >
                Translate.
              </span>

              <span
                className="block animate-fade-up text-yellow-300"
                style={{ animationDelay: '0.35s' }}
              >
                Practice. Learn.
              </span>

              <span
                className="block animate-fade-up"
                style={{ animationDelay: '0.55s' }}
              >
                Every Day.
              </span>

            </h1>

            <p
              className="animate-fade-up mx-auto mt-6 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg lg:mx-0"
              style={{ animationDelay: '0.75s' }}
            >
              TranslateHub is more than a translation platform.
              Translate text, practice conversations, learn vocabulary,
              take AI quizzes and track your language-learning progress
              in one place.
            </p>

            <div
              className="animate-fade-up mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
              style={{ animationDelay: '0.95s' }}
            >

              <Link
                to="/translator"
                className="shine-button inline-flex items-center justify-center rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-gray-100 hover:shadow-2xl"
              >
                🌐 Start Translating →
              </Link>

              <Link
                to="/daily-practice"
                className="shine-button inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                📅 Start Learning
              </Link>

            </div>

            <div
              className="animate-fade-up mt-8 flex flex-wrap justify-center gap-5 text-sm text-blue-100 lg:justify-start"
              style={{ animationDelay: '1.1s' }}
            >
              <span>✓ AI Powered</span>
              <span>✓ Speech Support</span>
              <span>✓ Learning Progress</span>
              <span>✓ Offline Phrases</span>
            </div>

          </div>

          {/* QUICK TRANSLATION CARD */}
          <div
            className="animate-fade-right mx-auto w-full max-w-md"
            style={{ animationDelay: '0.3s' }}
          >

            <div className="animate-float-card rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md">

              <div className="rounded-2xl bg-white p-5 text-gray-800 shadow-xl dark:bg-slate-800 dark:text-slate-100">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                      Quick Translation
                    </p>

                    <h3 className="mt-1 text-lg font-bold">
                      English → Hindi
                    </h3>
                  </div>

                  <div className="animate-pulse-soft rounded-xl bg-blue-100 p-3 text-2xl dark:bg-blue-900/40">
                    🌐
                  </div>

                </div>

                {/* English */}
                <div
                  className="animate-pop mt-5 rounded-xl bg-gray-50 p-4 dark:bg-slate-700"
                  style={{ animationDelay: '0.8s' }}
                >
                  <p className="text-sm text-gray-500 dark:text-slate-300">
                    English
                  </p>

                  <p className="mt-2 font-semibold">
                    Hello, how are you?
                  </p>
                </div>

                {/* Arrow */}
                <div className="animate-bounce-arrow my-3 text-center text-xl text-blue-600">
                  ↓
                </div>

                {/* Hindi */}
                <div
                  className="animate-pop rounded-xl bg-blue-50 p-4 dark:bg-blue-900/30"
                  style={{ animationDelay: '1s' }}
                >
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Hindi
                  </p>

                  <p className="mt-2 font-semibold text-gray-800 dark:text-slate-100">
                    नमस्ते, आप कैसे हैं?
                  </p>
                </div>

                {/* Mini Cards */}
                <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">

                  <div
                    className="animate-float-small rounded-lg bg-purple-50 p-3 dark:bg-purple-900/30"
                    style={{ animationDelay: '0.2s' }}
                  >
                    <div className="text-lg">🤖</div>
                    <p className="mt-1 font-semibold">AI</p>
                  </div>

                  <div
                    className="animate-float-small rounded-lg bg-green-50 p-3 dark:bg-green-900/30"
                    style={{ animationDelay: '0.6s' }}
                  >
                    <div className="text-lg">📚</div>
                    <p className="mt-1 font-semibold">Learn</p>
                  </div>

                  <div
                    className="animate-float-small rounded-lg bg-orange-50 p-3 dark:bg-orange-900/30"
                    style={{ animationDelay: '1s' }}
                  >
                    <div className="text-lg">🔥</div>
                    <p className="mt-1 font-semibold">Streak</p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* QUICK STATS */}
      <section className="relative z-10 -mt-8 px-4 sm:px-6">

        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {[
            ['🤖', 'AI', 'Powered Learning'],
            ['🗣️', 'Speech', 'Conversation Practice'],
            ['📚', 'Vocabulary', 'Build Your Word Bank'],
            ['📶', 'Offline', 'Phrase Access'],
          ].map(([icon, title, text], index) => (

            <div
              key={title}
              className="animate-fade-up rounded-2xl bg-white p-5 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-800"
              style={{ animationDelay: `${index * 0.15}s` }}
            >

              <div className="animate-float-small text-3xl">
                {icon}
              </div>

              <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
                {title}
              </p>

              <p className="text-sm text-gray-500 dark:text-slate-300">
                {text}
              </p>

            </div>

          ))}

        </div>
      </section>

      {/* WHY TRANSLATEHUB */}
      <section className="px-4 py-20 transition-colors sm:px-6">

        <div className="mx-auto max-w-7xl">

          <div className="animate-fade-up text-center">

            <p className="font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              More Than Translation
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white sm:text-4xl">
              Everything You Need to Learn
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600 dark:text-slate-300">
              Translate, practice and improve your language skills
              with a complete learning experience.
            </p>

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {[
              [
                '⚡',
                'Fast & Simple',
                'Get translations through a clean and easy-to-use interface.',
              ],
              [
                '🤖',
                'AI Learning',
                'Use AI to improve grammar, rewrite text, summarize and learn.',
              ],
              [
                '🗣️',
                'Speak & Practice',
                'Practice conversations using speech recognition and audio.',
              ],
              [
                '📊',
                'Track Progress',
                'Monitor your XP, streaks, vocabulary and learning progress.',
              ],
            ].map(([icon, title, description], index) => (

              <div
                key={title}
                className="feature-card rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition duration-300 hover:-translate-y-3 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800"
                style={{ animationDelay: `${index * 0.15}s` }}
              >

                <div className="animate-float-small flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-3xl dark:bg-blue-900/40">
                  {icon}
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-800 dark:text-white">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-slate-300">
                  {description}
                </p>

              </div>

            ))}

          </div>

        </div>
      </section>

      {/* LEARNING FEATURES */}
      <section className="bg-white px-4 py-20 transition-colors dark:bg-slate-900 sm:px-6">

        <div className="mx-auto max-w-7xl">

          <div className="animate-fade-up text-center">

            <p className="font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Explore TranslateHub
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white sm:text-4xl">
              Your Language Learning Tools
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-slate-300">
              Choose a tool and continue your language-learning journey.
            </p>

          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {learningFeatures.map((feature, index) => (

              <Link
                key={feature.title}
                to={feature.to}
                className="feature-card group rounded-2xl border border-gray-100 bg-slate-50 p-6 shadow-sm transition duration-300 hover:-translate-y-3 hover:border-blue-200 hover:bg-white hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500 dark:hover:bg-slate-700"
                style={{ animationDelay: `${index * 0.12}s` }}
              >

                <div className="flex items-start justify-between">

                  <div className="animate-float-small flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm transition duration-300 group-hover:scale-110 dark:bg-slate-700">
                    {feature.icon}
                  </div>

                  <span className="text-xl text-gray-400 transition duration-300 group-hover:translate-x-2 group-hover:text-blue-600 dark:text-slate-500">
                    →
                  </span>

                </div>

                <h3 className="mt-6 text-xl font-bold text-gray-800 dark:text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-slate-300">
                  {feature.description}
                </p>

                <p className="mt-5 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Explore feature →
                </p>

              </Link>

            ))}

          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 py-20 sm:px-6">

        <div className="mx-auto max-w-6xl">

          <div className="animate-fade-up text-center">

            <p className="font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Simple Process
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white sm:text-4xl">
              Learn in Three Steps
            </h2>

          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">

            {[
              [
                '01',
                'Translate',
                'Enter your text and translate it into your preferred language.',
                'bg-blue-600',
              ],
              [
                '02',
                'Practice',
                'Practice vocabulary, conversations and AI-generated quizzes.',
                'bg-purple-600',
              ],
              [
                '03',
                'Track & Improve',
                'Build your streak, earn XP and monitor your learning progress.',
                'bg-green-600',
              ],
            ].map(([number, title, description, bg], index) => (

              <div
                key={number}
                className="animate-fade-up text-center"
                style={{ animationDelay: `${index * 0.2}s` }}
              >

                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${bg} text-xl font-bold text-white shadow-lg transition duration-300 hover:scale-110 hover:shadow-2xl`}
                >
                  {number}
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-800 dark:text-white">
                  {title}
                </h3>

                <p className="mt-3 leading-6 text-gray-600 dark:text-slate-300">
                  {description}
                </p>

              </div>

            ))}

          </div>

        </div>
      </section>

      {/* LANGUAGES */}
      <section className="bg-slate-100 px-4 py-20 transition-colors dark:bg-slate-900 sm:px-6">

        <div className="mx-auto max-w-6xl text-center">

          <div className="animate-fade-up">

            <p className="font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Language Support
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white sm:text-4xl">
              Learn Across Languages
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-slate-300">
              Explore popular languages and practice communication with ease.
            </p>

          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">

            {languages.map((language, index) => (

              <div
                key={language.name}
                className="animate-pop rounded-2xl bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-slate-800"
                style={{ animationDelay: `${index * 0.12}s` }}
              >

                <div className="animate-float-small text-3xl">
                  {language.flag}
                </div>

                <p className="mt-3 font-semibold text-gray-800 dark:text-white">
                  {language.name}
                </p>

              </div>

            ))}

          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 py-20 sm:px-6">

        <div className="gradient-animation mx-auto max-w-6xl rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-14 text-center text-white shadow-2xl sm:px-10">

          <div className="animate-float-small text-5xl">
            🚀
          </div>

          <h2 className="animate-fade-up mt-5 text-3xl font-bold sm:text-4xl">
            Start Your Language Journey
          </h2>

          <p className="animate-fade-up mx-auto mt-4 max-w-2xl leading-7 text-blue-100">
            Translate text, practice conversations, learn new vocabulary
            and build your language skills with TranslateHub.
          </p>

          <div
            className="animate-fade-up mt-8 flex flex-col justify-center gap-4 sm:flex-row"
            style={{ animationDelay: '0.3s' }}
          >

            <Link
              to="/translator"
              className="shine-button inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 font-bold text-blue-600 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-gray-100 hover:shadow-2xl"
            >
              🌐 Start Translating →
            </Link>

            <Link
              to="/daily-practice"
              className="shine-button inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/10 px-8 py-3.5 font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/20"
            >
              📅 Daily Practice
            </Link>

          </div>

        </div>
      </section>

    </main>
  )
}

export default Home