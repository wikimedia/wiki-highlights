<template>
	<div class="article">
		<div class="content">
			<!-- content insertion here -->
		</div>
		<div class="footer">
			<ul id="footer-info" class="footer-info hlist">
				<li id="footer-info-copyright">
					Content is available under <a
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
	'turn figure into an image': ( doc ) => {
		for ( const figure of doc.querySelectorAll( 'figure' ) ) {
			const newSpanElement = document.createElement( 'span' );
			const imgElement = document.createElement( 'img' );
			imgElement.className = 'figure';
			newSpanElement.innerHTML = figure.innerText;

			// Set the src attribute of the <img> element to the data-src attribute.
			if ( newSpanElement.firstChild && newSpanElement.firstChild.dataset ) {
				imgElement.src = newSpanElement.firstChild.dataset.src;
				figure.firstChild.remove();
				figure.insertBefore( imgElement, figure.firstChild );
			}
		}
	},
	'turn sections into collapsible section': ( doc ) => {
		const sections = doc.querySelectorAll( 'section[data-mw-section-id]' );

		for ( let i = 1; i < sections.length; i++ ) {
			const section = sections[ i ];
			if ( section.parentElement.className.indexOf( 'collapsible' ) === -1 ) {
				section.style.display = 'unset';
				section.classList.add( 'collapsible' );
			} else {
				section.style.display = null;
			}
		}
	}
};

const addEvents = function ( doc ) {
	// add sections collapsible toggle events
	for ( const section of doc.querySelectorAll( '.collapsible' ) ) {
		section.firstChild.onclick = function () {
			section.classList.toggle( 'collapsible' );
		};
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

		// transform response html object
		const doc = new DOMParser().parseFromString( html, 'text/html' );
		Object.keys( transforms ).forEach( ( key ) => {
			transforms[ key ]( doc );
		} );

		document.querySelector( '.content' ).innerHTML = doc.body.outerHTML;

		// add events to document body
		addEvents( document );
	} );

};

fetchArticle( route.params.title );

</script>

<style>
.article {
	margin: 20px 0;
}

.footer {
	margin: 0 3.35em;
}

@media screen and ( max-width: 720px ) {
	.footer {
		margin: 0 16px;
	}
}

.figure {
	max-width: 100%;
}

h2 {
	cursor: pointer;
}

h2::before {
	content: '';
	display: inline-block;
	width: 20px;
	height: 20px;
	background-image: url( ../assets/collapse.svg );
	background-size: contain;
	background-repeat: no-repeat;
	margin-right: 10px;
}

.collapsible *:not( :first-child ) {
	display: none;
}

.collapsible h2::before {
	transform: rotate( 180deg );
}
</style>
