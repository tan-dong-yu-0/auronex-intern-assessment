import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue"
import Home from "../views/Home.vue"
import ProductDetails from "../views/ProductDetails.vue"

const routes = [
	{ path: "/", name: "login", component: Login },
	{ path: "/home", name: "home", component: Home },
	{ path: "/product/:id", name: "product-details", component: ProductDetails },
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router