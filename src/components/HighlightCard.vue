<template>
	<div class="wiki-highlight-card">
		<div
			class="wiki-highlight-card-image"
			:style="{ backgroundImage: 'url(' + bigger( image ) + ')' }"
			:alt="title"
		/>
		<div class="wiki-highlight-card-text">
			<h2>{{ title }}</h2>
			<p>{{ text }}</p>
		</div>
	</div>
</template>

<script setup>
defineProps( {
	image: { type: String, required: true },
	title: { type: String, default: null },
	text: { type: String, required: true }
} );

function bigger( url ) {
	return url.replace( '/320px-', '/640px-' );
}
</script>

<style>
.wiki-highlight-card {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
}

.wiki-highlight-card-image {
	background-position: center;
	background-size: cover;
	flex-grow: 1;
}

.wiki-highlight-card-text {
	padding: 20px 20px 40px;
	font-family: serif;
}

.wiki-highlight-card-text h2 {
	font-weight: bold;
	font-family: 'Linux Libertine', 'Georgia', 'Times', 'Source Serif Pro', serif;
}

.wiki-highlight-card-text p {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Lato', 'Helvetica', 'Arial', sans-serif;
	font-size: 1.3em;
}
</style>
