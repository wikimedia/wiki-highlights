<template>
	<main class="wiki-highlight-categories">
		<div
			v-for="( articles, category ) in categories"
			:key="category"
		>
			<h2>{{ category }}</h2>
			<HighlightThumb
				v-for="article in articles"
				:key="article.title"
				:image="source === 'highlights' ? article.highlights[0].image : article.leadImage"
				:title="article.title"
				:text="source === 'highlights' ? article.highlights[0].text : article.summary"
				:source="source"
			/>
		</div>
	</main>
</template>

<script setup>
import HighlightThumb from '../components/HighlightThumb.vue';
import { categories } from '../data.js';
defineProps( {
	source: { type: String, required: true }
} );
</script>

<style>
.wiki-highlight-categories {
	padding: 10px 0 10px 20px;
}
</style>
