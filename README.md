# Premind AI 📚✨

**Turn any textbook, lecture note, or PDF into exam-ready knowledge — in minutes.**

> Study Material → Understand → Remember → Practice → Master

---

## 🎯 Problem Statement

Students today are drowning in study material — bulky textbooks, scattered lecture notes, hundreds of slides — but have very little time to figure out what actually matters, understand it, memorize it, and test themselves before an exam.

There is no single tool that takes a raw document and walks a student all the way from **"I have 80 pages of notes"** to **"I've reviewed the key concepts, memorized the formulas, and tested myself with a quiz."**

## 💡 Solution

**Premind AI** is an AI-powered study material transformation platform. Students upload their raw learning material (PDF, PPT, DOCX, or notes) and the platform automatically generates a complete, structured study workspace:

- Multi-level summaries (quick, detailed, exam-cram, chapter-wise)
- Extracted key points and important concepts
- Extracted formulas with variable breakdowns
- An auto-generated glossary of terms and definitions
- Interactive flashcards
- Difficulty-based quizzes (MCQ, True/False, Fill-in-the-Blank, Short Answer)
- One-click export to PDF, Markdown, or print

This is **not** "just a PDF summarizer" — it's a continuous learning workspace that takes a student from raw content to exam confidence.

---

## ✨ Key Features (Phase 1)

| Feature | Description |
|---|---|
| 🔐 Authentication | Sign up, login, forgot password, Google login (integration-ready) |
| 📤 Smart Upload | Drag-and-drop upload for PDF, PPT, PPTX, DOC, DOCX, and notes |
| 📝 Multi-Level Summaries | Quick Summary, Detailed Summary, Exam Cram Notes, Chapter-wise Summary |
| 🎯 Key Points Extraction | Important concepts, key takeaways, highlighted topics |
| 🧮 Formula Extraction | Formula cards with variables, explanations, and topic tags |
| 📖 Glossary Generator | Searchable definitions, terminology, and keyword dictionary |
| 🃏 Flashcards | Auto-generated, flippable, topic-wise Q&A flashcards |
| ❓ Quiz Generator | MCQ, True/False, Fill-in-the-Blank, and Short Answer questions |
| 🎚️ Difficulty Selector | Easy / Medium / Hard quiz modes |
| 📤 Export | Download as PDF, Markdown, or print-friendly notes |
| 📊 Dashboard | Recent materials, quick actions, simple study stats |

> **Note:** Advanced features — adaptive learning, spaced repetition, weak-topic detection, AI tutor chat, analytics, gamification — are planned for future phases (see [Roadmap](#-future-roadmap)).

---

## 🔄 Core User Flow

```
Landing Page
      ↓
Sign Up / Login
      ↓
Dashboard
      ↓
Upload Study Material (PDF / PPT / DOCX / Notes)
      ↓
AI Processing Screen
      ↓
Study Material Workspace
      ├── Quick Summary
      ├── Detailed Summary
      ├── Exam Cram
      ├── Chapter Summary
      ├── Key Points
      ├── Formulas
      ├── Glossary
      ├── Flashcards
      ├── Quiz
      └── Export
      ↓
Study / Practice
      ↓
Quiz Result
      ↓
Export / Continue Studying
```

---

## 🖥️ Screens / Pages

1. Landing Page
2. Login
3. Sign Up
4. Forgot Password
5. Dashboard
6. Upload Material
7. AI Processing Screen
8. Study Material / Summary Workspace
9. Key Points
10. Formulas
11. Glossary
12. Flashcards
13. Quiz Setup (Difficulty Selector)
14. Quiz
15. Quiz Results
16. Export / Print View

---

## 🛠️ Technology Stack

- **React** (with TypeScript)
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for icons
- **Recharts** for simple study statistics

---

## 🏗️ Project Architecture

The frontend is built to be **API-ready from day one** — all data currently comes from a mock data layer that mirrors the exact shape of the future backend/AI response, so swapping mock data for real API calls requires no UI rewrites.

```
src/
├── components/     # Reusable UI building blocks
├── pages/          # Route-level page components
├── layouts/        # Shared layout wrappers (auth layout, app shell)
├── services/       # API service functions (currently backed by mock data)
├── data/           # Mock data for development
├── hooks/          # Custom React hooks
├── context/        # Auth/session and global app context
├── types/          # TypeScript types/interfaces
├── utils/          # Helper functions
└── routes/         # Route definitions
```

### Component Library

```
Navbar · Sidebar · Button · Input · Modal · Card · StatCard
FileUpload · FileCard · ProcessingSteps
SummaryCard · SummaryTabs · KeyPointCard · FormulaCard · GlossaryCard
Flashcard · QuizQuestion · DifficultySelector · QuizProgress · QuizResult
ExportMenu · LoadingState · EmptyState · ErrorState
```

---

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/studyforge-ai.git
cd studyforge-ai

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

> During Phase 1 development, these are placeholders — the app runs entirely on mock data until backend/API integration begins.

## ▶️ Running the Project

```bash
npm run dev       # Start local dev server
npm run build      # Production build
npm run preview    # Preview production build
```

---

## 🗺️ Future Roadmap

- [ ] Adaptive learning engine
- [ ] Spaced repetition algorithm for flashcards
- [ ] Weak-topic detection
- [ ] Personalized revision plans
- [ ] Exam readiness score
- [ ] AI tutor / chat assistant
- [ ] Study analytics dashboard
- [ ] Gamification (streaks, badges, leaderboards)
- [ ] Teacher/mentor dashboard
- [ ] Real backend + AI integration (Gemini/Claude API, RAG pipeline)

**Current focus:** Phase 1 — a polished, fully functional, responsive, API-ready frontend for the core study workflow (upload → summarize → remember → practice).

---

## 🏆 Hackathon Challenge Mapping (PS-03)

| Challenge Requirement | Our Implementation |
|---|---|
| Multi-level summarization | Quick Summary + Detailed Summary + Exam Cram + Chapter Summary |
| Interactive flashcards | AI-generated interactive Q&A flashcards |
| Spaced repetition preview | UI-ready flashcard review flow; algorithm added in a future phase |
| Formula extraction | Dedicated Formula/Equation section with variable breakdowns |
| Definition glossary | Definitions + terminology + keyword dictionary |
| Self-assessment | AI-generated difficulty-based quizzes |
| Upload portal | PDF/PPT/DOCX/Notes upload with drag-and-drop |
| Exportable material | PDF + Markdown + Print export |

---

## 👥 Team / Contributors

| Name | Role |
|---|---|
| _Add name_ | Frontend Lead |
| _Add name_ | UI/UX Design |
| _Add name_ | Backend/AI Integration |
| _Add name_ | Presentation / Pitch |

---

## 📌 Note on Project Phasing

This project is being built in phases. **Phase 1** delivers a complete, polished, production-quality frontend for the core study-material workflow, with API-ready architecture and realistic mock data. Backend/AI integration and advanced intelligence features (adaptive learning, spaced repetition, AI tutor, analytics) are planned for subsequent phases.
