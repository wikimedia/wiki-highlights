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
	text: { type: String, required: true }
} );
const router = useRouter();
function goToHighlight() {
	router.push( 'highlights/' + props.title );
}
</script>

<style>
.wiki-highlight-thumb {
	height: 280px;
	min-width: 166px;
	max-width: 266px;
	display: inline-block;
	margin: 10px 20px 10px 0;
	width: calc( 50% - 20px );
	overflow: hidden;
	border-radius: 10px;
	border: solid 1px #808080;
	padding-bottom: 20px;
}

.wiki-highlight-thumb-image {
	background-position: center;
	background-size: cover;
	height: 60%;
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
