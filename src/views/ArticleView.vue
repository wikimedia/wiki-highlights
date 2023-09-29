<template>
	<div class="article">
		<div class="content">
			<!-- content insertion here -->
		</div>
		<div class="footer">
			<ul id="footer-info" class="footer-info hlist">
				<li id="footer-info-copyright">
					Content is available under <a
						class="external"
						rel="nofollow"
						href="https://creativecommons.org/licenses/by-sa/4.0/deed.en">CC BY-SA 4.0</a> unless otherwise noted.
				</li>
				<ul id="footer-places" class="footer-places hlist hlist-separated">
					<li id="footer-places-privacy">
						<a href="https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Privacy_policy">Privacy policy</a>
					</li>
					<li id="footer-places-terms-use">
						<a href="https://mobile.test/wiki/Terms_of_Use">Terms of use</a>
					</li>
				</ul>
			</ul>
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
			'sup',
			'.pcs-collapse-table-container',
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
	'remove sections after fold': ( doc ) => {
		for ( const section of doc.querySelectorAll( '.pcs-fold-hr ~ section' ) ) {
			section.remove();
		}
	},
	'turn sections into collapsable section': ( doc ) => {
		for ( const section of doc.querySelectorAll( 'section' ) ) {
			section.style.display = 'unset';
			// @todo collapsable
		}
	},
	'turn figure into an image': ( doc ) => {
		for ( const figure of doc.querySelectorAll( 'figure' ) ) {
			const newSpanElement = document.createElement( 'span' );
			const imgElement = document.createElement( 'img' );
			newSpanElement.innerHTML = figure.innerText;

			// Set the src attribute of the <img> element to the data-src attribute.
			if ( newSpanElement.firstChild.dataset ) {
				imgElement.src = newSpanElement.firstChild && newSpanElement.firstChild.dataset.src;
				figure.appendChild( imgElement );
			}
			// @todo includes the caption
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

<style scoped>
	.footer {
		margin: 0 auto;
	}
</style>
