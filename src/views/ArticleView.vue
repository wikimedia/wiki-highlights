<template>
	<div class="article">
		<div
			ref="contentRef"
			class="content"
			v-html="contentHtml" />
		<div class="footer">
			<!--
				the footer element is copied from the wikipedia website
				keeping the same classname and structure to maintain the same styling
			-->
			<div v-if="relatedArticles" id="mw-data-after-content">
				<div class="read-more-container">
					<h2>Related articles</h2>
					<ul class="ext-related-articles-card-list">
						<li
							v-for="article in relatedArticles"
							:key="article.title"
							:title="article.title"
							class="ext-related-articles-card">
							<a :href="'#/article/' + article.title" @click="goTo( article.title )">
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
							</a>
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { categories, getArticle } from '../data.js';
const route = useRoute();
const contentHtml = ref();
const relatedArticles = ref( [] );
const contentRef = ref();

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
			"[ role='navigation' ]"
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
	'remove "See also" section': ( doc ) => {
		const seeAlsoH2 = doc.querySelector( '#See_also' );
		if ( seeAlsoH2 ) {
			seeAlsoH2.parentElement.parentElement.remove();
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

			if ( !imageSpanNode.parentNode.classList.contains( 'image' ) ) {
				imageSpanNode.parentNode.classList += ' image';
			}

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
		contentHtml.value = html;
	} ).then( () => {
		addEvents( contentRef.value );
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
		window.scrollTo( 0, 0 );
		relatedArticles.value = fetchRelatedArticle( title );
	} );
};

onMounted( function () {
	goTo( route.params.title );
} );

</script>

<style>
.article {
	margin: 20px 0;
}

.figure {
	max-width: 100%;
}

.content a:not( [ href ] ) {
	color: unset;
	cursor: unset;
}

.content a:not( [ href ] ):hover {
	text-decoration: none;
	background-color: unset;
}

.content h2 {
	cursor: pointer;
}

.content h2.pcs-edit-section-title {
	border-bottom: 1px solid #eaecf0;
	margin-bottom: 0.5em;
}

.content h2::before {
	content: '';
	display: inline-block;
	width: 20px;
	height: 20px;
	background-image: url( ../assets/collapse.svg );
	background-size: contain;
	background-repeat: no-repeat;
	margin-right: 10px;
}

.content .collapsible *:not( :first-child ) {
	display: none;
}

.content .collapsible h2::before {
	transform: rotate( 180deg );
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
</style>
