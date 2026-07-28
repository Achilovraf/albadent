import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/Home.vue";

const About = () => import("@/views/About.vue");
const Contact = () => import("@/views/Contact.vue");
const Blog = () => import("@/views/Blog.vue");
const Products = () => import("@/views/Products.vue");

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/about", name: "about", component: About },
  { path: "/contacts", name: "contacts", component: Contact },
  { path: "/products", name: "products", component: Products },
  { path: "/blog", name: "blog", component: Blog },
  {
    path: "/blog",
    name: "blog",
    component: () => import("@/views/Blog.vue"),
  },
  {
    path: "/blog/:id",
    name: "blog-detail",
    component: () => import("@/views/BlogDetail.vue"),
  },
  {
    path: "/admin/gallery",
    name: "admin-gallery",
    component: () => import("@/views/Gallery/Gallery.vue"),
  },
  {
    path: "/gallery",
    name: "gallery",
    component: () => import("@/views/Gallery/Galleryview.vue"), 
  },
];

const router = createRouter({
  history: createWebHistory("/albadent/"),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;