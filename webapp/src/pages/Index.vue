<script setup lang="ts">
import { Star } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import type { ArticleExcerpt, RawArticleExcerpt } from "../types";
import axios from "axios";
import ArticlePreview from "../components/ArticlePreview.vue";

const allArticles = ref<ArticleExcerpt[]>();

async function getAllArticles() {
  const response = await axios.get<RawArticleExcerpt[]>(
    /* TODO - mettre sur le serveur */
    "https://chaospress.sunny-space.fr/wp-json/wp/v2/posts?_fields=author,excerpt,title,slug,categories,date,id"
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
  <div>
    <div
      className="bg-cyan-200 border-8 border-purple-600 p-6 mb-4 transform rotate-1"
    >
      <h2 className="text-4xl font-bold text-red-600 text-center mb-4">
        <span className="inline-block spin-crazy"><Star /></span>
        ACCUEIL
        <span className="inline-block spin-crazy"> <Star /> </span>
      </h2>
      <p className="text-black text-lg leading-relaxed">
        salut et bienvenue ce faisant vous etes sur monn blog je crois ducoup
        bienvenue en gros ici c'est le blog qui parle de cybersecut cur cybe
        jarrive pas a ecrerire ❤️
      </p>
      <div className="text-center mt-4">
        <div
          className="inline-block bg-red-500 text-white p-2 transform rotate-3 blink"
        >
          NOUVEAU! NOUVEAU! NOUVEAU!
        </div>
      </div>
    </div>

    <a
      v-for="article in allArticles"
      className="block no-underline cursor-pointer"
      :href="`/articles/${article.slug}`"
    >
      <ArticlePreview :article="article"
    /></a>
  </div>
</template>

<style scoped></style>
