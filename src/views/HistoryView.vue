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
        @click="router.push('/?q=' + item.query)"
        class="bg-zinc-900 border border-zinc-800 rounded-lg px-5 py-3 flex items-center justify-between cursor-pointer hover:border-green-500 transition-colors"
      >
        <div class="flex items-center gap-3">
          <span class="text-zinc-500">​🔍​</span>
          <span class="text-sm">{{ item.query }}</span>
        </div>
        <span class="text-zinc-500 text-xs">{{ formatDate(item.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>
