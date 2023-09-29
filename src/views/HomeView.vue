<template>
	<main class="wiki-highlight-home">
		<div
			v-for="( articles, category ) in categories"
			:key="category"
		>
			<h2>{{ category }}</h2>
			<HighlightThumb
				v-for="article in articles"
				:key="article.title"
				:image="article.highlights[0].image"
				:title="article.title"
				:text="article.highlights[0].text"
			/>
		</div>
	</main>
</template>

<script setup>
import HighlightThumb from '../components/HighlightThumb.vue';
import { categories } from '../data.js';
</script>

<style>
.wiki-highlight-home {
	padding: 10px 0 10px 20px;
}
</style>
