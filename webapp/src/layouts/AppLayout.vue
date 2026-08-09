<template>
  <div class="min-h-screen bg-background">
    <header
      v-if="isAuthenticated"
      class="border-b p-4 flex items-center justify-between"
    >
      <span class="text-foreground">Bienvenue, {{ user?.username }}</span>
      <div class="flex items-center gap-2">
        <router-link
          :to="{ name: 'profile' }"
          class="text-sm text-primary underline-offset-4 hover:underline"
        >
          Mon compte
        </router-link>
        <router-link
          v-if="user?.role === 'ROLE_ADMIN'"
          :to="{ name: 'admin-users' }"
          class="text-sm text-primary underline-offset-4 hover:underline"
        >
          Admin
        </router-link>
        <Button variant="outline" @click="disconnect">Déconnexion</Button>
      </div>
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
