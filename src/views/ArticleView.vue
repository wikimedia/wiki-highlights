<template>
	<div
		v-if="data.loaded"
		class="article"
	>
		<header>{{ route.params.title }}</header>
		<RouterLink to="/articles" class="navicon" />
		<div
			ref="contentRef"
			class="content"
			v-html="data.articleHtml" />
		<div class="footer">
			<!--
				the footer element is copied from the wikipedia website
				keeping the same classname and structure to maintain the same styling
			-->
			<div id="mw-data-after-content">
				<div class="read-more-container">
					<h2>Related articles</h2>
					<ul class="ext-related-articles-card-list">
						<li
							v-for="article in data.relatedArticles"
							:key="article.title"
							:title="article.title"
							class="ext-related-articles-card">
							<RouterLink :to="'/article/' + article.title">
								<div
									class="ext-related-articles-card-thumb"
									:style="{
										backgroundImage: 'url(' +
											article.highlights[ 0 ].image +
											')'
									}"
								/>
								<div class="ext-related-articles-card-detail">
									<h3>{{ article.title }}</h3>
									<p class="ext-related-articles-card-extract">
										{{ article.highlights[ 0 ].text }}
									</p>
								</div>
							</RouterLink>
						</li>
					</ul>
				</div>
			</div>
			<ul id="footer-info" class="footer-info hlist">
				<li id="footer-info-copyright">
					Content is available under <a
						rel="nofollow"
						href="https://creativecommons.org/licenses/by-sa/4.0/deed.en">CC BY-SA 4.0</a>, unless otherwise noted.
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
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { categories, getArticle } from '../data.js';
const route = useRoute();
const contentRef = ref();
const data = ref( { loaded: false } );

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
			'.pcs-edit-section-link-container',
			'.hatnote',
			"[ role='navigation' ]",
			'header'
		].join( ',' );
		for ( const n of doc.querySelectorAll( selector ) ) {
			n.remove();
		}
	},
	'turn links into plain text': ( doc ) => {
		for ( const a of doc.querySelectorAll( 'a' ) ) {
			a.removeAttribute( 'href' );
		}
	},
	'remove sections after fold': ( doc ) => {
		for ( const section of doc.querySelectorAll( '.pcs-fold-hr ~ section' ) ) {
			section.remove();
		}
	},
	'remove "See also" "Notes" section': ( doc ) => {
		const seeAlsoH2 = doc.querySelector( '#See_also' );
		if ( seeAlsoH2 ) {
			seeAlsoH2.parentElement.parentElement.remove();
		}
		const NotesH2 = doc.querySelector( '#Notes' );
		if ( NotesH2 ) {
			NotesH2.parentElement.parentElement.remove();
		}
	},
	'turn figure into an image': ( doc ) => {
		// enable lazyload image
		const imageSpanNodes = doc.querySelectorAll( 'span.pcs-lazy-load-placeholder' );
		for ( const imageSpanNode of imageSpanNodes ) {
			const source = imageSpanNode.getAttribute( 'data-src' );
			const image = document.createElement( 'img' );
			image.src = source;
			image.height = imageSpanNode.getAttribute( 'data-height' );
			imageSpanNode.parentNode.appendChild( image );
			imageSpanNode.remove();
		}
	},
	'turn sections into collapsible section': ( doc ) => {
		const sections = doc.querySelectorAll( 'section' );
		for ( let i = 1; i < sections.length; i++ ) {
			sections[ i ].style.removeProperty( 'display' );
		}

		const sectionTitle = doc.querySelectorAll( 'h2' );
		for ( let i = 0; i < sectionTitle.length; i++ ) {
			const section = sectionTitle[ i ].parentElement.parentElement;
			section.style.display = 'unset';
			section.classList.add( 'collapsible' );
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

	return fetch( url ).then( ( resp ) => {
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

		return doc.body.outerHTML;
	} ).then( ( html ) => {
		data.value.articleHtml = html;
	} );

};

const fetchRelatedArticle = function ( title ) {
	const articleObject = getArticle( title );

	if ( articleObject ) {
		const category = articleObject.category;
		const allRelatedArticles = categories[ category ].filter( ( c ) => c.title !== title );
		return allRelatedArticles.slice( 0, 3 );

	}
};

const goTo = function ( title ) {
	fetchArticle( title ).then( () => {
		data.value.relatedArticles = fetchRelatedArticle( title );
		data.value.loaded = true;
		nextTick( () => {
			addEvents( contentRef.value );
		} );
	} );
};

onMounted( function () {

	// overwrite <body> styling from base.css
	document.body.style.fontSize = 'unset';

	goTo( route.params.title );
} );

</script>

<style scoped>
header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	font-size: 2em;
	text-align: center;
	background-color: var( --color-background );
	border-bottom: solid 1px var( --color-border );
	z-index: 2;
}

.navicon {
	position: fixed;
	top: 0;
	left: 0;
	height: 45px;
	width: 45px;
	background-image: url( ../assets/back-arrow-black.svg );
	background-repeat: no-repeat;
	background-size: 25px;
	background-position: 16px center;
	z-index: 3;
}

.article {
	margin: 3em 0;
}

.content :deep( a:not( [ href ] ) ) {
	color: unset;
	cursor: unset;
}

.content :deep( a:not( [ href ] ):hover ) {
	text-decoration: none;
	background-color: unset;
}

.content :deep( h2 ) {
	cursor: pointer;
}

.content :deep( h2.pcs-edit-section-title ) {
	border-bottom: 1px solid #eaecf0;
	margin-bottom: 0.5em;
}

.content :deep( h2::before ) {
	content: '';
	display: inline-block;
	width: 16px;
	height: 16px;
	background-image: url( ../assets/collapse.svg );
	background-size: contain;
	background-repeat: no-repeat;
	margin-right: 6px;
	margin-top: 6px;
}

@media ( prefers-color-scheme: dark ) {
	.navicon {
		background-image: url( ../assets/back-arrow-white.svg );
	}

	.content :deep( h2::before ) {
		background-image: url( ../assets/collapse-light.svg );
	}
}

.content :deep( .collapsible *:not( :first-child  ) ) {
	display: none;
}

.content :deep( .collapsible h2::before ) {
	transform: rotate( 180deg );
}

.content :deep( hr.pcs-fold-hr ) {
	margin: 12px 0 16px;
	width: 60px;
}

.footer {
	margin: 0 3.35em;
}

@media screen and ( max-width: 720px ) {
	.footer {
		margin: 0 16px;
	}
}

@media screen and ( min-width: 1000px ) {
	.footer {
		margin-left: auto;
		margin-right: auto;
		width: 90%;
		max-width: 993.3px;
	}
}

.footer .ext-related-articles-card-list {
	display: flex;
	flex-flow: row wrap;
	font-size: 1em;
	list-style: none;
	overflow: hidden;
	position: relative;
	padding-left: 0;
}

.footer .ext-related-articles-card-list .ext-related-articles-card {
	background-color: #fff;
	box-sizing: border-box;
	margin: 0;
	height: 80px;
	position: relative;
	width: 100%;
	border: 1px solid rgba( 0, 0, 0, 0.2 );
}

.footer .ext-related-articles-card-list .ext-related-articles-card-thumb {
	background-color: #eaecf0;
	background-repeat: no-repeat;
	background-position: center center;
	background-size: cover;
	float: left;
	height: 100%;
	width: 80px;
	margin-right: 10px;
}

.footer .ext-related-articles-card-list .ext-related-articles-card > a {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 1;
}

.footer .ext-related-articles-card-list .ext-related-articles-card-detail {
	position: relative;
	top: 50%;
	transform: translateY( -50% );
}

.footer .ext-related-articles-card-list h3 {
	font-family: inherit;
	font-size: 1em;
	max-height: 2.6em;
	line-height: 1.3;
	margin: 0;
	overflow: hidden;
	padding: 0;
	position: relative;
	font-weight: 500;
}

.footer .ext-related-articles-card-list .ext-related-articles-card-extract {
	color: #54595d;
	font-size: 0.8em;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin-top: 2px;
}

.footer .read-more-container h2 {
	color: #54595d;
	border-bottom: 0;
	padding-bottom: 0.5em;
	font-size: 0.8em;
	font-weight: normal;
	letter-spacing: 1px;
	text-transform: uppercase;
}

.footer .footer-info {
	margin-top: 15px;
}
</style>
