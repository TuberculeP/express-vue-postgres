<template>
  <div class="min-h-screen bg-background">
    <header v-if="isAuthenticated" class="border-b p-4 flex items-center justify-between">
      <span class="text-foreground">Bienvenue, {{ user?.firstName }}</span>
      <Button variant="outline" @click="disconnect">Déconnexion</Button>
    </header>
    <main class="p-4">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/authStore";
import apiClient from "../lib/utils/apiClient";
import { Button } from "@/components/ui/button";

const { user, isAuthenticated } = storeToRefs(useAuthStore());

async function disconnect() {
  const result = await apiClient.post("/auth/logout");
  if (result.data) {
    console.log("Déconnexion réussie");
    user.value = undefined;
    window.location.reload();
  } else {
    console.error("Erreur lors de la déconnexion :", result.error);
  }
}
</script>
