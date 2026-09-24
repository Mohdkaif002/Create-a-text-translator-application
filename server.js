import dns from 'node:dns'

dns.setServers([
  '8.8.8.8',
  '1.1.1.1',
])

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { GoogleGenAI } from '@google/genai'
import bcrypt from 'bcryptjs'
import User from './models/User.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// ==========================================
// MONGODB CONNECTION
// ==========================================

const mongoURI = process.env.MONGODB_URI

if (!mongoURI) {
  console.error(
    '❌ MONGODB_URI is missing in backend/.env'
  )
} else {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log(
        '✅ MongoDB connected successfully'
      )
    })
    .catch((error) => {
      console.error(
        '❌ MongoDB connection failed:',
        error.message
      )
    })
}

// ==========================================
// GEMINI AI SETUP
// ==========================================

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  console.error(
    '❌ GEMINI_API_KEY is missing in backend/.env'
  )
}

const ai = new GoogleGenAI({
  apiKey: apiKey,
})

// ==========================================
// USER SIGNUP
// ==========================================

app.post('/api/signup', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body

    console.log('📝 Signup Request:', {
      name,
      email,
    })

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password
    ) {
      return res.status(400).json({
        error:
          'Name, email and password are required.',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        error:
          'Password must be at least 6 characters.',
      })
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    })

    if (existingUser) {
      return res.status(409).json({
        error:
          'An account with this email already exists.',
      })
    }

    const hashedPassword =
      await bcrypt.hash(password, 10)

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    })

    console.log(
      '✅ User created:',
      user.email
    )

    res.status(201).json({
      message: 'Account created successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('❌ Signup Error:')
    console.error(error)

    res.status(500).json({
      error:
        error?.message ||
        'Signup failed.',
    })
  }
})

// ==========================================
// USER LOGIN
// ==========================================

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body

    console.log('🔐 Login Request:', email)

    if (!email?.trim() || !password) {
      return res.status(400).json({
        error: 'Email and password are required.',
      })
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    })

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password.',
      })
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      )

    if (!isPasswordCorrect) {
      return res.status(401).json({
        error: 'Invalid email or password.',
      })
    }

    console.log(
      '✅ Login successful:',
      user.email
    )

    res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('❌ Login Error:', error)

    res.status(500).json({
      error:
        error?.message ||
        'Login failed.',
    })
  }
})

// ==========================================
// HOME / SERVER CHECK
// ==========================================

app.get('/', (req, res) => {
  res.json({
    message: 'TranslateHub AI Backend is running!',
  })
})

// ==========================================
// AI ASSISTANT
// ==========================================

app.post('/api/ai', async (req, res) => {
  try {
    const {
      text,
      mode,
      targetLanguage,
    } = req.body

    console.log('📩 AI Request:', {
      mode,
      targetLanguage,
      textLength: text?.length || 0,
    })

    if (!text?.trim()) {
      return res.status(400).json({
        error: 'Text is required.',
      })
    }

    const prompts = {
      grammar: `Correct the grammar of the following text.

Return only the corrected text.
Do not add explanations.

Text:
${text}`,

      rewrite: `Rewrite the following text in a clear, professional and natural way.

Return only the rewritten text.
Do not add explanations.

Text:
${text}`,

      summary: `Summarize the following text in simple and clear language.

Return only the summary.

Text:
${text}`,

      explain: `Explain the following text in simple language so that a beginner can understand it.

Text:
${text}`,

      translate: `Translate the following text into ${targetLanguage}.

Important instructions:
- Return only the translated text.
- Do not provide explanations.
- Preserve the original meaning.
- Do not add extra information.
- Use natural and grammatically correct ${targetLanguage}.
- If the target language uses a different writing script, use its standard script.

Text:
${text}`,
    }

    const prompt =
      prompts[mode] || prompts.grammar

    const response =
      await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: prompt,
      })

    const result = response.text

    console.log(
      '✅ Gemini Response received'
    )

    res.json({
      result,
    })
  } catch (error) {
    console.error('❌ Gemini Error:')
    console.error(error)

    res.status(500).json({
      error:
        error?.message ||
        'Gemini request failed.',
    })
  }
})

// ==========================================
// AI VOCABULARY BUILDER
// ==========================================

app.post('/api/vocabulary', async (req, res) => {
  try {
    const {
      text,
      targetLanguage = 'Hindi',
    } = req.body

    console.log('📚 Vocabulary Request:', {
      targetLanguage,
      textLength: text?.length || 0,
    })

    if (!text?.trim()) {
      return res.status(400).json({
        error: 'Text is required.',
      })
    }

    const prompt = `
You are an English vocabulary learning assistant.

Analyze the following text and extract 5 to 10 useful English vocabulary words.

Choose meaningful words that are useful for students and English learners.

Do not include very basic words such as:
"the", "is", "and", "this", "that", "you", "I", etc.

For every word provide:

1. word
2. meaning in ${targetLanguage}
3. simple English definition
4. one synonym
5. one example sentence

Return ONLY valid JSON.

The JSON must have exactly this structure:

{
  "words": [
    {
      "word": "example",
      "meaning": "उदाहरण",
      "definition": "Something used to explain or show an idea.",
      "synonym": "sample",
      "example": "This is a good example of teamwork."
    }
  ]
}

Do not use markdown.
Do not use code fences.
Do not add any explanation outside the JSON.

Text:
${text}
`

    const response =
      await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: prompt,
      })

    let result = response.text.trim()

    result = result
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    let vocabulary

    try {
      vocabulary = JSON.parse(result)
    } catch (parseError) {
      console.error(
        '❌ Vocabulary JSON Parse Error:',
        parseError
      )

      return res.status(500).json({
        error:
          'AI returned an invalid vocabulary format.',
      })
    }

    if (
      !vocabulary.words ||
      !Array.isArray(vocabulary.words)
    ) {
      return res.status(500).json({
        error:
          'Invalid vocabulary response.',
      })
    }

    console.log(
      `✅ ${vocabulary.words.length} vocabulary words generated`
    )

    res.json({
      words: vocabulary.words,
    })
  } catch (error) {
    console.error(
      '❌ Vocabulary AI Error:'
    )

    console.error(error)

    res.status(500).json({
      error:
        error?.message ||
        'Vocabulary generation failed.',
    })
  }
})

// ==========================================
// AI QUIZ GENERATOR
// ==========================================

app.post('/api/quiz', async (req, res) => {
  try {
    const { text } = req.body

    console.log('🧪 Quiz Request:', {
      textLength: text?.length || 0,
    })

    if (!text?.trim()) {
      return res.status(400).json({
        error: 'Please provide some text.',
      })
    }

    const prompt = `
Create a quiz from the following English text.

Generate exactly 5 multiple-choice questions.

For each question provide:

1. question
2. exactly 4 options
3. correctAnswer
4. explanation

Important:
- correctAnswer must be exactly the same text as one of the four options.
- Questions must be based only on the provided English text.
- Make the questions clear and suitable for students.
- Each question should have only one correct answer.

Return ONLY valid JSON.

Use exactly this structure:

{
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
      ],
      "correctAnswer": "Option 1",
      "explanation": "Short explanation"
    }
  ]
}

Do not use markdown.
Do not use code fences.
Do not add any explanation outside the JSON.

English text:
${text}
`

    const response =
      await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: prompt,
      })

    let responseText =
      response.text.trim()

    responseText = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    let quizData

    try {
      quizData = JSON.parse(responseText)
    } catch (parseError) {
      console.error(
        '❌ Quiz JSON Parse Error:',
        parseError
      )

      console.error(
        'Gemini Response:',
        responseText
      )

      return res.status(500).json({
        error:
          'AI returned an invalid quiz format.',
      })
    }

    if (
      !quizData.questions ||
      !Array.isArray(quizData.questions)
    ) {
      return res.status(500).json({
        error:
          'Invalid quiz response.',
      })
    }

    if (quizData.questions.length !== 5) {
      return res.status(500).json({
        error:
          'AI did not generate exactly 5 questions.',
      })
    }

    for (const question of quizData.questions) {
      if (
        !question.question ||
        !Array.isArray(question.options) ||
        question.options.length !== 4 ||
        !question.correctAnswer ||
        !question.explanation
      ) {
        return res.status(500).json({
          error:
            'AI returned an incomplete quiz question.',
        })
      }

      if (
        !question.options.includes(
          question.correctAnswer
        )
      ) {
        return res.status(500).json({
          error:
            'Quiz correct answer does not match any option.',
        })
      }
    }

    console.log(
      '✅ Quiz generated successfully'
    )

    res.json({
      questions: quizData.questions,
    })
  } catch (error) {
    console.error('❌ Quiz Error:')
    console.error(error)

    res.status(500).json({
      error:
        error?.message ||
        'Failed to generate quiz.',
    })
  }
})

// ==========================================
// START SERVER
// ==========================================

app.listen(5000, () => {
  console.log(
    '🚀 AI Backend running on http://localhost:5000'
  )
})