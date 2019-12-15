import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)
const Layout = () =>
    import('@/views/Layout')
const Home = () =>
    import('@/views/home')
const Question = () =>
    import('@/views/question/index')
const Video = () =>
    import('@/views/video/index')
const User = () =>
    import('@/views/user/index')
const UserProfile = () =>
    import('@/views/user/profile')
const UserChat = () =>
    import('@/views/user/chat')
const Login = () =>
    import('@/views/user/login')
const Search = () =>
    import('@/views/search/index')
const SearchResult = () =>
    import('@/views/search/result')
const Article = () =>
    import('@/views/home/article')

const routes = [{
  path: '/',
  component: Layout,
  children: [
    { path: '/', name: 'home', component: Home, meta: { iskeepAlive: true } },
    { path: '/question', name: 'question', component: Question },
    { path: '/video', name: 'video', component: Video },
    { path: '/user', name: 'user', component: User }
  ]
},
{ path: '/user/profile', name: 'user-profile', component: UserProfile },
{ path: '/user/chat', name: 'user-chat', component: UserChat },
{ path: '/login', name: 'login', component: Login },
{ path: '/search', name: 'search', component: Search },
{ path: '/search/result', name: 'search-result', component: SearchResult },
{ path: '/article/:id', name: 'article', component: Article, meta: { iskeepAlive: true } }
]

const router = new VueRouter({
  routes
})
// 导航守卫拦截登录
router.beforeEach((to, from, next) => {
  // 当未登录且页面为(个人中心/user，编辑资料/user/profile,小智同学/user/chat)
  const { user } = store.state
  if (!user.token && to.path.startsWith('/user')) {
    // 实现登录后回跳，把当前想访问的地址传递给登录页面
    // 访问/user开头的路径需要判断是否登录
    return next({ path: '/login', query: { redirectUrl: to.path } })
  }
  next() // 默认放行
})
export default router
