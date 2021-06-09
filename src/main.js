import components from '@/components/index'
import * as directives from '@/directives'
import * as filters from '@/filters'
import '@/icons' // icon
import CheckPermission from '@/mixin/checkPermission'
import '@/permission' // permission control
import '@/styles/index.scss' // global css
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'



// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
// app.use(cors())
// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
    Vue.directive(key, directives[key]) //注册自定义指令
})

// 注册自定义过滤器方法
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.use(components)
// 全局混入检查对象
Vue.mixin(CheckPermission) //所有组件都有这个方法

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})