<script setup lang="ts">
useHead({ title: 'Procvičování' })
</script>

<template>
  <div class="max-w-lg mx-auto px-4 py-12 flex flex-col items-center gap-8">
    <div class="text-center">
      <div class="w-14 h-14 mx-auto mb-4 bg-teal-600 rounded-2xl flex items-center justify-center">
        <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zm0 0v8.25M9 3.75C7.343 3.75 6 5.093 6 6.75v10.5A2.25 2.25 0 008.25 19.5h7.5A2.25 2.25 0 0018 17.25V6.75C18 5.093 16.657 3.75 15 3.75H9z" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-slate-800 leading-tight">Zubní lékařství testy</h1>
      <p class="mt-2 text-slate-500 text-base">Procvičování otázek ke zkoušce</p>
    </div>

    <div class="w-full flex flex-col gap-4">
      <NuxtLink
        to="/uzavrene"
        class="block w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-center rounded-2xl py-5 px-6 font-semibold text-lg shadow-sm transition-colors"
      >
        Uzavřené otázky
        <span class="block text-sm font-normal text-teal-100 mt-0.5">25 otázek · výběr ze tří možností</span>
      </NuxtLink>

      <NuxtLink
        to="/otevrene"
        class="block w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 text-center rounded-2xl py-5 px-6 font-semibold text-lg border border-slate-200 shadow-sm transition-colors"
      >
        Otevřené otázky
        <span class="block text-sm font-normal text-slate-400 mt-0.5">5 otázek · vlastní odpověď</span>
      </NuxtLink>
    </div>
  </div>
</template>
