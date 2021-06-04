//导出员工的路由规则
import Layout from '@/layout'
export default {
    path: '/social',
    component: Layout,
    name: 'social',
    children: [{
        path: '', // 这里当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路由
        component: () =>
            import ('@/views/social'),
        // meta是路由原信息 是一个存贮数据的地方可以存放任何内容
        meta: {
            title: '社保', //左侧导航读取了title里面的数据
            icon: 'table'
        }
    }]
}