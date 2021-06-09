//导出员工的路由规则
import Layout from '@/layout'
export default {
    path: '/employees',
    component: Layout,
    name: 'employees',
    children: [{
        path: '', // 这里当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路由
        component: () =>
            import('@/views/employees'),
        // meta是路由原信息 是一个存贮数据的地方可以存放任何内容
        meta: {
            title: '员工管理', //左侧导航读取了title里面的数据
            icon: 'people'
        },
    }, {
        path: 'detail/:id?', //？表示该参数可传可不穿
        component: () => import('@/views/employees/detail'),
        hidden: true,
        meta: {
            title: '员工详情',
        }
    }, {
        path: 'print/:id',
        component: () => import('@/views/employees/print'),
        hidden: true,
        meta: {
            title: '员工打印'
        }
    }
    ]
}