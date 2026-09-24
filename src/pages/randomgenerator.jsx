/*import { useState, useCallback } from 'react'

const generateRandomString = (length, includeNumbers, includeSymbols) => {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

  if (includeNumbers) {
    characters += '0123456789'
  }

  if (includeSymbols) {
    characters += '!@#$%^&*()_+'
  }

  let result = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }

  return result
}

function RandomGenerator() {
  const [length, setLength] = useState(12)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [randomString, setRandomString] = useState(() =>
    generateRandomString(length, includeNumbers, includeSymbols)
  )

  const generateString = useCallback(() => {
    setRandomString(generateRandomString(length, includeNumbers, includeSymbols))
  }, [length, includeNumbers, includeSymbols])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(randomString)
    alert('String copied!')
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg">

        <h1 className="text-center text-3xl font-bold text-green-600">
          Random String Generator
        </h1>

        <div className="mt-8">
          <label className="font-semibold">
            String Length: {length}
          </label>

          <input
            type="range"
            min="4"
            max="50"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="mt-3 w-full"
          />
        </div>

        <div className="mt-6 space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
            />
            Include Numbers
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
            />
            Include Symbols
          </label>
        </div>

        <div className="mt-8 rounded-lg bg-gray-100 p-4">
          <p className="break-all text-center font-mono text-lg">
            {randomString}
          </p>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={generateString}
            className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
          >
            Generate
          </button>

          <button
            onClick={copyToClipboard}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Copy
          </button>
        </div>

      </div>
    </main>
  )
}

export default <RandomGenerator></RandomGenerator>
*/
import { useState, useCallback } from 'react'

const generateRandomString = (
  length,
  includeUppercase,
  includeLowercase,
  includeNumbers,
  includeSymbols
) => {
  let characters = ''

  if (includeUppercase) {
    characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  }

  if (includeLowercase) {
    characters += 'abcdefghijklmnopqrstuvwxyz'
  }

  if (includeNumbers) {
    characters += '0123456789'
  }

  if (includeSymbols) {
    characters += '!@#$%^&*()_+'
  }

  if (!characters) {
    return ''
  }

  let result = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }

  return result
}

function RandomGenerator() {
  const [length, setLength] = useState(12)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [randomString, setRandomString] = useState(() =>
    generateRandomString(
      12,
      true,
      true,
      true,
      true
    )
  )
  const [copied, setCopied] = useState(false)

  const generateString = useCallback(() => {
    const generated = generateRandomString(
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols
    )

    setRandomString(generated)
    setCopied(false)
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  ])

  const copyToClipboard = async () => {
    if (!randomString) return

    await navigator.clipboard.writeText(randomString)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="text-center text-3xl font-bold text-green-600">
          Random String Generator
        </h1>

        <p className="mt-2 text-center text-gray-600">
          Generate random strings with custom options
        </p>

        {/* Length */}
        <div className="mt-8">
          <div className="flex justify-between">
            <label className="font-semibold">
              String Length
            </label>

            <span className="font-bold text-green-600">
              {length}
            </span>
          </div>

          <input
            type="range"
            min="4"
            max="50"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="mt-3 w-full"
          />
        </div>

        {/* Options */}
        <div className="mt-7 space-y-3">

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) =>
                setIncludeUppercase(e.target.checked)
              }
            />
            Include Uppercase Letters
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) =>
                setIncludeLowercase(e.target.checked)
              }
            />
            Include Lowercase Letters
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) =>
                setIncludeNumbers(e.target.checked)
              }
            />
            Include Numbers
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) =>
                setIncludeSymbols(e.target.checked)
              }
            />
            Include Symbols
          </label>

        </div>

        {/* Generated String */}
        <div className="mt-8 rounded-xl bg-gray-100 p-5">
          <p className="break-all text-center font-mono text-lg">
            {randomString || 'Select at least one option'}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-center gap-4">

          <button
            onClick={generateString}
            className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Generate
          </button>

          <button
            onClick={copyToClipboard}
            disabled={!randomString}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>

        </div>

      </div>
    </main>
  )
}

export default RandomGenerator