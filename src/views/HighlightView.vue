<template>
	<main
		ref="highlightViewRef"
		class="wiki-highlight-view"
		@scroll="updateProgress"
	>
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
		<ProgressBar
			:progress="progress"
			class="wiki-highlight-view-progressbar"
		/>
	</main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import HighlightCard from '../components/HighlightCard.vue';
import ProgressBar from '../components/ProgressBar.vue';
import data from '../data.json';

const props = defineProps( {
	title: {
		type: String,
		required: true
	}
} );

const article = data.articles.find( ( a ) => a.title === props.title );

const step = 100 / article.highlights.length;
const progress = ref( 0 );
const highlightViewRef = ref( null );
function updateProgress() {
	const element = highlightViewRef.value;
	progress.value = step + Math.ceil( element.scrollTop / element.scrollHeight * 100 );
}
onMounted( updateProgress );
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
	bottom: 0;
	width: calc( 100% - 20px );
	margin: 10px;
}
</style>