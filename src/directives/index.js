// 负责管理所有自定义指令 

export const imageerror = {
    // 指令对象
    // inserted会在当前dom元素插入到节点之后执行
    inserted(dom, options) {
        // dom表示当前指令作用的dom对象
        // optins 是指令中变量的解释 其中有一个值是value
        dom.src=dom.src||options.value
        dom.onerror = function() {
            // 当图片出现异常 会将指令配置的默认图片设置为该图片的内容
            dom.src = options.value
        }
    },
    // 该函数与inserted一样是一个钩子函数
    componentUpdated(dom, options) {
        // 在当前指令作用的组件 更新数据完毕之后执行
        // inserted只会执行一次 组件初始化 一旦更新就不会再进入inserted函数 会去执行componentUpdated函数
        dom.src = dom.src || options.value
      }
}