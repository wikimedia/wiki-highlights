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
	let url;
	switch ( props.source ) {
		case 'highlights':
			url = 'highlights/';
			break;
		case 'self':
			url = '';
			break;
		case 'article':
		default:
			url = 'articles/';
	}
	router.push( url + props.title );
}
</script>

<style>
.wiki-highlight-thumb {
	flex: calc( 50% - 20px );
	height: 280px;
	min-width: 150px;
	display: inline-block;
	margin: 10px 20px 10px 0;
	overflow: hidden;
	border-radius: 10px;
	border: solid 1px #808080;
	padding-bottom: 20px;
}

.wiki-highlight-thumb-image {
	background-position: center;
	background-size: cover;
	height: 60%;
	border-bottom: solid 1px #808080;
}

.wiki-highlight-thumb-text {
	padding: 10px;
}

.wiki-highlight-thumb-text h2 {
	font-weight: bold;
	font-size: 1.2em;
}

.wiki-highlight-thumb-text p {
	font-size: 1.1em;
}
</style>
