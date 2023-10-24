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
			url = 'article/';
	}
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
	margin: 8px;
	display: -webkit-box;
	-webkit-line-clamp: 4;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.wiki-highlight-thumb-text > h2 {
	font-family: 'Linux Libertine', 'Georgia', 'Times', 'Source Serif Pro', serif;
	color: #202122;
	font-weight: bold;
	font-size: 1.1em;
}

.wiki-highlight-thumb-text p {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Lato',
		'Helvetica','Arial',sans-serif;
	font-size: 1.1em;
	color: #54595d;
}

@media ( prefers-color-scheme: dark ) {
	.wiki-highlight-thumb-text > h2 {
		color: #eaecf0;
	}

	.wiki-highlight-thumb {
		border-color: #72777d;
		box-shadow: 0 1px 1px #fff3;
	}

	.wiki-highlight-thumb-text p {
		color: #c8ccd1;
	}
}
</style>
