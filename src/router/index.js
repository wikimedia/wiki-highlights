import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ArticleView from '../views/ArticleView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import HighlightView from '../views/HighlightView.vue'
import {
  hasScrolledToTheEnd,
  setScrolledToTheEnd
} from '../scrollStatusStore.js'

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
      meta: { experiment_group: 'treatment' },
      component: CategoriesView,
      props: { source: 'highlights' }
    },
    {
      path: '/highlights/:title',
      name: 'highlights',
      meta: { experiment_group: 'treatment' },
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
      component: ArticleView
    }
  ]
} )

const makeSessionId = () => crypto.randomUUID().replace( /-/g, '' )
let sessionId = makeSessionId()
let sessionHandle = null
const getSessionId = () => {
  clearTimeout( sessionHandle )
  sessionHandle = setTimeout(
    () => { sessionId = makeSessionId() },
    30 * 60 * 1000 // 30 minutes
  )
  return sessionId
}

let time
router.afterEach( ( to, from ) => {
  const now = Date.now()

  if ( from.name ) {
    send( {
      event_type: 'pageUnload',
      page_name: from.params.title || from.name,
      experiment_group: from.meta.experiment_group,
      session_id: getSessionId(),
      time_length_ms: now - time,
      page_bottom_was_visible: hasScrolledToTheEnd()
    } )
  }

  if ( to.name ) {
    send( {
        event_type: 'pageLoad',
        page_name: to.params.title || to.name,
        experiment_group: to.meta.experiment_group,
        session_id: getSessionId()
    } )
  }

  time = now
  setScrolledToTheEnd( false )
} )

const send = ( event ) => {
  const intakeUrl = 'https://intake-logging.wikimedia.org/v1/events' //?hasty=true
  event.$schema = '/analytics/external/wiki_highlights_experiment/1.0.0'
  event.meta = {
    stream: 'inuka.wiki_highlights_experiment',
    domain: 'wikimedia.github.io',
    dt: new Date().toISOString()
  }
  navigator.sendBeacon( intakeUrl, JSON.stringify( event ) )
  console.log( event )
}

export default router
