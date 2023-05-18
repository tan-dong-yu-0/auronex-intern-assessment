<script setup>
import { ref, onMounted } from 'vue';
import router from '../router';
import { useRoute } from 'vue-router';

// user cart will be gone if refresh the page
// because it is not stored in the database

const products = ref([])
const currentPage = ref(1)
const searchProduct = ref('')
const searchCategory = ref('')
const userCart = ref([])
const route = useRoute();
const isCartOpen = ref(false)

onMounted(async () => {
	fetchProducts()
	console.log("UserCart", userCart.value)
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
	console.log(data)
	products.value = data.products.map(product => ({
		id: product.id,
		name: product.title,
		image: product.images[0],
		price: product.price,
		category: product.category,
		discountPercentage: product.discountPercentage,
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
	clearTimeout()
	setTimeout(() => {
		if (searchOption.value === '') {
			console.log("4 seconds")
			fetchProducts()
		}
	}, duration)
}

function searchProductByName() {
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

	setTimeOut(searchProduct, 4000)
}

function searchProductByCategory() {
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
	// sort by name length
	// ideal implementation would be
	// there should only be one search box instead of two
	// based on the search value, it will search for the product name and category
	// and then sort it by how close the search value is to the product name and category
	// or you can give number for them to rank it
	products.value.sort((a, b) => {
		return a.name.length - b.name.length;
	});
}

function viewProductDetails(productId) {
	router.push(`/product/${productId}`)
}

function addToCart(productId, productName, productImage) {
	const itemInCart = userCart.value.find(item => item.id === productId)

	if (itemInCart) {
		itemInCart.quantity += 1;
	} else {
		userCart.value.push(
			{
				id: productId,
				name: productName,
				image: productImage,
				quantity: 1
			}
		)
	}

	console.log(userCart.value)
}

function toggleCart() {
	isCartOpen.value = !isCartOpen.value
}
</script>

<template>
	<div v-if="authToken">
		<!-- cart -->
		<div class="cart-container">
			<button class="cart-toggle" @click="toggleCart">Cart</button>
			<div class="cart-sidebar" :class="{ 'cart-sidebar-open': isCartOpen }">
				<div class="cart-items">
					<div v-for="item in userCart" :key="item.id">
						<img :src="item.image" :alt="item.name">
						<p>Name: {{ item.name }}</p>
						<p>Quantity: {{ item.quantity }}</p>
					</div>
				</div>
			</div>
		</div>

		<h1>Home Page</h1>
		<button class="signout-button" @click="signOut">Sign Out</button>
		<div class="sort-buttons-container">
			<div class="sort-buttons">
				<button @click="sortByRelevance">Sort By Relevance</button>
				<button @click="sortByPriceAscending">Sort Price in Ascending order</button>
				<button @click="sortByPriceDescending">Sort Price in Descending order</button>
			</div>
		</div>
		<div class="form-container">
			<form @submit.prevent="searchProductByName">
				<input type="text" v-model="searchProduct" placeholder="Search Product" />
				<button type="submit">Search Product</button>
			</form>
			<form @submit.prevent="searchProductByCategory">
				<input type="text" v-model="searchCategory" placeholder="Search Category" />
				<button type="submit">Search Category</button>
			</form>
		</div>

		<div class="card-container">
			<div v-for="product in products" :key="product.name" @click="viewProductDetails(product.id)">
				<div class="list-items">
					<img :src="product.image" :alt="product.name">
					<p>Name: {{ product.name }}</p>
					<p>RM {{ product.price }}</p>
					<p>Category: {{ product.category }}</p>
					<button @click.stop="addToCart(product.id, product.name, product.image)">Add To Cart</button>
				</div>
			</div>
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

.cart-toggle {
	position: fixed;
	top: 20px;
	right: 20px;
	z-index: 999;
	padding: 10px 20px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
}

.cart-sidebar {
	position: fixed;
	top: 0;
	right: -300px;
	/* Initially hidden */
	width: 300px;
	height: 100vh;
	background-color: #fff;
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
	transition: right 0.3s ease-in-out;
}

.cart-sidebar-open {
	right: 0;
	/* Slide in from the right */
}

.cart-items {
	padding: 20px;
	max-height: 100%;
	/* Set the maximum height of the cart items container */
	overflow-y: auto;
	/* Enable vertical scrolling when content exceeds the maximum height */
}

.signout-button {
	position: fixed;
	top: 20px;
	left: 20px;
	/* height: 100vh; */
}

.sort-buttons-container {
	display: flex;
	/* flex-direction: column; */
	/* justify-content: end; */
	max-width: 200px;
}

.sort-buttons>button {
	/* min-width: 200px; */
	font-weight: 700;
	background-color: #dfdfdf;

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
	/* text-decoration: none; */
	color: black;
	margin-left: 20px;
	margin-right: 20px;
	margin-bottom: 20px;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
	/* flex-basis: 20%; */
	/* display: flex; */
	/* flex-direction: column; */
}

.list-items>p {
	display: flex;
	margin: 0;
}

.list-items>button {
	border-radius: 0;
	background: #dfdfdf;
	margin-top: 15px;
	width: 100%;
}

/* how to wrap the ul to dislay 5 columns and 2 rows */
/* ul {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	grid-template-rows: repeat(2, 1fr);
} */
</style>