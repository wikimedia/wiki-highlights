<script setup>
    import { ref } from 'vue'
    
    const props = defineProps(['data'])
    const card = ref(props.data)
</script>
<template>
    <div class="wiki-highlight-card">
        <img class="wiki-highlight-card-image" :src="card.img" alt="messi">
        <div class="wiki-highlight-card-title">{{card.title}}</div>
        <div>{{card.text}}</div>
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
