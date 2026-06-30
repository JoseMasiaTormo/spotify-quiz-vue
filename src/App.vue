<script setup>
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "./stores/auth";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

function logout() {
  auth.logout();
  router.push("/login");
}
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-white flex flex-col">
    <nav
      v-if="auth.isAuthenticated() && !['login', 'register'].includes(route.name)"
      class="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800 px-8 py-4 flex items-center justify-between"
    >
      <span class="text-green-500 font-bold text-lg">🎵 SpotifyQuiz</span>
      <div class="flex items-center gap-6">
        <RouterLink to="/" class="text-sm text-zinc-400 hover:text-green-500 transition-colors">Buscar</RouterLink>
        <RouterLink to="/favorites" class="text-sm text-zinc-400 hover:text-green-500 transition-colors"
          >Favoritos</RouterLink
        >
        <RouterLink to="/history" class="text-sm text-zinc-400 hover:text-green-500 transition-colors"
          >Historial</RouterLink
        >
        <button
          @click="logout"
          class="text-sm text-zinc-400 border border-zinc-700 px-4 py-1.5 rounded-full hover:border-green-500 hover:text-green-500 transition-colors"
        >
          Salir
        </button>
      </div>
    </nav>
    <main class="flex-1 w-full max-w-5xl mx-auto px-8 py-10">
      <RouterView />
    </main>
  </div>
</template>
