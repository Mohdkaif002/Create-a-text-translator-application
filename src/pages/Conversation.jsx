import { useEffect, useRef, useState } from 'react'

function Conversation() {
  const [sourceLanguage, setSourceLanguage] =
    useState('English')

  const [targetLanguage, setTargetLanguage] =
    useState('Hindi')

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const [isListening, setIsListening] =
    useState(false)

  const recognitionRef = useRef(null)

  // ==========================================
  // TEXT TO SPEECH STATES
  // ==========================================

  const [isSpeaking, setIsSpeaking] =
    useState(false)

  const [autoSpeak, setAutoSpeak] =
    useState(true)

  // ==========================================
  // LANGUAGE MAP
  // ==========================================

  const languageMap = {
    English: 'en-US',
    Hindi: 'hi-IN',
    Spanish: 'es-ES',
    French: 'fr-FR',
    German: 'de-DE',
    Japanese: 'ja-JP',
    Chinese: 'zh-CN',
    Arabic: 'ar-SA',
  }

  // ==========================================
  // SPEECH RECOGNITION SETUP
  // ==========================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      return
    }

    const speechRecognition =
      new SpeechRecognition()

    speechRecognition.continuous = false
    speechRecognition.interimResults = false

    speechRecognition.onstart = () => {
      setIsListening(true)
    }

    speechRecognition.onend = () => {
      setIsListening(false)
    }

    speechRecognition.onerror = (error) => {
      console.error(
        'Speech Recognition Error:',
        error
      )

      setIsListening(false)
    }

    speechRecognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript

      setMessage(transcript)
    }

    recognitionRef.current =
      speechRecognition

    return () => {
      speechRecognition.stop()
      window.speechSynthesis.cancel()
      recognitionRef.current = null
    }
  }, [])

  // ==========================================
  // START LISTENING
  // ==========================================

  const startListening = () => {
    const recognition = recognitionRef.current

    if (!recognition) {
      alert(
        'Speech recognition is not supported in this browser.'
      )

      return
    }

    if (isListening) {
      return
    }

    recognition.lang =
      languageMap[sourceLanguage] ||
      'en-US'

    try {
      recognition.start()
    } catch (error) {
      console.error(
        'Could not start speech recognition:',
        error
      )
    }
  }

  // ==========================================
  // TEXT TO SPEECH
  // ==========================================

  const speakText = (text, language) => {
    if (!('speechSynthesis' in window)) {
      alert(
        'Text-to-Speech is not supported in this browser.'
      )

      return
    }

    // Stop previous speech
    window.speechSynthesis.cancel()

    const utterance =
      new SpeechSynthesisUtterance(text)

    utterance.lang =
      languageMap[language] ||
      'en-US'

    utterance.rate = 0.95
    utterance.pitch = 1

    // Speech started
    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    // Speech completed
    utterance.onend = () => {
      setIsSpeaking(false)
    }

    // Speech error
    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    window.speechSynthesis.speak(
      utterance
    )
  }

  // ==========================================
  // TRANSLATE MESSAGE
  // ==========================================

  const handleTranslate = async () => {
    if (!message.trim()) {
      return
    }

    const userMessage =
      message.trim()

    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:5000/api/ai',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            text: userMessage,
            mode: 'translate',
            targetLanguage,
          }),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Translation failed.'
        )
      }

      const translatedText =
        data.result

      // Add message to conversation
      setMessages(
        (previousMessages) => [
          ...previousMessages,

          {
            id: Date.now(),

            source: sourceLanguage,

            target: targetLanguage,

            original: userMessage,

            translation:
              translatedText,
          },
        ]
      )

      // Auto speak translation
      if (autoSpeak) {
        speakText(
          translatedText,
          targetLanguage
        )
      }

      setMessage('')
    } catch (error) {
      console.error(
        'Conversation Error:',
        error
      )

      alert(
        error.message ||
          'Something went wrong.'
      )
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // SWAP LANGUAGES
  // ==========================================

  const swapLanguages = () => {
    setSourceLanguage(
      targetLanguage
    )

    setTargetLanguage(
      sourceLanguage
    )
  }

  // ==========================================
  // CLEAR CONVERSATION
  // ==========================================

  const clearConversation = () => {
    setMessages([])
    setMessage('')

    window.speechSynthesis.cancel()

    setIsSpeaking(false)
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-10 sm:px-6">

      <div className="mx-auto max-w-4xl">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-4xl">
            🗣️
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-blue-600 sm:text-4xl">
            AI Conversation Mode
          </h1>

          <p className="mt-3 text-gray-600">
            Translate conversations between
            two languages using AI.
          </p>

        </div>

        {/* ======================================
            LANGUAGE SELECTION
        ====================================== */}

        <div className="mt-8 rounded-2xl bg-white p-5 shadow-lg">

          <div className="flex flex-col items-center gap-4 sm:flex-row">

            {/* SOURCE LANGUAGE */}

            <div className="w-full flex-1">

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Your Language
              </label>

              <select
                value={sourceLanguage}
                onChange={(e) =>
                  setSourceLanguage(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Japanese</option>
                <option>Chinese</option>
                <option>Arabic</option>
              </select>

            </div>

            {/* SWAP BUTTON */}

            <button
              onClick={swapLanguages}
              className="mt-6 flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-xl transition hover:bg-blue-200"
              title="Swap languages"
            >
              🔄
            </button>

            {/* TARGET LANGUAGE */}

            <div className="w-full flex-1">

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Other Person's Language
              </label>

              <select
                value={targetLanguage}
                onChange={(e) =>
                  setTargetLanguage(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option>Hindi</option>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Japanese</option>
                <option>Chinese</option>
                <option>Arabic</option>
              </select>

            </div>

          </div>

        </div>

        {/* ======================================
            CONVERSATION
        ====================================== */}

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-lg sm:p-7">

          {/* CONVERSATION HEADER */}

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <h2 className="text-xl font-bold text-gray-800">
              💬 Conversation
            </h2>

            <div className="flex flex-wrap items-center gap-3">

              {/* AUTO SPEAK */}

              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-600">

                <input
                  type="checkbox"
                  checked={autoSpeak}
                  onChange={(e) =>
                    setAutoSpeak(
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 accent-blue-600"
                />

                🔊 Auto Speak

              </label>

              {/* CLEAR */}

              {messages.length > 0 && (
                <button
                  onClick={clearConversation}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Clear
                </button>
              )}

            </div>

          </div>

          {/* ======================================
              SPEAKING INDICATOR
          ====================================== */}

          {isSpeaking && (
            <div className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600">

              <span className="animate-pulse text-lg">
                🔊
              </span>

              Speaking...

            </div>
          )}

          {/* ======================================
              MESSAGES
          ====================================== */}

          <div className="max-h-[450px] space-y-5 overflow-y-auto">

            {messages.length === 0 ? (

              <div className="py-16 text-center">

                <div className="text-5xl">
                  💬
                </div>

                <p className="mt-4 font-semibold text-gray-700">
                  Start a conversation
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Type a message or use your
                  microphone to start.
                </p>

              </div>

            ) : (

              messages.map((item) => (

                <div
                  key={item.id}
                  className="space-y-3"
                >

                  {/* ORIGINAL MESSAGE */}

                  <div className="flex justify-end">

                    <div className="max-w-[85%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-white">

                      <p className="text-xs font-semibold text-blue-100">
                        {item.source}
                      </p>

                      <p className="mt-1">
                        {item.original}
                      </p>

                    </div>

                  </div>

                  {/* TRANSLATION */}

                  <div className="flex justify-start">

                    <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 text-gray-800">

                      <p className="text-xs font-semibold text-gray-500">
                        {item.target}
                      </p>

                      <p className="mt-1">
                        {item.translation}
                      </p>

                      {/* LISTEN BUTTON */}

                      <button
                        onClick={() =>
                          speakText(
                            item.translation,
                            item.target
                          )
                        }
                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
                      >
                        🔊 Listen
                      </button>

                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

          {/* ======================================
              INPUT AREA
          ====================================== */}

          <div className="mt-6 border-t border-gray-200 pt-5">

            {/* MICROPHONE BUTTON */}

            <button
              onClick={startListening}
              disabled={
                isListening ||
                loading
              }
              className={`mb-3 flex w-full items-center justify-center gap-3 rounded-xl px-5 py-4 font-bold transition ${
                isListening
                  ? 'animate-pulse cursor-not-allowed bg-red-100 text-red-600 ring-2 ring-red-300'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >

              <span className="text-2xl">
                {isListening
                  ? '🔴'
                  : '🎤'}
              </span>

              <span>
                {isListening
                  ? 'Listening... Speak now'
                  : 'Tap to Speak'}
              </span>

            </button>

            {/* TEXTAREA */}

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              onKeyDown={(e) => {

                if (
                  e.key === 'Enter' &&
                  !e.shiftKey
                ) {
                  e.preventDefault()

                  handleTranslate()
                }

              }}
              rows={3}
              placeholder={`Type something in ${sourceLanguage}...`}
              className="w-full resize-none rounded-xl border border-gray-300 p-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            {/* TRANSLATE BUTTON */}

            <button
              onClick={handleTranslate}
              disabled={
                loading ||
                !message.trim()
              }
              className="mt-3 w-full rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading
                ? '🤖 Translating...'
                : `🗣️ Translate to ${targetLanguage}`}
            </button>

          </div>

        </div>

      </div>

    </main>
  )
}

export default Conversation