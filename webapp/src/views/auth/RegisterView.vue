<template>
  <div class="flex items-center justify-center py-20">
    <Card class="w-full max-w-sm">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl">Créer un compte</CardTitle>
        <CardDescription>
          Entrez vos informations pour créer votre compte
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium" for="firstName">Prénom</label>
            <Input
              id="firstName"
              type="text"
              v-model="form.firstName"
              placeholder="Jean"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium" for="lastName">Nom</label>
            <Input
              id="lastName"
              type="text"
              v-model="form.lastName"
              placeholder="Dupont"
            />
          </div>
        </div>
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
        <p v-if="success" class="text-sm text-green-600">{{ success }}</p>
        <Button class="w-full" @click="submitForm" :disabled="isLoading">
          {{ isLoading ? "Création..." : "Créer un compte" }}
        </Button>
      </CardContent>
      <CardFooter>
        <p class="text-sm text-muted-foreground">
          Déjà inscrit ?
          <router-link
            :to="{ name: 'app-login' }"
            class="text-primary underline-offset-4 hover:underline"
          >
            Se connecter
          </router-link>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/lib/utils/apiClient";
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

const form = reactive({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
});

const isLoading = ref(false);
const error = ref("");
const success = ref("");

async function submitForm() {
  isLoading.value = true;
  error.value = "";
  success.value = "";

  const result = await apiClient.post("/auth/register", form);

  if (!result.error) {
    success.value = "Compte créé avec succès !";
    setTimeout(() => {
      router.push({ name: "app-login" });
    }, 1500);
  } else {
    error.value =
      result.error.response?.data?.error ||
      "Erreur lors de la création du compte";
  }

  isLoading.value = false;
}
</script>
