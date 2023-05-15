<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');

const url = 'https://dummyjson.com'

const router = useRouter();

async function handleLogin() {
	let authToken;
	const res = await fetch(`${url}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			username: username.value,
			password: password.value,
			// expiresInMins: 60, // optional
		})
	})
	const data = await res.json()
	if (res.ok) {
		authToken = data.token;
		router.push('/');
		console.log(data)
	} else {
		console.log(data)
	}
	// use await to pause execution  because i will need authToken for later


	// use authToken to make a request to the /login endpoint
	if (authToken) {
		fetch(`http://localhost:5173/login`, {
			method: "GET",
			headers: {
				'Authorization': `Bearer ${authToken}`,
				'Content-Type': 'application/json'
			}
		})
			.then(res => res.json())
			.then(console.log)
			.catch(error => {
				console.error("ERROR", error);
			});
	}
}
</script>

<template>
	<p>Use This</p>
	<p>Name: atuny0, Password: 9uQFF1Lh</p>
	<form @submit.prevent="handleLogin">
		<input type="text" v-model="username" placeholder="Username" />
		<br>
		<input type="password" v-model="password" placeholder="Password" />
		<br>
		<button class="submit-button" type="submit">Login</button>
	</form>
</template>

<style scoped>
input {
	height: 20px;
	margin-bottom: 10px;
	font-size: large;
	font-weight: 500;
}

button {
	font-size: larger;
	font-weight: 700;
}
</style>