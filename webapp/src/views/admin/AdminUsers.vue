<template>
  <div class="max-w-4xl mx-auto space-y-4">
    <Card>
      <CardHeader>
        <CardTitle>Gestion des utilisateurs</CardTitle>
        <CardDescription>
          Exemple de CRUD admin : changer le role ou desactiver un compte.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <Input
          v-model="search"
          placeholder="Rechercher par email ou pseudo..."
          class="max-w-sm"
        />

        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b text-left text-muted-foreground">
                <th class="py-2 pr-4">Email</th>
                <th class="py-2 pr-4">Pseudo</th>
                <th class="py-2 pr-4">Role</th>
                <th class="py-2 pr-4">Statut</th>
                <th class="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id" class="border-b">
                <td class="py-2 pr-4">{{ user.email }}</td>
                <td class="py-2 pr-4">{{ user.username }}</td>
                <td class="py-2 pr-4">
                  <select
                    :value="user.role"
                    class="rounded-md border border-input bg-background px-2 py-1 text-sm"
                    @change="
                      updateRole(
                        user.id,
                        ($event.target as HTMLSelectElement).value,
                      )
                    "
                  >
                    <option value="ROLE_USER">Utilisateur</option>
                    <option value="ROLE_ADMIN">Admin</option>
                  </select>
                </td>
                <td class="py-2 pr-4">
                  <span
                    :class="
                      user.isActive ? 'text-green-600' : 'text-muted-foreground'
                    "
                  >
                    {{ user.isActive ? "Actif" : "Inactif" }}
                  </span>
                </td>
                <td class="py-2 pr-4">
                  <Button
                    v-if="user.isActive"
                    variant="destructive"
                    size="sm"
                    @click="deactivateUser(user.id)"
                  >
                    Desactiver
                  </Button>
                  <Button
                    v-else
                    variant="outline"
                    size="sm"
                    @click="activateUser(user.id)"
                  >
                    Activer
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between pt-2">
          <span class="text-sm text-muted-foreground">
            Page {{ pagination.page }} / {{ pagination.pages || 1 }} ({{
              pagination.total
            }}
            utilisateurs)
          </span>
          <div class="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="pagination.page <= 1"
              @click="goToPage(pagination.page - 1)"
            >
              Precedent
            </Button>
            <Button
              variant="outline"
              size="sm"
              :disabled="pagination.page >= pagination.pages"
              @click="goToPage(pagination.page + 1)"
            >
              Suivant
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import apiClient from "@/lib/utils/apiClient";
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

type AdminUser = Pick<User, "id" | "email" | "username" | "role" | "isActive">;

const users = ref<AdminUser[]>([]);
const pagination = reactive({ page: 1, limit: 20, total: 0, pages: 0 });
const search = ref("");
const error = ref("");

let searchTimeout: ReturnType<typeof setTimeout>;
watch(search, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => fetchUsers(1), 300);
});

onMounted(() => fetchUsers());

async function fetchUsers(page = pagination.page) {
  error.value = "";
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (search.value) params.append("search", search.value);

  const result = await apiClient.get<{
    users: AdminUser[];
    pagination: typeof pagination;
  }>(`/admin/users?${params}`);

  if (result.error) {
    error.value = "Impossible de charger les utilisateurs";
    return;
  }
  if (result.data) {
    users.value = result.data.users;
    Object.assign(pagination, result.data.pagination);
  }
}

function goToPage(page: number) {
  if (page < 1 || page > pagination.pages) return;
  fetchUsers(page);
}

async function updateRole(userId: string, role: string) {
  error.value = "";
  const result = await apiClient.patch<{ user: AdminUser }>(
    `/admin/users/${userId}`,
    { role },
  );
  if (result.error) {
    error.value = result.error;
    fetchUsers();
    return;
  }
  const index = users.value.findIndex((u) => u.id === userId);
  if (index >= 0 && result.data) users.value[index] = result.data.user;
}

async function deactivateUser(userId: string) {
  error.value = "";
  const result = await apiClient.delete<{ message: string }>(
    `/admin/users/${userId}`,
  );
  if (result.error) {
    error.value = result.error;
    return;
  }
  const user = users.value.find((u) => u.id === userId);
  if (user) user.isActive = false;
}

async function activateUser(userId: string) {
  error.value = "";
  const result = await apiClient.patch<{ user: AdminUser }>(
    `/admin/users/${userId}`,
    { isActive: true },
  );
  if (result.error) {
    error.value = result.error;
    return;
  }
  const index = users.value.findIndex((u) => u.id === userId);
  if (index >= 0 && result.data) users.value[index] = result.data.user;
}
</script>
