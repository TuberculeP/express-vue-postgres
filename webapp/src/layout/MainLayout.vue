<script setup lang="ts">
import ChaosNavigation from "../components/ChaosNavigation.vue";
import FloatingElements from "../components/FloatingElements.vue";
</script>

<template>
  <div className="min-h-screen bg-geocities relative overflow-hidden">
    <FloatingElements />

    <header className="bg-striped p-4 border-8 border-dashed border-red-500">
      <div className="text-center">
        <h1
          className="text-6xl font-bold rainbow-text mb-2"
          :style="{ fontFamily: 'Creepster, cursive' }"
        >
          🌟 BIENVENUE SUR MON BLOG CE ETRE MON BLOG (MON BLOG) 🌟
        </h1>
        <div className="blink text-2xl text-yellow-300 font-bold">
          ⚡ SITE EN CONSTRUCTION ⚡
        </div>
        <div
          className="marquee bg-black text-green-400 mt-2 p-2 border-4 border-cyan-400"
        >
          <span>
            🔥 NOUVEAU POST TOUS LES JOURS 🔥 ABONNEZ-VOUS À MA NEWSLETTER 🔥
            CLIQUEZ ICI POUR GAGNER UN IPHONE 🔥
          </span>
        </div>
      </div>
    </header>

    <div className="flex flex-wrap relative">
      <!-- Sidebar gauche -->
      <aside
        className="w-full sticky top-0 left-0 md:w-1/4 bg-pink-500 border-8 border-double border-blue-600 p-4 h-fit"
      >
        <ChaosNavigation />

        <div
          className="mt-8 bg-yellow-300 border-4 border-red-600 p-4 transform rotate-2"
        >
          <h3 className="text-xl font-bold text-purple-800 blink">
            🎵 MA PLAYLIST 🎵
          </h3>
          <ul className="text-sm text-black">
            <li className="bounce-wild">🎶 Darude - Sandstorm</li>
            <li className="spin-crazy inline-block">
              🎶 All Star - Smash Mouth
            </li>
            <li className="rainbow-text">🎶 Numa Numa</li>
          </ul>
        </div>

        <!-- TODO <GeoCitiesCounter /> -->

        <div
          className="mt-4 bg-green-400 border-4 border-orange-500 p-2 transform -rotate-1"
        >
          <p className="text-xs text-black font-bold">
            Site optimisé pour Internet Explorer 6.0 et Netscape Navigator!
          </p>
        </div>
        <iframe src="https://commandoboat.com/game/index.html"></iframe>
      </aside>

      <!-- {/* Contenu principal */} -->
      <main className="w-full md:w-1/2">
        <slot></slot>
      </main>

      <!-- {/* Sidebar droite */} -->
      <aside
        className="w-full md:w-1/4 bg-lime-400 border-8 border-double border-red-500 p-4"
      >
        <div className="flex">
          <img
            src="https://yesterhost.neocities.org/archive/buttons/button102.gif"
            alt=""
          />
          <img
            src="https://yesterhost.neocities.org/archive/buttons/button213.png"
            alt=""
          />
          <img
            src="https://yesterhost.neocities.org/archive/buttons/button58.gif"
            alt=""
          />
        </div>
        <div
          className="bg-purple-300 border-4 border-yellow-500 p-4 mb-4 transform -rotate-2"
        >
          <h3 className="text-2xl font-bold text-red-700 text-center blink">
            🎯 LIENS UTILES 🎯
          </h3>
          <ul className="space-y-2 mt-4">
            <li>
              <a
                href="https://blog.chiassepourrie.fr/"
                className="text-blue-800 underline hover:text-red-600 font-bold"
              >
                🔗 Mon autre site
              </a>
            </li>
            <li>
              <a
                href="https://www.01net.com/telecharger/multimedia/lecteurs_audio_mp3_cd/winamp-full.html/win-27470/"
                className="text-blue-800 underline hover:text-red-600 font-bold"
              >
                🔗 Télécharger Winamp
              </a>
            </li>
            <li>
              <a
                href="https://gifcities.org/"
                className="text-blue-800 underline hover:text-red-600 font-bold"
              >
                🔗 GIFs gratuits
              </a>
            </li>
          </ul>
        </div>

        <div
          className="bg-red-300 border-4 border-blue-500 p-4 mb-4 spin-crazy"
        >
          <h3 className="text-xl font-bold text-green-700 text-center">
            ⭐ SITE DU JOUR ⭐
          </h3>
          <a
            href="https://vendezvotrevoiture.fr/"
            className="text-black text-sm mt-2"
          >
            https://vendezvotrevoiture.fr/
          </a>
        </div>

        <div
          className="bg-yellow-400 border-4 border-purple-500 p-4 transform rotate-3"
        >
          <h3 className="text-lg font-bold text-red-600 text-center blink">
            🏆 RÉCOMPENSES 🏆
          </h3>
          <div className="text-center mt-2 space-y-1">
            <div className="text-sm text-black">
              🥇 Site le plus coloré 2004
            </div>
            <div className="text-sm text-black">🎨 Prix du design innovant</div>
            <div className="text-sm text-black">⚡ Site le plus rapide*</div>
            <div className="text-xs text-gray-600">*sur mon ordinateur</div>
          </div>
        </div>
        <img
          src="https://blob.gifcities.org/gifcities/4DSRCUINVCAQ2H523APA7NHR7FFWARVJ.gif"
          alt=""
        />
      </aside>
    </div>

    <footer className="bg-black text-white p-4 border-t-8 border-rainbow">
      <div className="text-center">
        <div className="rainbow-text text-2xl font-bold mb-2">
          © 2002 Félix - Tous droits réservés
        </div>
        <div className="blink text-yellow-400">
          Dernière mise à jour: Il y a 3 minutes
        </div>
        <div className="mt-2 text-sm">
          <span className="text-green-400">
            Vous êtes le visiteur numéro{" "}
          </span>
          <span className="text-red-400 font-bold blink">123456</span>
          <span className="text-green-400"> aujourd'hui!</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped></style>
