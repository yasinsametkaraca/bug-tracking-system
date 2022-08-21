import { createRouter, createWebHistory } from 'vue-router'
import LoginComp from "@/components/LoginComp"
import homeView from "@/views/HomeView";
const routes = [

  {
    path: '/login',
    name: 'LoginComp',
    component: LoginComp
  },
  {
    path: '/',
    name:'HomeView',
    component: homeView
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


router.beforeEach((to, from, next) => {
  let user=localStorage.getItem("user-info")
  if (to.name !== 'LoginComp' && !user) next({ name: 'LoginComp' })
  else next()
})



export default router
