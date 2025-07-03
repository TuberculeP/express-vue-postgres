<script setup lang="ts">
import {
  Star,
  Heart,
  Zap,
  Sparkles,
  Gift,
  Crown,
  Flame,
  Rainbow,
} from "lucide-vue-next";

const elements = [
  {
    Icon: Star,
    color: "text-yellow-400",
    animation: "spin-crazy",
    position: "top-10 left-10",
  },
  {
    Icon: Heart,
    color: "text-red-500",
    animation: "bounce-wild",
    position: "top-20 right-20",
  },
  {
    Icon: Zap,
    color: "text-blue-400",
    animation: "blink",
    position: "top-1/3 left-1/4",
  },
  {
    Icon: Sparkles,
    color: "text-purple-400",
    animation: "spin-crazy",
    position: "top-1/2 right-10",
  },
  {
    Icon: Gift,
    color: "text-green-400",
    animation: "bounce-wild",
    position: "bottom-1/3 left-20",
  },
  {
    Icon: Crown,
    color: "text-yellow-500",
    animation: "blink",
    position: "bottom-20 right-1/4",
  },
  {
    Icon: Flame,
    color: "text-orange-500",
    animation: "spin-crazy",
    position: "top-40 left-1/2",
  },
  {
    Icon: Rainbow,
    color: "text-pink-400",
    animation: "bounce-wild",
    position: "bottom-40 left-10",
  },
];
</script>

<template>
  <div className="fixed inset-0 pointer-events-none z-100">
    <div
      v-for="(element, index) in elements"
      :key="index"
      :className="`absolute ${element.position} ${element.animation}`"
    >
      <component
        :is="element.Icon"
        :className="`${element.color} opacity-60`"
        :size="Math.random() * 20 + 15"
      />
    </div>

    <div
      className="absolute top-16 right-1/3 rainbow-text font-bold text-2xl blink opacity-70 transform rotate-12"
    >
      WOW!
    </div>
    <div
      className="absolute bottom-1/4 left-1/3 text-green-400 font-bold text-xl spin-crazy opacity-70"
    >
      COOL!
    </div>
    <div
      className="absolute top-1/2 left-10 text-red-500 font-bold text-lg bounce-wild opacity-70 transform -rotate-6"
    >
      NEW!
    </div>
    <div
      className="absolute bottom-32 right-16 text-blue-400 font-bold text-xl blink opacity-70 transform rotate-45"
    >
      OMG!
    </div>
  </div>
</template>
