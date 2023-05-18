<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// did a mistake of not adding /auth/RESOURCES in the fetch url, 
// fetching /RESOURCES without /auth/ will just fetch you data
// that is not authenticated

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
			expiresInMins: 60, // optional
		})
	})
	const data = await res.json();

	if (res.ok) {
		authToken = data.token;
		const userId = data.id;
		// set to session storage so i could access it from the other page
		sessionStorage.setItem('authToken', authToken);
		await router.push('/home');
		console.log("User: ", data)
	} else {
		console.log(data)
	}
}
</script>

<template>
	<p>Use These</p>
	<p>User1: atuny0, 9uQFF1Lh</p>
	<p>User2: hbingley1, CQutx25i8r</p>
	<p>User3: rshawe2, OWsTbMUgFc</p>
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
