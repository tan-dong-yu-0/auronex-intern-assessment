<script setup>
import { ref, onMounted } from 'vue';
import router from '../router';

const products = ref([])
const currentPage = ref(1)
const searchProduct = ref('')
const searchCategory = ref('')

onMounted(async () => {
	fetchProducts()
})

const authToken = sessionStorage.getItem('authToken');
async function fetchProducts() {
	// if on 1st page skip none
	// if on 2nd page skip first 10
	// if on 3rd page skip first 20
	const res = await fetch(`https://dummyjson.com/auth/products?limit=10&skip=${(currentPage.value - 1) * 10}`, {
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + authToken,
			'Content-Type': 'application/json',
		}
	})
	const data = await res.json()
	products.value = data.products.map(product => ({
		id: product.id,
		name: product.title,
		image: product.images[0],
		price: product.price,
		category: product.category,
	}));
	// console.log(products.value)
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

function signOut() {
	sessionStorage.removeItem('authToken');
	router.push('/');
}

function setTimeOut(searchOption, duration) {
	setTimeout(() => {
		console.log("5 seconds")
		if (searchOption.value === '') {
			fetchProducts()
		}
	}, duration)
}

function searchProductByName() {

	clearTimeout()
	// fetch products by name
	fetch(`https://dummyjson.com/auth/products/search?q=${searchProduct.value}`, {
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + authToken,
			'Content-Type': 'application/json',
		}
	})
		// return the response as json
		.then(res => res.json())
		// not using filter because we need all the element
		// filter will only return the element that matches the condition
		.then(data => {
			products.value = data.products.map(product => ({
				id: product.id,
				name: product.title,
				image: product.images[0],
				price: product.price,
				category: product.category,
			}));
			console.log(data)
		});

	setTimeOut(searchProduct, 3000)
}

function searchProductByCategory() {

	clearTimeout()

	fetch(`https://dummyjson.com/auth/products/category/${searchCategory.value}`, {
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + authToken,
			'Content-Type': 'application/json',
		}
	})
		.then(res => res.json())
		.then(data => {
			products.value = data.products.map(product => ({
				id: product.id,
				name: product.title,
				image: product.images[0],
				price: product.price,
				category: product.category,
			}));
		});

	setTimeOut(searchCategory, 4000)
}

function sortByPriceAscending() {
	// if a - b equals to negative number, swap a and b
	// if a - b equals to positive number, remain unchanged
	products.value.sort((a, b) => a.price - b.price)
}

function sortByPriceDescending() {
	// if b - a equals to negative number, remain unchanged
	// if b - a equals to positive number, swap a and b
	products.value.sort((a, b) => b.price - a.price)
}

function sortByRelevance() {
	products.value.sort((a, b) => {
		return a.name.length - b.name.length;
	});
}

</script>

<template>
	<div v-if="authToken">
		<h1>Home Page</h1>
		<button @click="signOut">Sign Out</button>
		<button @click="sortByRelevance">Sort By Relevance</button>
		<button @click="sortByPriceAscending">Sort in Ascending order</button>
		<button @click="sortByPriceDescending">Sort in Descending order</button>
		<form @submit.prevent="searchProductByName">
			<input type="text" v-model="searchProduct" placeholder="Search Product" />
			<button type="submit">Search Product</button>
		</form>
		<form @submit.prevent="searchProductByCategory">
			<input type="text" v-model="searchCategory" placeholder="Search Category" />
			<button type="submit">Search Category</button>
		</form>
		<div class="card-container">
			<router-link v-for="product in products" :key="product.name" :to="`/product/${product.id}`">

				<div class="list-items">
					<img :src="product.image" :alt="product.name">
					<p>{{ product.name }}</p>
					<p>RM {{ product.price }}</p>
					<p>{{ product.category }}</p>
				</div>
			</router-link>
		</div>
		<div class="navigate-button">
			<button @click="previousPage">Previous Page</button>
			<button @click="nextPage">Next Page</button>
		</div>
	</div>
	<h2 v-else>You Do Not Have Authenticated Token!</h2>
</template>

<style scoped>
img {
	height: 150px;
	width: 180px;
}

.card-container {
	display: flex;
	/* flex-direction: column; */
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	/* justify-content: space-around; */
}

.navigate-button>button {
	font-weight: 700;
	background-color: #dfdfdf;
}

.list-items {
	text-decoration: none;
	color: black;
	/* flex-basis: 20%; */
	/* display: flex; */
	/* flex-direction: column; */
}

/* how to wrap the ul to dislay 5 columns and 2 rows */
/* ul {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	grid-template-rows: repeat(2, 1fr);
} */
</style>