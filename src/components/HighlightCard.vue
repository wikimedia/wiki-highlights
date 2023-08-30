<script setup>
    const props = defineProps(['content'])
</script>
<template>
    <div class="wiki-highlight-card">
        <img class="wiki-highlight-card-image" :src="props.content.img" alt="messi">
        <div class="wiki-highlight-card-title">{{props.content.title}}</div>
        <div>{{props.content.text}}</div>
    </div>
</template>

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
