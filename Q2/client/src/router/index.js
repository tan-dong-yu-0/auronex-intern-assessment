import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue"
import Home from "../views/Home.vue"
import ProductDetails from "../views/ProductDetails.vue"

const routes = [
	{ path: "/", name: "home", component: Home },
	{ path: "/login", name: "login", component: Login },
	{ path: "/product/:id", name: "product-details", component: ProductDetails },
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router