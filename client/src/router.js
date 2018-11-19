import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import articlePage from './views/articlePage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/articles',
      name: 'articles',
      component: articlePage,
      children: [
        {
          name: 'detailArticle',
          path: ':id',
          component: () => import('./components/DetailArticle.vue')
        }
      ]
    }
  ]
})
