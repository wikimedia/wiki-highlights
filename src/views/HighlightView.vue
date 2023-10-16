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
			<div
				v-if="index === 0"
				class="wiki-highlight-view-swipe"
			>
				Swipe up for more
			</div>
		</div>
		<div class="wiki-highlight-view-card">
			<div class="wiki-hightlight-thumb-container wiki-highlight-thumb-discover">
				<HighlightThumb
					v-for="relatedArticle in allRelatedArticles"
					:key="relatedArticle.title"
					:image="relatedArticle.highlights[0].image"
					:title="relatedArticle.title"
					:text="relatedArticle.highlights[0].text"
					source="self"
				/>
			</div>
			<RouterLink to="/highlights" class="wiki-highlight-view-more">
				See all Wikihighlights
			</RouterLink>
		</div>
		<ProgressBar
			:progress="progress"
			class="wiki-highlight-view-progressbar"
		/>
	</main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import HighlightCard from '../components/HighlightCard.vue';
import HighlightThumb from '../components/HighlightThumb.vue';
import ProgressBar from '../components/ProgressBar.vue';
import { getArticle, categories, getArticlesExcept } from '../data.js';

const props = defineProps( {
	title: {
		type: String,
		required: true
	}
} );
const article = getArticle( props.title );
const category = article.category;
const otherSameCatArticles = categories[ category ].filter( ( c ) => c.title !== props.title );
const allRelatedArticles = otherSameCatArticles.concat(
	...getArticlesExcept( category, 4 - otherSameCatArticles.length )
);
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

.wiki-highlight-view-swipe {
	text-align: center;
}

.wiki-highlight-view-more {
	display: block;
	width: 100%;
	color: #36c;
	font-size: 1em;
	text-align: center;
}

.wiki-highlight-view-progressbar {
	position: fixed;
	bottom: 0;
	width: 100%;
	max-width: 550px;
}

.wiki-hightlight-thumb-container {
	display: flex;
	flex-wrap: wrap;
}

.wiki-highlight-thumb-discover {
	margin-left: 20px;
	height: 100%;
	place-content: start;
}
</style>
