import Vue from 'vue'
import VueRouter from 'vue-router'
import Doc from '../components/Doc.vue'
import Home from '../components/Home.vue'
import Files from '../components/map/Files.vue'
import Edit from '../components/map/Edit.vue'
import Map from '../components/map/Map.vue'
import Users from '../components/user/Users.vue'
import UserInfo from '../components/user/UserInfo.vue'
import Roles from '../components/user/Roles.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: "Doc", component: Doc },
  {
    path: '/home',
    name: "Home",
    component: Home,
    redirect: "/edit",
    children: [
      { path: '/users', name: "Users", component: Users },
      { path: '/userInfo', name: "UserInfo", component: UserInfo },
      { path: '/role', name: "Roles", component: Roles },
      { path: '/files', name: "Files", component: Files },
      { path: '/edit', name: "Edit", component: Edit },
      { path: '/map', name: "Map", component: Map }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
