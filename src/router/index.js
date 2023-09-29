import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import HighlightView from '../views/HighlightView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: HomeView
    },
    {
      path: '/highlights',
      component: CategoriesView,
      props: { source: 'highlights' }
    },
    {
      path: '/highlights/:title',
      props: true,
      component: HighlightView
    },
    {
      path: '/articles',
      component: CategoriesView,
      props: { source: 'articles' }
    },
  ]
})

export default router