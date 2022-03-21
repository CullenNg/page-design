import Vue from 'vue'

/**
 * 获取组件名
 * @param {String} filePath 
 * @returns {String} component_name
 */
const getComponentName = (filePath) => {
    const name = filePath.match(/\/\S*\//)[0].replace(/\//g, '').replace(/\_/g, '-')
    return name
}

// UI组件列表
const libraries = require.context('./library/', true, /index.vue$/);

// 复用元素列表
const units = require.context('./unit/', true, /index.vue$/);

/**
 * 加载组件
 * @param {Fn} resolve 
 * @param {String} namePrefix 注册组件名字的前缀
 */
const requireComponent = (resolve, namePrefix = '') => {
    resolve.keys().map(filePath => {
        const component_name = namePrefix + getComponentName(filePath)
        const componentConfig = resolve(filePath)
        Vue.component(component_name, componentConfig.default || componentConfig);
    })
}

Vue.use(() => {
    requireComponent(libraries);
    requireComponent(units, 'unit-');
})
