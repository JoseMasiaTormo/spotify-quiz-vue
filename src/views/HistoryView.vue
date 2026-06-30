<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const history = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await fetch("http://localhost:3000/history", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    history.value = await res.json();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function removeHistory(id) {
  try {
    await fetch(`http://localhost:3000/history/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    history.value = history.value.filter((item) => item.id !== id);
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-2xl font-bold">Historial de búsquedas</h1>

    <div v-if="loading" class="flex justify-center" py-20>
      <div class="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="history.length === 0" class="text-zinc-500 text-center py-20">
      Aún no has hecho ninguna búsqueda
    </div>

    <div v-else class="flex flex-col gap-2">
      <div
        v-for="item in history"
        :key="item.id"
        class="bg-zinc-900 border border-zinc-800 rounded-lg px-5 py-3 flex items-center justify-between hover:border-zinc-600 transition-colors group"
      >
        <div
          @click="router.push('/?q=' + item.query)"
          class="flex items-center gap-3 flex-1 cursor-pointer"
        >
          <span class="text-zinc-500">🔍</span>
          <span class="text-sm">{{ item.query }}</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-zinc-500 text-xs">{{ formatDate(item.createdAt) }}</span>
          <button
            @click.stop="removeHistory(item.id)"
            class="text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            title="Eliminar"
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
