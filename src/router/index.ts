import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegiterView from "../views/RegiterView.vue";
import ArtistView from "../views/ArtistView.vue";
import FavoritesView from "../views/FavoritesView.vue";
import HistoryView from "../views/HistoryView.vue";

const routes = [
  { path: "/", component: HomeView, meta: { requiresAuth: true } },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegiterView },
  { path: "/artist/:id", component: ArtistView, meta: { requiresAuth: true } },
  { path: "/favorites", component: FavoritesView, meta: { requiresAuth: true } },
  { path: "/history", component: HistoryView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) return "/login";
});

export default router;
