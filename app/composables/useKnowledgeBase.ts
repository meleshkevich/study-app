import type { KnowledgeBase, Question, OpenQuestion } from '~/types/knowledgeBase'
import data from '~/assets/knowledge-base.json'

const kb = data as KnowledgeBase

export function useKnowledgeBase() {
  const questions: Question[] = kb.questions
  const openQuestions: OpenQuestion[] = kb.openQuestions
  return { questions, openQuestions }
}
