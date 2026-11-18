export interface OptionAssessment {
  verdict: 'true' | 'false' | 'qualified'
  explanationCs: string
  correctedStatementCs: string | null
}

export interface Question {
  id: string
  type: 'select_correct' | 'select_incorrect'
  topic: string
  question: string
  options: { a: string; b: string; c: string }
  correctAnswer: 'a' | 'b' | 'c'
  explanationCs: string
  optionAssessments: { a: OptionAssessment; b: OptionAssessment; c: OptionAssessment }
  scoringMode: string
  needsClarification: boolean
}

export interface OpenQuestion {
  id: string
  type: 'open_text'
  topic: string
  question: string
  modelAnswerCs: string
  acceptedAlternativesCs?: string[]
  explanationCs: string
  expectedElementsCs?: string[]
  evaluationMode: string
  verificationNoteCs?: string | null
}

export interface KnowledgeBase {
  schemaVersion: string
  questions: Question[]
  openQuestions: OpenQuestion[]
}
