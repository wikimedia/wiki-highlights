<template>
	<div class="article">
		<div class="content">
			<!-- content insertion here -->
		</div>
	</div>
</template>

<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();

const transforms = {
	'put styles in body': ( doc ) => {
		for ( const style of doc.head.querySelectorAll( 'link[rel="stylesheet"]' ) ) {
			doc.body.prepend( style );
		}
	},
	'remove stuff': ( doc ) => {
		const selector = [
			'script',
			'figure',
			'table',
			'sup',
			'.pcs-collapse-table-container',
			'.thumb',
			'.hatnote',
			"[ role='navigation' ]"
		].join( ',' );
		for ( const n of doc.querySelectorAll( selector ) ) {
			n.remove();
		}
	},
	'turn links into plain text': ( doc ) => {
		for ( const a of doc.querySelectorAll( 'a' ) ) {
			a.replaceWith( a.innerHTML );
		}
	},
	'remove sections after fold and the fold itself': ( doc ) => {
		const foldHr = doc.querySelector( '.pcs-fold-hr' );
		for ( const section of doc.querySelectorAll( '.pcs-fold-hr ~ section' ) ) {
			section.remove();
		}
		if ( foldHr ) {
			foldHr.remove();
		}
	}
};

const fetchArticle = function ( title ) {
	const url = `https://en.wikipedia.org/api/rest_v1/page/mobile-html/${title}`;

	fetch( url ).then( ( resp ) => {
		if ( resp.ok ) {
			return resp.text();
		} else {
			throw new Error();
		}
	} ).then( ( html ) => {
		const doc = new DOMParser().parseFromString( html, 'text/html' );
		Object.keys( transforms ).forEach( ( key ) => {
			transforms[ key ]( doc );
		} );

		document.querySelector( '.content' ).innerHTML = doc.body.outerHTML;
	} );

};

fetchArticle( route.params.title );

</script>
