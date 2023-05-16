<script setup>
import { ref, onMounted } from 'vue';

// issue:
// products array will 

const products = ref([])
const currentPage = ref(1)
const searchProduct = ref('')
const searchCategory = ref('')

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

function searchProductByName() {
	// fetch products by name
	fetch(`https://dummyjson.com/products/search?q=${searchProduct.value}`)
		// return the response as json
		.then(res => res.json())
		// not using filter because we need all the element
		// filter will only return the element that matches the condition
		.then(data => {
			products.value = data.products.map(product => ({
				name: product.title,
				image: product.images[0],
				price: product.price,
				category: product.category,
			}));
			console.log(data)
		});

	setTimeout(() => {
		console.log("5 seconds")
		if (searchProduct.value === '') {
			fetchProducts()
		}
	}, 3000)
}

function searchProductByCategory() {
	fetch(`https://dummyjson.com/products/category/${searchCategory.value}`)
		.then(res => res.json())
		.then(data => {
			products.value = data.products.map(product => ({
				name: product.title,
				image: product.images[0],
				price: product.price,
				category: product.category,
			}));
		});

	setTimeout(() => {
		console.log("5 seconds")
		if (searchCategory.value === '') {
			fetchProducts()
		}
	}, 3000)
}

</script>

<template>
	<h1>Home Page</h1>
	<form @submit.prevent="searchProductByName">
		<input type="text" v-model="searchProduct" placeholder="Search Product" />
		<button type="submit">Search Product</button>
	</form>
	<form @submit.prevent="searchProductByCategory">
		<input type="text" v-model="searchCategory" placeholder="Search Category" />
		<button type="submit">Search Category</button>
	</form>
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