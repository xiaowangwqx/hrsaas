// 负责所有全局自定义组件的注册

import Print from 'vue-print-nb'
import ImageUpload from './ImageUpload'
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'

export default {
    install(Vue) {
        // 组件注册
        Vue.component('PageTools', PageTools)
        Vue.component('UploadExcel', UploadExcel)
        Vue.component('ImageUpload',ImageUpload)
        Vue.use(Print)
    }
}