<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { ArticleExcerpt, RawArticleExcerpt } from "../types";
import axios from "axios";
import ArticlePreview from "../components/ArticlePreview.vue";

const props = defineProps<{
  category: { id: number; name: string; slug: string };
}>();

const allArticles = ref<ArticleExcerpt[]>([]);

async function getAllArticles() {
  const response = await axios.get<RawArticleExcerpt[]>(
    /* TODO - mettre sur le serveur */
    `https://chaospress.sunny-space.fr/wp-json/wp/v2/posts?categories=${props.category.id}&_fields=author,excerpt,title,slug,categories,date,id`
  );
  const posts = response.data.map((post) => ({
    id: post.id,
    slug: post.slug,
    html_title: post.title.rendered,
    html_excerpt: post.excerpt.rendered,
    date: post.date,
  }));

  allArticles.value = posts;
}

onMounted(() => {
  getAllArticles();
});
</script>
<template>
  <h1
    class="text-4xl font-bold text-center text-yellow-500 transform rotate-1 animate-bounce"
  >
    Catégorie : <span class="text-red-500 underline">{{ category.name }}</span>
  </h1>
  <a
    v-for="article in allArticles"
    className="block no-underline cursor-pointer"
    :href="`/articles/${article.slug}`"
  >
    <ArticlePreview :article="article"
  /></a>
</template>
