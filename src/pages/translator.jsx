import { useEffect, useRef, useState } from 'react'
import { createWorker } from 'tesseract.js'

function Translator() {
  const [text, setText] = useState('')
  const [language, setLanguage] = useState('hi')
  const [translatedText, setTranslatedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Camera states
  const [cameraOpen, setCameraOpen] = useState(false)
  const [capturedImage, setCapturedImage] = useState('')

  // Camera references
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  // =========================
  // SAVE TRANSLATION HISTORY
  // =========================

  const saveToHistory = (translation) => {
    const newHistory = {
      id: Date.now(),
      type: 'translator',

      input: text,
      result: translation,

      targetLanguage: language,

      date: new Date().toISOString(),
    }

    const oldHistory = JSON.parse(
      localStorage.getItem('translationHistory') || '[]'
    )

    const updatedHistory = [
      newHistory,
      ...oldHistory,
    ].slice(0, 100)

    localStorage.setItem(
      'translationHistory',
      JSON.stringify(updatedHistory)
    )
  }

  // =========================
  // OPEN CAMERA
  // =========================

  const openCamera = async () => {
    setError('')

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError(
          'Camera is not supported by this browser.'
        )
        return
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
          },
          audio: false,
        })

      streamRef.current = stream
      setCameraOpen(true)

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      }, 100)
    } catch (err) {
      console.error(err)

      if (err.name === 'NotAllowedError') {
        setError(
          'Camera permission was denied. Please allow camera access.'
        )
      } else {
        setError(
          'Unable to access the camera. Please check your camera.'
        )
      }
    }
  }

  // =========================
  // STOP CAMERA
  // =========================

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop())

      streamRef.current = null
    }

    setCameraOpen(false)
  }

  // =========================
  // CAPTURE PHOTO
  // =========================

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    if (!video.videoWidth || !video.videoHeight) {
      setError(
        'Camera is not ready yet. Please wait a moment and try again.'
      )
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    )

    const imageData = canvas.toDataURL(
      'image/jpeg',
      0.9
    )

    setCapturedImage(imageData)

    stopCamera()
  }

  // =========================
  // RETAKE PHOTO
  // =========================

  const retakePhoto = async () => {
    setCapturedImage('')
    await openCamera()
  }

  // =========================
  // OCR
  // =========================

  const usePhoto = async () => {
    if (!capturedImage) return

    setOcrLoading(true)
    setError('')
    setText('')
    setTranslatedText('')

    try {
      const worker = await createWorker('eng')

      const result = await worker.recognize(
        capturedImage
      )

      const detectedText =
        result?.data?.text?.trim() || ''

      await worker.terminate()

      if (!detectedText) {
        setError(
          'No text was detected in the photo. Please take a clearer photo.'
        )
        return
      }

      setText(detectedText)

      setError(
        'Text detected successfully! You can now translate it.'
      )
    } catch (err) {
      console.error(err)

      setError(
        'OCR failed. Please try taking a clearer photo.'
      )
    } finally {
      setOcrLoading(false)
    }
  }

  // =========================
  // CLOSE CAMERA
  // =========================

  const closeCamera = () => {
    stopCamera()
  }

  // =========================
  // CLEANUP CAMERA
  // =========================

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop())
      }
    }
  }, [])

  // =========================
  // TRANSLATION
  // =========================

  const translateText = async () => {
    if (!text.trim()) {
      setError(
        'Please enter some text to translate.'
      )
      return
    }

    setLoading(true)
    setError('')
    setTranslatedText('')
    setCopied(false)

    try {
      const apiKey =
        import.meta.env.VITE_RAPIDAPI_KEY

      // =========================
      // RAPIDAPI TRANSLATION
      // =========================

      if (apiKey) {
        const response = await fetch(
          'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',

              'x-rapidapi-host':
                'google-translate113.p.rapidapi.com',

              'x-rapidapi-key': apiKey,
            },

            body: JSON.stringify({
              from: 'en',
              to: language,
              text: text,
            }),
          }
        )

        const data = await response.json()

        if (response.ok && data?.trans) {
          setTranslatedText(data.trans)

          saveToHistory(data.trans)

          return
        }
      }

      // =========================
      // FALLBACK TRANSLATION
      // =========================

      const fallbackResponse = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=en|${language}`
      )

      const fallbackData =
        await fallbackResponse.json()

      const translatedValue =
        fallbackData?.responseData?.translatedText

      if (translatedValue) {
        setTranslatedText(translatedValue)

        saveToHistory(translatedValue)
      } else {
        setError(
          'Translation failed. Please try again.'
        )
      }
    } catch (err) {
      console.error(err)

      setError(
        'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // CLEAR
  // =========================

  const clearText = () => {
    setText('')
    setTranslatedText('')
    setError('')
    setCopied(false)
    setCapturedImage('')
  }

  // =========================
  // COPY TRANSLATION
  // =========================

  const copyTranslation = async () => {
    if (!translatedText) return

    try {
      await navigator.clipboard.writeText(
        translatedText
      )

      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-10 sm:px-6">

      <div className="mx-auto max-w-6xl">

        {/* =========================
            PAGE HEADING
        ========================= */}

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold text-blue-600">
            Text Translator
          </h1>

          <p className="mt-3 text-gray-600">
            Translate English text into your favourite
            language
          </p>

        </div>

        {/* =========================
            MAIN CARD
        ========================= */}

        <div className="rounded-3xl bg-white p-5 shadow-xl sm:p-8">

          {/* =========================
              CAMERA SECTION
          ========================= */}

          <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-lg font-bold text-gray-800">
                  📷 Camera Translator
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Capture an image and extract text
                  automatically.
                </p>

              </div>

              {!cameraOpen &&
                !capturedImage && (
                  <button
                    onClick={openCamera}
                    className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
                  >
                    📷 Open Camera
                  </button>
                )}

            </div>

            {/* =========================
                CAMERA PREVIEW
            ========================= */}

            {cameraOpen && (
              <div className="mt-5">

                <div className="overflow-hidden rounded-2xl bg-black">

                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-auto max-h-[500px] w-full object-cover"
                  />

                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-3">

                  <button
                    onClick={capturePhoto}
                    className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                  >
                    📸 Capture Photo
                  </button>

                  <button
                    onClick={closeCamera}
                    className="rounded-xl bg-gray-600 px-6 py-3 font-semibold text-white transition hover:bg-gray-700"
                  >
                    ✕ Close Camera
                  </button>

                </div>

              </div>
            )}

            {/* =========================
                CAPTURED IMAGE
            ========================= */}

            {capturedImage &&
              !cameraOpen && (
                <div className="mt-5">

                  <p className="mb-3 font-semibold text-gray-700">
                    Captured Photo
                  </p>

                  <div className="overflow-hidden rounded-2xl border bg-gray-100">

                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="max-h-[500px] w-full object-contain"
                    />

                  </div>

                  <div className="mt-4 flex flex-wrap justify-center gap-3">

                    {/* RETAKE */}

                    <button
                      onClick={retakePhoto}
                      disabled={ocrLoading}
                      className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:bg-orange-300"
                    >
                      🔄 Retake
                    </button>

                    {/* USE PHOTO */}

                    <button
                      onClick={usePhoto}
                      disabled={ocrLoading}
                      className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
                    >
                      {ocrLoading
                        ? '🔍 Reading Text...'
                        : '✅ Use Photo'}
                    </button>

                    {/* REMOVE */}

                    <button
                      onClick={() =>
                        setCapturedImage('')
                      }
                      disabled={ocrLoading}
                      className="rounded-xl bg-gray-500 px-6 py-3 font-semibold text-white transition hover:bg-gray-600"
                    >
                      ✕ Remove
                    </button>

                  </div>

                </div>
              )}

          </div>

          {/* Hidden Canvas */}

          <canvas
            ref={canvasRef}
            className="hidden"
          />

          {/* =========================
              MESSAGE
          ========================= */}

          {error && (
            <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-700">
              {error}
            </div>
          )}

          {/* =========================
              TRANSLATOR
          ========================= */}

          <div className="grid gap-6 md:grid-cols-2">

            {/* =========================
                ENGLISH INPUT
            ========================= */}

            <div>

              <div className="mb-3 flex items-center justify-between">

                <label className="font-semibold text-gray-700">
                  English
                </label>

                <span className="text-sm text-gray-500">
                  {text.length} characters
                </span>

              </div>

              <textarea
                value={text}
                onChange={(e) =>
                  setText(e.target.value)
                }
                rows="10"
                placeholder="Enter English text here or scan text using camera..."
                className="w-full resize-none rounded-2xl border border-gray-300 p-5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />

              <button
                onClick={clearText}
                className="mt-3 rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
              >
                Clear
              </button>

            </div>

            {/* =========================
                TRANSLATION OUTPUT
            ========================= */}

            <div>

              <label className="mb-3 block font-semibold text-gray-700">
                Translation
              </label>

              <div className="min-h-[250px] rounded-2xl border border-green-200 bg-green-50 p-5">

                {loading ? (

                  <div className="flex min-h-[220px] items-center justify-center">

                    <div className="text-center">

                      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>

                      <p className="mt-4 text-gray-600">
                        Translating...
                      </p>

                    </div>

                  </div>

                ) : translatedText ? (

                  <div className="flex min-h-[220px] flex-col">

                    <p className="whitespace-pre-wrap text-lg text-gray-800">
                      {translatedText}
                    </p>

                    <button
                      onClick={copyTranslation}
                      className="mt-auto self-start rounded-lg bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700"
                    >
                      {copied
                        ? '✓ Copied!'
                        : 'Copy Translation'}
                    </button>

                  </div>

                ) : (

                  <div className="flex min-h-[220px] items-center justify-center text-center text-gray-400">
                    Your translation will appear here.
                  </div>

                )}

              </div>

            </div>

          </div>

          {/* =========================
              LANGUAGE + TRANSLATE
          ========================= */}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">

            <div className="flex-1">

              <label className="mb-2 block font-semibold text-gray-700">
                Translate To
              </label>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="hi">
                  Hindi
                </option>

                <option value="ur">
                  Urdu
                </option>

                <option value="es">
                  Spanish
                </option>

                <option value="fr">
                  French
                </option>

                <option value="de">
                  German
                </option>

                <option value="it">
                  Italian
                </option>

                <option value="pt">
                  Portuguese
                </option>
              </select>

            </div>

            <button
              onClick={translateText}
              disabled={
                loading || ocrLoading
              }
              className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {loading
                ? 'Translating...'
                : 'Translate'}
            </button>

          </div>

        </div>

      </div>

    </main>
  )
}

export default Translator