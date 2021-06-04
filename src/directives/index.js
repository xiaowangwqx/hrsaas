// 负责管理所有自定义指令 

export const imagerror = {
    // 指令对象
    // inserted会在当前dom元素插入到节点之后执行
    inserted(dom, options) {
        // dom表示当前指令作用的dom对象
        // optins 是指令中变量的解释 其中有一个值是value
        dom.onerror = function() {
            // 当图片出现异常 会将指令配置的默认图片设置为该图片的内容
            dom.src = options.value
        }
    }
}