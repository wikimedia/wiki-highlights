<template>
	<main
		ref="highlightViewRef"
		class="wiki-highlight-view"
		@scroll="updateProgress"
	>
		<div
			class="wiki-highlight-view-topbar"
			:class="progress >= 100 ? 'wiki-highlight-view-topbar-dark' : ''">
			<RouterLink class="wiki-highlight-view-topbar-left" to="/highlights">
				<span class="wiki-highlight-view-topbar-icon" />
			</RouterLink>
			<div v-if="progress >= 100" class="wiki-highlight-view-topbar-center-header">
				Discover more
			</div>
			<div class="wiki-highlight-view-topbar-right" />
		</div>
		<div
			v-for="( highlight, index ) in data.article.highlights"
			:key="highlight.image"
			class="wiki-highlight-view-card"
			:class="index === 0 ? 'wiki-highlight-view-card-first' : ''"
		>
			<HighlightCard
				:image="highlight.image"
				:title="index === 0 ? data.article.title : ''"
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
			<div class="wiki-highlight-thumb-container wiki-highlight-thumb-discover">
				<HighlightThumb
					v-for="relatedArticle in data.allRelatedArticles"
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
import { ref, onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import HighlightCard from '../components/HighlightCard.vue';
import HighlightThumb from '../components/HighlightThumb.vue';
import ProgressBar from '../components/ProgressBar.vue';
import { getArticle, categories, getArticlesExcept } from '../data.js';
import { setScrolledToTheEnd } from '../scrollStatusStore.js';

const props = defineProps( {
	title: {
		type: String,
		required: true
	}
} );

const data = computed( () => {
	const article = getArticle( props.title );
	const category = article.category;
	const otherSameCatArticles = categories[ category ].filter( ( c ) =>
		c.title !== props.title && !c.read
	);
	const allRelatedArticles = otherSameCatArticles.concat(
		...getArticlesExcept( category, 4 - otherSameCatArticles.length )
	);
	const step = 100 / article.highlights.length;

	return { article, allRelatedArticles, step };
} );

const progress = ref( 0 );
const highlightViewRef = ref( null );
function updateProgress() {
	const element = highlightViewRef.value;
	progress.value = data.value.step + Math.ceil( element.scrollTop / element.scrollHeight * 100 );
	if ( progress.value >= 100 ) {
		setScrolledToTheEnd( true );
	}
}
onMounted( updateProgress );
</script>

<style>
.wiki-highlight-view {
	height: calc( 100vh - 110px );
	height: 100dvh;
	overflow-y: scroll;
	scroll-snap-type: y mandatory;
}

.wiki-highlight-view > .wiki-highlight-view-card {
	height: calc( 100vh - 110px );
	height: 100dvh;
	position: relative;
	scroll-snap-stop: always;
	scroll-snap-align: start;
}

.wiki-highlight-view > .wiki-highlight-view-card-first {
	padding-bottom: 50px;
}

.wiki-highlight-view-topbar {
	position: fixed;
	top: 0;
	z-index: 100;
	max-width: 550px;
	width: 100%;
	height: 60px;
	background-image: linear-gradient( to bottom, rgba( 0, 0, 0, 0.8 ), rgba( 0, 0, 0, 0 ) );
	display: flex;
	justify-content: space-between;
}

.wiki-highlight-view-topbar-left,
.wiki-highlight-view-topbar-right {
	width: 45px;
	height: 60px;
}

.wiki-highlight-view-topbar-center-header {
	font-family: serif;
	padding: 14px 10px;
	font-size: 1.5em;
	font-weight: bold;
	color: #202122;
	text-align: center;
}

.wiki-highlight-view-topbar-dark {
	background-image: unset;
}

.wiki-highlight-view-topbar-icon {
	display: inline-block;
	margin: 8px;
	width: 45px;
	height: 45px;
	background-image: url( ../assets/back-arrow-white.svg );
	background-size: 24px;
	background-position: center;
	background-repeat: no-repeat;
}

@media ( prefers-color-scheme: light ) {
	.wiki-highlight-view-topbar-dark .wiki-highlight-view-topbar-icon {
		background-image: url( ../assets/back-arrow-black.svg );
	}
}

.wiki-highlight-view-swipe {
	position: absolute;
	bottom: 25px;
	width: 100%;
	text-align: center;
}

.wiki-highlight-view-more {
	position: absolute;
	bottom: 40px;
	width: 100%;
	color: #54595d;
	text-decoration: underline;
	font-size: 1em;
	font-weight: 600;
	text-align: center;
}

.wiki-highlight-view-progressbar {
	position: fixed;
	bottom: 0;
	width: 100%;
	max-width: 550px;
	overflow: hidden;
}

.wiki-highlight-thumb-container {
	display: flex;
	flex-wrap: wrap;
}

.wiki-highlight-thumb-discover {
	margin-left: 16px;
	margin-bottom: -36px;
	height: 100%;
	place-content: start;
	position: absolute;
	top: 13%;
}

.wiki-highlight-thumb-discover .wiki-highlight-thumb {
	/* 40px view-more bottom px, 60px discover-more padding px */
	max-height: calc( 50vh - 40px - 60px );
	max-height: calc( 50dvh - 40px - 60px );
}

@media ( prefers-color-scheme: dark ) {
	.wiki-highlight-view-topbar-center-header {
		color: #fff;
	}
}
</style>
