<script setup>
import HighlightCard from '../components/HighlightCard.vue'

const data = {
    img: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Lionel_Messi_20180626.jpg',
    title: 'Lionel Messi',
    text: 'A football legend...'
  }

</script>

<template>
  <main>
    <h1>Wiki highlights</h1>
    <HighlightCard :data="data" />
  </main>
</template>
