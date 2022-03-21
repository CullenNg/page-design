import Vue from 'vue'

/**
 * 获取组件名
 * @param {String} filePath 
 * @returns {String} component_name
 */
const getComponentName = (filePath) => {
    const name = filePath.match(/\/\S*\//)[0].replace(/\//g, '')
    return name
}

// UI组件列表
const libraries = require.context('./library/', true, /index.vue$/);

// 复用元素列表
const units = require.context('./unit/', true, /index.vue$/);

/**
 * 加载组件
 * @param {Fn} resolve 
 */
const requireComponent = (resolve) => {
    resolve.keys().map(filePath => {
        const component_name = getComponentName(filePath)
        const componentConfig = resolve(filePath)
        Vue.component(component_name, componentConfig.default || componentConfig);
    })
}

Vue.use(() => {
    [libraries, units].forEach(item => requireComponent(item))
})
