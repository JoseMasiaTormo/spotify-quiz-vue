<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const favorites = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await fetch("http://localhost:3000/favorites", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    favorites.value = await res.json();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

async function removeFavorite(artistId) {
  try {
    await fetch("http://localhost:3000/favorites", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ artistId }),
    });
    favorites.value = favorites.value.filter((f) => f.artistId !== artistId);
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-2xl font-bold">Tus Favoritos</h1>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="favorites.length === 0" class="text-zinc-500 text-center py-20">
      Aún no tienes artistas favoritos
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="fav in favorites"
        :key="favorites.artistId"
        class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3"
      >
        <img
          v-if="fav.artistImage"
          :src="fav.artistImage"
          :alt="fav.artistName"
          @click="router.push('/artist/' + fav.artistId)"
          class="w-full aspect-square object-square rounded-lg cursor-pointer"
        />
        <div
          v-else
          @click="router.push('/artist/' + fav.artist)"
          class="w-full aspect-square bg-zinc-800 rounded-lg flex items-center justify-center text-4xl cursor-pointer"
        >
          🎤​
        </div>
        <div class="flex items-center justify-between gap-2">
          <p class="font-semibold text-sm truncate">{{ fav.artistName }}</p>
          <button
            @click="removeFavorite(fav.artistId)"
            class="text-zinc-500 hover:text-red-400 transition-colors shrink-0"
            title="Eliminar de favoritos"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
