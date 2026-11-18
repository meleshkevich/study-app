<script setup lang="ts">
import type { OpenQuestion } from '~/types/knowledgeBase'
import { shuffle } from '~/utils/shuffle'
useHead({ title: 'Otevřené otázky' })

const { openQuestions } = useKnowledgeBase()

const shuffledIds = ref<string[]>([])
const currentIndex = ref(0)
const userAnswer = ref('')
const showAnswer = ref(false)
const sessionDone = ref(false)

function startSession() {
  shuffledIds.value = shuffle(openQuestions.map(q => q.id))
  currentIndex.value = 0
  userAnswer.value = ''
  showAnswer.value = false
  sessionDone.value = false
}

onMounted(startSession)

const currentQuestion = computed<OpenQuestion | undefined>(() =>
  openQuestions.find(q => q.id === shuffledIds.value[currentIndex.value])
)

function revealAnswer() {
  showAnswer.value = true
}

function nextQuestion() {
  if (currentIndex.value + 1 >= shuffledIds.value.length) {
    sessionDone.value = true
  } else {
    currentIndex.value++
    userAnswer.value = ''
    showAnswer.value = false
  }
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
      <h1 class="text-lg font-semibold text-slate-800">Otevřené otázky</h1>
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
        <p class="text-slate-500 mt-1">Prošel/a jsi všech 5 otázek.</p>
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

      <!-- Answer textarea -->
      <div class="mb-5">
        <label for="user-answer" class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Vaše odpověď
        </label>
        <textarea
          id="user-answer"
          v-model="userAnswer"
          :disabled="showAnswer"
          rows="4"
          placeholder="Napište svou odpověď..."
          class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition disabled:bg-slate-50 disabled:text-slate-500"
        />
      </div>

      <!-- Reference answer -->
      <div v-if="showAnswer" class="flex flex-col gap-3 mb-5">
        <div class="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3">
          <p class="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-1.5">Vzorová odpověď</p>
          <p class="text-slate-800 text-sm font-medium leading-relaxed">{{ currentQuestion.modelAnswerCs }}</p>
        </div>

        <div class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Vysvětlení</p>
          <p class="text-slate-700 text-sm leading-relaxed">{{ currentQuestion.explanationCs }}</p>
        </div>

        <div
          v-if="currentQuestion.acceptedAlternativesCs && currentQuestion.acceptedAlternativesCs.length"
          class="bg-white border border-slate-200 rounded-xl px-4 py-3"
        >
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Přijatelné alternativy</p>
          <ul class="list-disc list-inside text-sm text-slate-600 flex flex-col gap-1">
            <li v-for="alt in currentQuestion.acceptedAlternativesCs" :key="alt">{{ alt }}</li>
          </ul>
        </div>

        <div
          v-if="currentQuestion.verificationNoteCs"
          class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
        >
          <p class="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Poznámka</p>
          <p class="text-amber-800 text-sm leading-relaxed">{{ currentQuestion.verificationNoteCs }}</p>
        </div>
      </div>

      <!-- Action button -->
      <div class="mt-2">
        <button
          v-if="!showAnswer"
          @click="revealAnswer"
          class="w-full py-3.5 rounded-xl font-semibold text-base bg-teal-600 hover:bg-teal-700 text-white transition-colors"
        >
          Zobrazit správnou odpověď
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
