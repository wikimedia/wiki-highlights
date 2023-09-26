<template>
	<main class="wiki-highlight-view">
		<div v-for="( highlight, index ) in article.highlights" :key="highlight.image">
			<HighlightCard
				:image="highlight.image"
				:title="index === 0 ? article.title : ''"
				:text="highlight.text"
			/>
		</div>
	</main>
</template>

<script setup>
import HighlightCard from '../components/HighlightCard.vue';
import data from '../data.json';

const props = defineProps( {
	title: {
		type: String,
		required: true
	}
} );

const article = data.articles.find( ( a ) => a.title === props.title );
</script>

<style>
.wiki-highlight-view > div {
	height: 100vh;
}
</style>
