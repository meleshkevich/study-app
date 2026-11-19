import { describe, it, expect } from 'vitest'
import kb from '../app/assets/knowledge-base.json'
import { shuffle } from '../app/utils/shuffle'

describe('knowledge base integrity', () => {
  it('has exactly 101 closed questions', () => {
    expect(kb.questions).toHaveLength(101)
  })

  it('has exactly 25 open questions', () => {
    expect(kb.openQuestions).toHaveLength(25)
  })

  it('every closed question has a valid correctAnswer (a, b, or c)', () => {
    for (const q of kb.questions) {
      expect(['a', 'b', 'c']).toContain(q.correctAnswer)
    }
  })

  it('every closed question has exactly three options', () => {
    for (const q of kb.questions) {
      const keys = Object.keys(q.options)
      expect(keys).toHaveLength(3)
      expect(keys).toContain('a')
      expect(keys).toContain('b')
      expect(keys).toContain('c')
    }
  })

  it('no duplicate question IDs', () => {
    const ids = kb.questions.map(q => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every closed question type is select_correct or select_incorrect', () => {
    for (const q of kb.questions) {
      expect(['select_correct', 'select_incorrect']).toContain(q.type)
    }
  })

  it('every open question has modelAnswerCs and explanationCs', () => {
    for (const q of kb.openQuestions) {
      expect(q.modelAnswerCs).toBeTruthy()
      expect(q.explanationCs).toBeTruthy()
    }
  })
})

describe('shuffle', () => {
  it('returns the same number of items', () => {
    const input = Array.from({ length: 25 }, (_, i) => `q${i}`)
    expect(shuffle(input)).toHaveLength(25)
  })

  it('is a permutation — no items added or dropped', () => {
    const input = Array.from({ length: 25 }, (_, i) => `q${i}`)
    const result = shuffle(input)
    expect(new Set(result)).toEqual(new Set(input))
  })

  it('does not mutate the original array', () => {
    const input = ['a', 'b', 'c', 'd', 'e']
    const copy = [...input]
    shuffle(input)
    expect(input).toEqual(copy)
  })

  it('produces different orderings over many runs (not stuck)', () => {
    const input = Array.from({ length: 10 }, (_, i) => i)
    const first = shuffle(input).join(',')
    let different = false
    for (let i = 0; i < 100; i++) {
      if (shuffle(input).join(',') !== first) { different = true; break }
    }
    expect(different).toBe(true)
  })
})
