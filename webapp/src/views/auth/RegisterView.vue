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

        <template v-if="googleAuthEnabled">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t" />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-card px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          <Button
            variant="outline"
            class="w-full gap-2"
            @click="signupWithGoogle"
            type="button"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            S'inscrire avec Google
          </Button>
        </template>
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
import { reactive, ref, onMounted } from "vue";
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
const googleAuthEnabled = ref(false);

onMounted(async () => {
  const result = await apiClient.get<{ googleAuthEnabled: boolean }>(
    "/auth/config",
  );
  if (result.data) {
    googleAuthEnabled.value = result.data.googleAuthEnabled;
  }
});

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

function signupWithGoogle() {
  window.location.href = "/api/auth/google";
}
</script>
