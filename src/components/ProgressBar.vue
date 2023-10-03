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
	background-color: #eaecf0;
	height: 8px;
}

.wiki-highlight-progressbar-inner {
	background-color: #36c;
	height: 8px;
}
</style>
