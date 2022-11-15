import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CustomerView from '../views/CustomerView.vue'
import RequestView from '../views/RequestView.vue'
import UserView from '../views/UserView.vue'
import HomePageView from "@/views/HomePageView";


const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/homepage',
    name: 'homepage',
    component: HomePageView
  },
  {
    path: '/customer',
    name: 'customer',
    component: CustomerView
  },
  {
    path: '/request',
    name: 'request',
    component: RequestView
  },
  {
    path: '/user',
    name: 'user',
    component: UserView
  },


]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
