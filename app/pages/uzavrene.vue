<script setup lang="ts">
import type { Question } from '~/types/knowledgeBase'
import { shuffle } from '~/utils/shuffle'
useHead({ title: 'Uzavřené otázky' })

const { questions } = useKnowledgeBase()

type OptionKey = 'a' | 'b' | 'c'

const shuffledIds = ref<string[]>([])
const currentIndex = ref(0)
const selectedOption = ref<OptionKey | null>(null)
const showFeedback = ref(false)
const expandedAssessment = ref<OptionKey | null>(null)
const sessionDone = ref(false)

function startSession() {
  shuffledIds.value = shuffle(questions.map(q => q.id))
  currentIndex.value = 0
  selectedOption.value = null
  showFeedback.value = false
  expandedAssessment.value = null
  sessionDone.value = false
}

onMounted(startSession)

const currentQuestion = computed<Question | undefined>(() =>
  questions.find(q => q.id === shuffledIds.value[currentIndex.value])
)

const isCorrect = computed(() =>
  currentQuestion.value && selectedOption.value === currentQuestion.value.correctAnswer
)

function checkAnswer() {
  if (!selectedOption.value) return
  showFeedback.value = true
}

function nextQuestion() {
  if (currentIndex.value + 1 >= shuffledIds.value.length) {
    sessionDone.value = true
  } else {
    currentIndex.value++
    selectedOption.value = null
    showFeedback.value = false
    expandedAssessment.value = null
  }
}

function toggleAssessment(key: OptionKey) {
  expandedAssessment.value = expandedAssessment.value === key ? null : key
}

const optionKeys: OptionKey[] = ['a', 'b', 'c']

const optionClass = (key: OptionKey) => {
  if (!showFeedback.value) {
    return selectedOption.value === key
      ? 'border-teal-500 bg-teal-50 text-slate-800'
      : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50/40'
  }
  const q = currentQuestion.value!
  if (key === q.correctAnswer) return 'border-green-500 bg-green-50 text-green-900'
  if (key === selectedOption.value) return 'border-red-400 bg-red-50 text-red-900'
  return 'border-slate-200 bg-white text-slate-400'
}
</script>

<template>
  <div class="max-w-lg mx-auto px-4 py-6">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/" aria-label="Zpět na úvodní stránku" class="text-slate-400 hover:text-slate-600 transition-colors">
        <svg class="w-6 h-6" aria-hidden="true" focusable="false" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <h1 class="text-lg font-semibold text-slate-800">Uzavřené otázky</h1>
      <span v-if="!sessionDone" class="ml-auto text-sm text-slate-400">
        {{ currentIndex + 1 }} / {{ shuffledIds.length }}
      </span>
    </div>

    <!-- Session done -->
    <div v-if="sessionDone" class="text-center py-12 flex flex-col items-center gap-6">
      <div class="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
        <svg class="w-9 h-9 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <p class="text-xl font-bold text-slate-800">Všechny otázky hotovy!</p>
        <p class="text-slate-500 mt-1">Prošel/a jsi všech {{ questions.length }} otázek.</p>
      </div>
      <button
        @click="startSession"
        class="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
      >
        Začít znovu
      </button>
    </div>

    <!-- Question card -->
    <div v-else-if="currentQuestion">
      <!-- Topic chip -->
      <span class="inline-block text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full mb-3">
        {{ currentQuestion.topic }}
      </span>

      <!-- Question text -->
      <p class="text-slate-800 font-semibold text-lg leading-snug mb-5">
        {{ currentQuestion.question }}
      </p>

      <!-- Options -->
      <div class="flex flex-col gap-3 mb-5" role="radiogroup" aria-label="Možnosti odpovědí">
        <button
          v-for="key in optionKeys"
          :key="key"
          :disabled="showFeedback"
          @click="selectedOption = key"
          role="radio"
          :aria-checked="selectedOption === key"
          :class="[
            'flex items-start gap-3 w-full text-left border-2 rounded-xl px-4 py-3.5 transition-colors',
            optionClass(key)
          ]"
        >
          <span class="mt-0.5 w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center text-xs font-bold"
            :class="[
              !showFeedback
                ? selectedOption === key ? 'border-teal-500 bg-teal-500 text-white' : 'border-current'
                : key === currentQuestion.correctAnswer ? 'border-green-500 bg-green-500 text-white'
                  : key === selectedOption ? 'border-red-400 bg-red-400 text-white'
                  : 'border-slate-300 text-slate-300'
            ]"
          >{{ key }}</span>
          <span class="text-sm leading-relaxed">{{ currentQuestion.options[key] }}</span>
        </button>
      </div>

      <!-- Feedback -->
      <div v-if="showFeedback" class="mb-5">
        <div
          role="status"
          aria-live="polite"
          :class="[
            'rounded-xl px-4 py-3 mb-4 font-semibold text-base',
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-700'
          ]"
        >
          {{ isCorrect ? 'Správně!' : 'Nesprávně' }}
        </div>

        <div class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Správná odpověď</p>
          <p class="text-slate-800 text-sm font-medium">
            {{ currentQuestion.correctAnswer.toUpperCase() }}) {{ currentQuestion.options[currentQuestion.correctAnswer] }}
          </p>
          <p class="text-slate-600 text-sm mt-2">{{ currentQuestion.explanationCs }}</p>
        </div>

        <!-- Per-option assessments -->
        <div class="flex flex-col gap-2">
          <button
            v-for="key in optionKeys"
            :key="key"
            @click="toggleAssessment(key)"
            :aria-expanded="expandedAssessment === key"
            :aria-controls="'assessment-' + key"
            class="w-full flex items-center justify-between text-left bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <span class="font-medium">Vysvětlení {{ key }})</span>
            <svg
              :class="['w-4 h-4 transition-transform', expandedAssessment === key ? 'rotate-180' : '']"
              aria-hidden="true"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            v-for="key in optionKeys"
            :key="key"
            :id="'assessment-' + key"
            v-show="expandedAssessment === key"
            class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mt-1 text-sm text-slate-600"
          >
            <p>{{ currentQuestion.optionAssessments[key].explanationCs }}</p>
            <template v-if="currentQuestion.optionAssessments[key].correctedStatementCs">
              <p class="mt-2 text-xs font-semibold text-teal-700 uppercase tracking-wide">Správné znění:</p>
              <p class="mt-0.5 italic text-slate-700">
                {{ currentQuestion.optionAssessments[key].correctedStatementCs }}
              </p>
            </template>
          </div>
        </div>
      </div>

      <!-- Action button -->
      <div class="mt-2">
        <button
          v-if="!showFeedback"
          :disabled="!selectedOption"
          @click="checkAnswer"
          class="w-full py-3.5 rounded-xl font-semibold text-base transition-colors"
          :class="selectedOption
            ? 'bg-teal-600 hover:bg-teal-700 text-white'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'"
        >
          Zkontrolovat odpověď
        </button>
        <button
          v-else
          @click="nextQuestion"
          class="w-full py-3.5 rounded-xl font-semibold text-base bg-teal-600 hover:bg-teal-700 text-white transition-colors"
        >
          Další otázka
        </button>
      </div>
    </div>
  </div>
</template>
