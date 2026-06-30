<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const error = ref("");

async function login() {
  error.value = "";
  try {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    auth.login(data.user, data.token);
    router.push("/");
  } catch (e) {
    error.value = e.message;
  }
}
</script>
<template>
  <div class="min-h-screen bg-zinc-950 flex items-center justify-center">
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 w-full max-w-sm flex flex-col gap-6">
      <div class="text-center">
        <div class="text-green-500 text-3xl mb-2">🎵</div>
        <h1 class="text-xl font-bold">Iniciar sesión</h1>
        <p class="text-zinc-500 text-sm mt-1">Bienvenido de nuevo</p>
      </div>

      <div class="flex flex-col gap-3">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-green-500 transition-colors"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          @keyup.enter="login"
          class="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-green-500 transition-colors"
        />
      </div>

      <p v-if="error" class="text-red-400 text-sm text-center">{{ error }}</p>

      <button
        @click="login"
        class="bg-green-500 hover:bg-green-400 text-black font-semibold py-2.5 rounded-lg text-sm transition-colors"
      >
        Entrar
      </button>

      <p class="text-zinc-500 text-sm text-center">
        ¿No tienes cuenta?
        <RouterLink to="/register" class="text-green-500 hover:underline">Regístrate</RouterLink>
      </p>
    </div>
  </div>
</template>
