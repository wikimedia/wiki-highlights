<template>
	<div
		class="wiki-highlight-thumb"
		@click="goToHighlight"
	>
		<div
			class="wiki-highlight-thumb-image"
			:style="{ backgroundImage: 'url(' + image + ')' }"
			:alt="title"
		/>
		<div class="wiki-highlight-thumb-text">
			<h2>{{ title }}</h2>
			<p>{{ text }}</p>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const props = defineProps( {
	image: { type: String, required: true },
	title: { type: String, required: true },
	text: { type: String, required: true },
	source: { type: String, required: true }
} );
const router = useRouter();
function goToHighlight() {
	const url = props.source === 'highlights' ? 'highlights/' : 'article/';
	router.push( url + props.title );
}
</script>

<style>
.wiki-highlight-thumb {
	flex: calc( 50% - 16px );
	height: 280px;
	min-width: 150px;
	display: inline-block;
	margin: 0 12px 12px 0;
	overflow: hidden;
	border-radius: 8px;
	border: solid 1px #c8ccd1;
	padding-bottom: 20px;
	box-shadow: 0 1px 1px rgba( 0, 0, 0, 0.2 );
}

.wiki-highlight-thumb-image {
	background-position: center;
	background-size: cover;
	height: 60%;
}

.wiki-highlight-thumb-text {
	padding: 4px 10px 10px;
}

.wiki-highlight-thumb-text h2 {
	color: #202122; /* @todo dark schema */
	font-weight: bold;
	font-size: 1.1em;
}

.wiki-highlight-thumb-text p {
	font-size: 1.1em;
	color: #54595d; /* @todo dark schema */
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
