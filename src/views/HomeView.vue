<template>
	<main class="wiki-highlight-home">
		<RouterLink to="/highlights">Highlights</RouterLink>
		<br>
		<RouterLink to="/articles">Articles</RouterLink>
	</main>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style>
.wiki-highlight-home a {
	display: block;
	font-size: 2em;
	text-align: center;
}
</style>
