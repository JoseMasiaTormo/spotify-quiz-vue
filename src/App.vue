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

<template></template>
