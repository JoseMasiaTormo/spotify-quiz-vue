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
      headers: { ContentType: "application/json" },
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
<template></template>
