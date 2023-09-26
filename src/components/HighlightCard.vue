<template>
	<div class="wiki-highlight-card">
		<div
			class="wiki-highlight-card-image"
			:style="{ backgroundImage: 'url(' + image + ')' }"
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
	font-size: 1.6em;
	padding: 20px;
}
</style>
