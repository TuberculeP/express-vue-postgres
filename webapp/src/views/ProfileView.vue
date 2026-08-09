<template>
  <div class="flex items-center justify-center py-20">
    <Card class="w-full max-w-sm">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl">Mon compte</CardTitle>
        <CardDescription>
          Gerez vos donnees personnelles (RGPD)
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Email</label>
          <p class="text-sm text-muted-foreground">
            {{ authStore.user?.email }}
          </p>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium" for="username">Pseudo</label>
          <Input id="username" type="text" v-model="username" />
        </div>

        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
        <p v-if="success" class="text-sm text-green-600">{{ success }}</p>

        <Button class="w-full" @click="updateUsername" :disabled="isLoading">
          Mettre a jour le pseudo
        </Button>

        <a href="/api/auth/me/export" class="block">
          <Button variant="outline" class="w-full" type="button">
            Exporter mes donnees
          </Button>
        </a>

        <Button
          variant="destructive"
          class="w-full"
          type="button"
          @click="deleteAccount"
        >
          Supprimer mon compte
        </Button>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import apiClient from "@/lib/utils/apiClient";
import { useAuthStore } from "@/stores/authStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/utils/types";

const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const username = ref("");
const error = ref("");
const success = ref("");
const isLoading = ref(false);

onMounted(() => {
  username.value = user.value?.username ?? "";
});

async function updateUsername() {
  isLoading.value = true;
  error.value = "";
  success.value = "";

  const result = await apiClient.patch<{ user: User }>("/auth/me", {
    username: username.value,
  });

  if (result.error) {
    error.value = "Ce pseudo est deja pris ou invalide";
  } else if (result.data) {
    authStore.user = result.data.user;
    success.value = "Pseudo mis a jour";
  }

  isLoading.value = false;
}

async function deleteAccount() {
  if (
    !window.confirm(
      "Supprimer definitivement votre compte ? Cette action est irreversible.",
    )
  ) {
    return;
  }

  const result = await apiClient.delete("/auth/me");
  if (!result.error) {
    authStore.user = undefined;
    router.push({ name: "app-login" });
  } else {
    error.value = "Erreur lors de la suppression du compte";
  }
}
</script>
