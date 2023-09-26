<template>
	<main>
		<h1>Wiki highlights</h1>
		<div v-for="( articles, category ) in categories" :key="category">
			<h2>{{ category }}</h2>
			<div v-for="article in articles" :key="article.title">
				<span>{{ article.title }}</span>
				&nbsp;(
				<a :href="'#/highlights/' + article.title">
					{{ article.highlights.length }} highlights
				</a>
				)
			</div>
		</div>
	</main>
</template>

<script setup>
import data from '../data.json';
const groupBy = function ( xs, key ) {
	return xs.reduce( function ( rv, x ) {
		( rv[ x[ key ] ] = rv[ x[ key ] ] || [] ).push( x );
		return rv;
	}, {} );
};
const categories = groupBy( data.articles, 'category' );
</script>
