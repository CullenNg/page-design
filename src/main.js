import Vue from 'vue'

// ant-design
import Antd from 'ant-design-vue/es'
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd);

import Moment from 'vue-moment'
Vue.use(Moment);

import { Modal, message } from 'ant-design-vue/es';
Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$message = message;

// 前端路由
import router from './router/index.js'

// 前端数据中心
import store from './store/index.js'

// 新统一样式弹出层
import dialog from './system-components/dialog/dialog.vue'
Vue.component('design-dialog', dialog);

// 接口
import api from './interface/index.js'
Vue.prototype.$api = api;

// 所有的UI组件的公共控件
import All_form_unit from './system-components/form-unit/index.js';
Vue.use(All_form_unit);

// 加载业务组件，批量导入并注册
import './ui-component/autoImport.js'

// pixel 转 rem
Vue.prototype.$px2rem = function (pixel = 0) {
    return (pixel / 75) + 'rem';
};

// 页面入口
import App from './layout/index.vue'

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
