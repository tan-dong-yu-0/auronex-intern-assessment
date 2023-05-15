<script setup>
import { ref, onMounted } from 'vue';

const products = ref([])
const currentPage = ref(1)


onMounted(async () => {
	fetchProducts()
})

async function fetchProducts() {
	// if on 1st page skip none
	// if on 2nd page skip first 10
	// if on 3rd page skip first 20
	const res = await fetch(`https://dummyjson.com/products?limit=10&skip=${(currentPage.value - 1) * 10}`)
	const data = await res.json()
	products.value = data.products.map(product => ({
		name: product.title,
		image: product.images[0],
		price: product.price,
		category: product.category,
	}));
}

function nextPage() {
	if (currentPage.value < 3) {
		currentPage.value++;
		fetchProducts();
	}
}

function previousPage() {
	if (currentPage.value > 1) {
		currentPage.value--;
		fetchProducts();
	}
}

</script>

<template>
	<h1>Home Page</h1>
	<ul v-for="product in products">
		<img :src="product.image" :alt="product.name">
		<p>{{ product.name }}</p>
		<p>{{ product.price }}</p>
		<p>{{ product.category }}</p>
	</ul>
	<!-- <p>{{  }}</p> -->
	<button @click="previousPage">Previous Page</button>
	<button @click="nextPage">Next Page</button>
</template>

<style scoped>
img {
	height: 100px;
	width: 150px;
}

ul {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-around;
}

/* how to wrap the ul to dislay 5 columns and 2 rows */
/* ul {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	grid-template-rows: repeat(2, 1fr);
} */
</style>