<script setup lang="ts">
import {
  Home,
  User,
  Book,
  Mail,
  Star,
  Heart,
  FileQuestion,
  Folder,
} from "lucide-vue-next";
import { computed } from "vue";
const navItems = [
  {
    id: "home",
    label: "🏠 ACCUEIL",
    icon: Home,
    rotation: "rotate-2",
    color: "bg-red-500",
    link: "/",
  },
  {
    id: "categories",
    label: "📂 CATÉGORIES",
    icon: Folder,
    rotation: "rotate-3",
    color: "bg-gray-900",
    link: "/categories",
  },
  {
    id: "about",
    label: "👤 À PROPOS",
    icon: User,
    rotation: "-rotate-1",
    color: "bg-blue-500",
    link: "/about",
  },
  {
    id: "guest-book",
    label: "📖 LIVRE D'OR",
    icon: Book,
    rotation: "rotate-3",
    color: "bg-green-500",
    link: "/guest-book",
  },
  {
    id: "contact",
    label: "📧 CONTACT",
    icon: Mail,
    rotation: "-rotate-2",
    color: "bg-purple-500",
    link: "/contact",
  },
  {
    id: "secret",
    label: "⚡ ZONE SECRÈTE",
    icon: FileQuestion,
    rotation: "rotate-4",
    color: "bg-red-500",
    class:
      "w-full bg-cyan-400 text-black p-2 border-4 border-purple-600 font-bold bounce-wild transform -rotate-1",
    link: "/secret",
  },
  {
    id: "important",
    label: "SITE IMPORTANT",
    icon: Heart,
    rotation: "rotate-1",
    color: "bg-blue-500",
    link: "/important",
  },
];

const currentView = computed(() => {
  return window.location.pathname.split("/").pop() || "home";
});
</script>

<template>
  <nav className="space-y-4">
    <h2
      className="text-3xl font-bold text-center text-white bg-black p-2 border-4 border-yellow-400 rainbow-text"
    >
      🧭 NAVIGATION 🧭
    </h2>

    <img
      src="https://blob.gifcities.org/gifcities/HANGPKCFKQH7C64UQ6URK2SQOLN24TNW.gif"
      alt=""
    />
    <img
      src="https://blob.gifcities.org/gifcities/GYZTDRDZ7VD27NJ6TTMZZKERRIL7QYFO.gif"
      alt=""
    />

    <a
      v-for="item in navItems"
      :className="`${item.class} 
            flex items-center justify-center no-underline cursor-pointer
            w-full p-3 ${item.color} text-white font-bold border-4 border-black
            transform ${
              item.rotation
            } hover:scale-110 transition-all duration-200
            ${currentView === item.id ? 'blink' : 'hover:bounce-wild'}
            shadow-lg hover:shadow-xl
          `"
      :key="item.id"
      :href="item.link"
    >
      <item.icon className="inline mr-2 spin-crazy" :size="20" />
      {{ item.label }}

      <span className="inline-block ml-2 bounce-wild"><Star :size="16" /></span>
    </a>

    <div
      className="bg-orange-300 border-4 border-green-600 p-3 transform -rotate-1 mt-4"
    >
      <h3 className="font-bold text-red-700 text-center blink">☀️ MÉTÉO ☀️</h3>
      <p className="text-black text-sm text-center">
        Aujourd'hui: Ensoleillé
        <br />
        <span className="rainbow-text font-bold">25°C</span>
      </p>
    </div>
  </nav>
</template>
