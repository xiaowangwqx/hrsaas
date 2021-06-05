import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'


import * as directives from '@/directives'

import '@/icons' // icon
import '@/permission' // permission control


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

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})