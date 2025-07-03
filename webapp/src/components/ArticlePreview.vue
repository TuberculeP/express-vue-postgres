<script setup lang="ts">
import { computed, toRefs } from "vue";
import { Heart, Star, Flame, Sparkles } from "lucide-vue-next";
import type { ArticleExcerpt } from "../types";
import dayjs from "dayjs";
const props = defineProps<{
  article: ArticleExcerpt;
}>();
const { article } = toRefs(props);

const borderColors = [
  "border-red-500",
  "border-blue-500",
  "border-green-500",
  "border-yellow-500",
  "border-purple-500",
];
const bgColors = [
  "bg-pink-200",
  "bg-cyan-200",
  "bg-lime-200",
  "bg-orange-200",
  "bg-purple-200",
];
const textColors = [
  "text-red-700",
  "text-blue-700",
  "text-green-700",
  "text-orange-700",
  "text-purple-700",
];
const rotations = ["rotate-1", "-rotate-1", "rotate-2", "-rotate-2"];

const randomBorder = computed(
  () => borderColors[article.value.id % borderColors.length]
);
const randomBg = computed(() => bgColors[article.value.id % bgColors.length]);
const randomText = computed(
  () => textColors[article.value.id % textColors.length]
);
const randomRotation = computed(
  () => rotations[article.value.id % rotations.length]
);
</script>

<template>
  <article
    :className="`${randomBg} border-8 ${randomBorder} p-6 mb-6 ${randomRotation} relative overflow-hidden hover:scale-105 transition-transform`"
  >
    <div className="absolute top-2 right-2">
      <Star className="text-yellow-500 spin-crazy" :size="24" />
    </div>
    <div className="absolute bottom-2 left-2">
      <Heart className="text-red-500 bounce-wild" :size="20" />
    </div>

    <header className="mb-4">
      <h2 :className="`text-3xl font-bold ${randomText} mb-2 rainbow-text`">
        <Flame className="inline mr-2 spin-crazy" :size="28" />
        <span v-html="article.html_title"></span>
        <Sparkles className="inline ml-2 bounce-wild" :size="28" />
      </h2>

      <div className="flex flex-wrap gap-4 text-sm">
        <span className="bg-black text-green-400 px-2 py-1 font-mono blink">
          📅 {{ dayjs(article.date).format("Le DD/MM/YYYY à HH:mm") }}
        </span>
        <span
          className="bg-yellow-400 text-black px-2 py-1 font-bold transform -rotate-1 blink"
        >
          🔥 NOUVEAU! 🔥
        </span>
      </div>
    </header>

    <div
      className="bg-white border-4 border-dashed border-gray-800 p-4 transform rotate-0.5"
      v-html="article.html_excerpt"
    ></div>
  </article>
</template>
