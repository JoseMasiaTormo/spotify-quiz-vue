<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const artist = ref(null);
const albums = ref([]);
const loading = ref(true);
const saved = ref(false);

onMounted(async () => {
  try {
    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
    const [artistRes, albumsRes, favoritesRes] = await Promise.all([
      fetch(`http://localhost:3000/spotify/artist/${route.params.id}`, { headers }),
      fetch(`http://localhost:3000/spotify/artist/${route.params.id}/albums`, { headers }),
      fetch(`http://localhost:3000/favorites`, { headers }),
    ]);
    artist.value = await artistRes.json();
    albums.value = await albumsRes.json();
    const favorites = await favoritesRes.json();
    saved.value = favorites.some((f) => f.artistId === route.params.id);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

async function toggleFavorite() {
  try {
    const method = saved.value ? "DELETE" : "POST";
    await fetch(`http://localhost:3000/favorites`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        artistId: route.params.id,
        artistName: artist.value.name,
        artistImage: artist.value.image,
      }),
    });
    saved.value = !saved.value;
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <div>
    <button
      @click="router.back()"
      class="text-zinc-500 hover:text-white text-sm mb-8 flex items-center gap-2 transition-colors"
    >
      ← Volver
    </button>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="artist" class="flex flex-col gap-10">
      <div class="flex gap-8 items-center">
        <img
          v-if="artist.image"
          :src="artist.image"
          :alt="artist.name"
          class="w-40 h-40 rounded-full object-cover border-2 border-zinc-800"
        />
        <div v-else class="w-40 h-40 rounded-full bg-zinc-800 flex items-center justify-center text-5xl">🎤</div>

        <div class="flex flex-col gap-3">
          <h1 class="text-4xl font-bold">{{ artist.name }}</h1>
          <p class="text-zinc-400 text-sm">{{ artist.followers }} seguidores</p>
          <div class="flex gap-2 flex-wrap">
            <span
              v-for="genre in artist.genres"
              :key="genre"
              class="text-xs bg-zinc-800 border border-zinc-700 px-3 py-1 rounded-full text-zinc-400"
            >
              {{ genre }}
            </span>
          </div>
          <button
            @click="toggleFavorite"
            class="mt-2 w-fit px-5 py-2 rounded-full text-sm font-semibold transition-colors"
            :class="
              saved
                ? 'bg-green-500 text-black hover:bg-green-400'
                : 'border border-zinc-700 text-zinc-400 hover:border-green-500 hover:text-green-500'
            "
          >
            {{ saved ? "✓ Guardado" : "+ Favoritos" }}
          </button>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-bold mb-4">Discografía</h2>
        <div v-if="albums.length === 0" class="text-zinc-500 text-sm">No se encontraron álbumes</div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div
            v-for="album in albums"
            :key="album.id"
            class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3"
          >
            <img
              v-if="album.image"
              :src="album.image"
              :alt="album.name"
              class="w-full aspect-square object-cover rounded-lg"
            />
            <div v-else class="w-full aspect-square bg-zinc-800 rounded-lg flex items-center justify-center text-4xl">
              💿
            </div>
            <div>
              <p class="font-semibold text-sm truncate">{{ album.name }}</p>
              <p class="text-zinc-500 text-xs mt-0.5">{{ album.year }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
