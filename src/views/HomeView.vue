<template>
	<main>
		<h1>Wiki highlights</h1>
		<div v-for="article in data.articles" :key="article.title">
			<span>{{ article.category }}</span>&nbsp;&mdash;&nbsp;
			<a :href="'#/highlights/' + article.title">{{ article.title }}</a>
		</div>
	</main>
</template>

<script setup>
import data from '../data.json';
</script>
