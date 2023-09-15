<template>
	<main>
		<h1>Wiki highlights</h1>
		<div v-for="content in data.content" :key="content.title">
			<HighlightCard :content="content" />
		</div>
	</main>
</template>

<script setup>
import HighlightCard from '../components/HighlightCard.vue';
import data from '../data.json';
</script>
