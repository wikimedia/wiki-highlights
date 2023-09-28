<template>
	<div class="wiki-highlight-progressbar-outer">
		<div
			:style="{ width: progress + '%' }"
			class="wiki-highlight-progressbar-inner"
		/>
	</div>
</template>

<script setup>
defineProps( {
	progress: { type: Number, required: true }
} );
</script>

<style>
.wiki-highlight-progressbar-outer {
	background-color: #808080;
	height: 10px;
}

.wiki-highlight-progressbar-inner {
	background-color: #00f;
	height: 10px;
}
</style>
