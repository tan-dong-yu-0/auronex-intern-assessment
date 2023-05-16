<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

// not using ssr makes the image loading slow
// ssr is used to render the page on the server side
// which means html is rendered on server before sending to client

const product = ref()
const route = useRoute();

onMounted(async () => {
	// retrive the id from the route, can refer to router/index.js
	const productId = route.params.id
	// set the product value to the data from fetchData
	product.value = await fetchData(productId)
})

async function fetchData(productId) {
	// fetch the data dynamically accoridng to the id
	const res = await fetch(`https://dummyjson.com/products/${productId}`)
	// turn data into json format
	const data = await res.json()
	return {
		name: data.title,
		price: data.price,
		image: data.images[0],
		description: data.description,
	}
}

</script>

<template>
	<p>DETAILS</p>
	<!-- for some reason, page can't load without v-if, will thorw error -->
	<div v-if="product">
		<h1>{{ product.name }}</h1>
    <p>Price: RM {{ product.price }}</p>
    <img :src="product.image" :alt="product.name">
    <p>{{ product.description }}</p>
	</div>
</template>

<style scoped></style>