import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setScrolledToTheEnd } from './scrollStatusStore.js'

const app = createApp(App)

app.use(router)

app.mount('#app')

window.onscroll = function( e ) {
	if ( document.querySelector( '.wiki-highlight-view' ) ) {
		// Special case: the highlight view is not scrollable.
		// It has a container that is made scrollable for the
		// scroll-snap to work. As a result, the code below would
		// assume that it is always scolled to the end.
		// The highlight view has a separate implementation
		// of the 'scrolled to the end' check.
		return;
	}
	const pos = window.innerHeight + Math.round( document.documentElement.scrollTop )
	const total = document.body.offsetHeight
	if ( pos >= total ) {
		setScrolledToTheEnd( true )
	}
}
