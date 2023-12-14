import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ArticleView from '../views/ArticleView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import HighlightView from '../views/HighlightView.vue'
import { logPageChanged } from '../instrumentation.js'

const router = createRouter( {
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: HomeView
    },
    {
      path: '/highlights',
      name: 'categories_highlights',
      meta: { experiment_group: 'experiment' },
      component: CategoriesView,
      props: { source: 'highlights' }
    },
    {
      path: '/highlights/:title',
      name: 'highlights',
      meta: { experiment_group: 'experiment' },
      props: true,
      component: HighlightView
    },
    {
      path: '/articles',
      name: 'categories_articles',
      meta: { experiment_group: 'control' },
      component: CategoriesView,
      props: { source: 'articles' }
    },
    {
      path: '/article/:title',
      name: 'article',
      meta: { experiment_group: 'control' },
      component: ArticleView
    }
  ]
} )

router.afterEach( logPageChanged )

var isOnIOS = navigator.userAgent.match( /iPad/i ) ||
  navigator.userAgent.match( /iPhone/i ) ||
  navigator.userAgent.match( /iPod/i );
var eventName = isOnIOS ? 'pagehide' : 'beforeunload';
window.addEventListener( eventName, function () {
  const from = router.currentRoute._value
  logPageChanged( null, from )
} );

export default router
