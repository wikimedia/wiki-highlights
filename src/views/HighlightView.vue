<template>
	<main class="wiki-highlight-view">
		<div
			v-for="( highlight, index ) in article.highlights"
			:key="highlight.image"
			class="wiki-highlight-view-card"
		>
			<HighlightCard
				:image="highlight.image"
				:title="index === 0 ? article.title : ''"
				:text="highlight.text"
			/>
		</div>
		<div class="wiki-highlight-view-progressbar">
			(progress bar)
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
.wiki-highlight-view {
	height: 100vh;
	overflow-y: scroll;
	scroll-snap-type: y mandatory;
}

.wiki-highlight-view > .wiki-highlight-view-card {
	height: 100vh;
	padding-bottom: 50px;
	scroll-snap-stop: always;
	scroll-snap-align: start;
}

.wiki-highlight-view-progressbar {
	position: fixed;
	width: 50%;
	background-color: #00f;
	bottom: 0;
}
</style>
