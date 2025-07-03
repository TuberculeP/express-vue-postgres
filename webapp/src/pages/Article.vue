<script setup lang="ts">
const props = defineProps<{ article: any }>();
</script>

<template>
  <article>
    <div
      class="post"
      v-html="
        '<h1>' + article.title.rendered + '</h1>' + article.content.rendered
      "
    ></div>
  </article>
</template>

<style scoped lang="scss">
article {
  display: block;
  padding: 20px;
  background-color: white;
}
</style>
