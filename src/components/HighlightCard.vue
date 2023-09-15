<template>
	<div class="wiki-highlight-card">
		<img
			class="wiki-highlight-card-image"
			:src="content.img"
			alt="messi">
		<div class="wiki-highlight-card-title">
			{{ content.title }}
		</div>
		<div>{{ content.text }}</div>
	</div>
</template>

<script setup>
defineProps( {
	content: {
		type: Object,
		default: null
	}
} );
</script>

<style>
    .wiki-highlight-card {
        height: 600px;
        width: 300px;
        display: flex;
        flex-direction: column;
    }

    .wiki-highlight-card-image {
        border-radius: 20px;
    }

    .wiki-highlight-card-title {
        font-weight: bold;
    }
</style>
