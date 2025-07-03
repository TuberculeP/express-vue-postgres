import { createRouter, createWebHistory } from "vue-router";
import Index from "./pages/Index.vue";
import Article from "./pages/Article.vue";
import axios from "axios";
import About from "./pages/About.vue";
import Contact from "./pages/Contact.vue";
import GuestBook from "./pages/GuestBook.vue";
import Important from "./pages/Important.vue";
import SecretRoom from "./pages/SecretRoom.vue";
import Categories from "./pages/Categories.vue";
import ByCategory from "./pages/ByCategory.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Index },
    { path: "/about", component: About },
    { path: "/contact", component: Contact },
    { path: "/guest-book", component: GuestBook },
    { path: "/important", component: Important },
    { path: "/secret", component: SecretRoom },
    {
      path: "/categories",
      component: Categories,
      beforeEnter: async (to, _, next) => {
        try {
          // TODO - serveur
          const response = await axios.get(
            "https://chaospress.sunny-space.fr/wp-json/wp/v2/categories"
          );
          const categories = await response.data;
          to.meta.categories = categories;
          next();
        } catch (error) {
          // Redirige ou affiche une erreur si besoin
          next(false);
        }
      },
      props: (route) => ({ categories: route.meta.categories }),
    },
    {
      path: "/by-category/:slug",
      component: ByCategory,
      beforeEnter: async (to, _, next) => {
        const slug = to.params.slug;
        try {
          // TODO - serveur
          const response = await axios.get(
            `https://chaospress.sunny-space.fr/wp-json/wp/v2/categories?slug=${slug}`
          );
          const category = await response.data[0];
          to.meta.category = category;
          next();
        } catch (error) {
          console.error("Error fetching category:", error);
          next(false); // Redirige ou affiche une erreur si besoin
        }
      },
      props: (route) => ({ category: route.meta.category }),
    },
    {
      path: "/articles/:slug",
      component: Article,
      beforeEnter: async (to, _, next) => {
        console.log("Fetching article for slug:", to.params.slug);
        try {
          const slug = to.params.slug;
          // TODO - serveur
          const response = await axios.get(
            `https://chaospress.sunny-space.fr/wp-json/wp/v2/posts?slug=${slug}`
          );
          const article = await response.data[0];
          to.meta.article = article;
          next();
        } catch (error) {
          // Redirige ou affiche une erreur si besoin
          next(false);
        }
      },
      props: (route) => ({ article: route.meta.article }),
    },
  ],
});

export default router;
