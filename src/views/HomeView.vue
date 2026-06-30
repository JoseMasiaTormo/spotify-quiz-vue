<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const query = ref("");
const results = ref([]);
const loading = ref(false);
const searched = ref(false);

onMounted(() => {
  if (route.query.q) {
    query.value = route.query.q;
    search();
  }
});

async function search() {
  if (!query.value.trim()) return;
  loading.value = true;
  searched.value = true;
  results.value = [];

  try {
    const res = await fetch(`http://localhost:3000/spotify/search?q=${encodeURIComponent(query.value)}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    results.value = data.artists || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col gap-10">
    <div class="flex flex-col items-center gap-4 pt-10">
      <h1 class="text-3xl font-bold">¿Qué quieres explorar?</h1>
      <p class="text-zinc-500 text-sm">Busca un artista y descubre su música</p>
      <div class="flex gap-2 w-full max-w-lg">
        <input
          v-model="query"
          @keyup.enter="search"
          type="text"
          placeholder="Buscar artista..."
          class="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 outline-none focus:border-green-500 transition-colors"
        />
        <button
          @click="search"
          class="bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          Buscar
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="searched && results.length === 0" class="text-center text-zinc-500 py-20">
      No se encontraron resultados
    </div>

    <div v-else-if="results.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="artist in results"
        :key="artist.id"
        @click="router.push('/artist/' + artist.id)"
        class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 cursor-pointer hover:border-green-500 hover:bg-zinc-800 transition-all"
      >
        <img
          v-if="artist.image"
          :src="artist.image"
          :alt="artist.name"
          class="w-full aspect-square object-cover rounded-lg"
        />
        <div v-else class="w-full aspect-square bg-zinc-800 rounded-lg flex items-center justify-center text-4xl">
          🎤
        </div>
        <div>
          <p class="font-semibold text-sm truncate">{{ artist.name }}</p>
          <p class="text-zinc-500 text-xs mt-0.5">{{ artist.followers }} seguidores</p>
        </div>
      </div>
    </div>
  </div>
</template>
