<template>
  <div class="flex items-center justify-center py-20">
    <Card class="w-full max-w-sm">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl">Connexion</CardTitle>
        <CardDescription>
          Entrez vos identifiants pour accéder à votre compte
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium" for="email">Email</label>
          <Input
            id="email"
            type="email"
            v-model="form.email"
            placeholder="nom@exemple.com"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium" for="password">Mot de passe</label>
          <Input
            id="password"
            type="password"
            v-model="form.password"
            placeholder="••••••••"
            @keyup.enter="submitForm"
          />
        </div>
        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
        <Button class="w-full" @click="submitForm" :disabled="isLoading">
          {{ isLoading ? "Connexion..." : "Se connecter" }}
        </Button>
      </CardContent>
      <CardFooter>
        <p class="text-sm text-muted-foreground">
          Pas encore inscrit ?
          <router-link
            :to="{ name: 'app-register' }"
            class="text-primary underline-offset-4 hover:underline"
          >
            Créer un compte
          </router-link>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import apiClient from "@/lib/utils/apiClient";
import { useRouter } from "vue-router";
import type { User } from "@/lib/utils/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const router = useRouter();
const redirect = router.currentRoute.value.query.redirect as string;

const form = reactive({
  email: "",
  password: "",
});

const isLoading = ref(false);
const error = ref("");

async function submitForm() {
  isLoading.value = true;
  error.value = "";

  const result = await apiClient.post<{ user: User }>("/auth/login", form);

  if (!result.error) {
    router.push({ name: redirect ?? "landing-main" });
  } else {
    error.value = "Email ou mot de passe incorrect";
  }

  isLoading.value = false;
}
</script>
