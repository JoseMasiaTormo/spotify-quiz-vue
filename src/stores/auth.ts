import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || null);
  const user = ref(JSON.parse(localStorage.getItem("user") || "null"));

  function login(userData: object, tokenData: string) {
    token.value = tokenData;
    user.value = userData;
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  const isAuthenticated = () => !!token.value;

  return { token, user, login, logout, isAuthenticated };
});
