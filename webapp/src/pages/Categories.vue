<script setup lang="ts">
defineProps<{
  categories: { id: number; name: string; slug: string }[];
}>();
</script>
<template>
  <div
    class="relative w-full h-1/2 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden"
  >
    <a
      v-for="c in categories"
      :href="'/by-category/' + c.slug"
      :style="{
        position: 'absolute',
        top: Math.random() * 90 + '%',
        left: Math.random() * 90 + '%',
      }"
      class="text-lg font-bold text-white hover:text-red-500 transition-transform transform hover:scale-125 bg-pink-400 border-4 border-green-500 rounded-[50%_30%_40%_60%] p-2 animate-spin-slow"
    >
      {{ c.name }}
    </a>
  </div>
</template>

<style>
@keyframes spin-slow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 10s linear infinite;
}
</style>
