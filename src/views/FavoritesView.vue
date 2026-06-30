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
            class="text-zinc-500 hover:text-red-400 text-sm transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
