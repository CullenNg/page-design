import { Modal } from 'ant-design-vue'
import { message } from 'ant-design-vue';

import {
    design_get_page_info
} from '../../interface/index.js';

/**
 * 获取组件配置项方法
 * @param {string} key 组件KEY, 对应数据库字段 component_key
 * @param {string} template 组件模版，默认 template1
 * @returns promise
 */
const load_component_config = (key, template = 'template1') => {
    return new Promise((resolve, reject) => {
        // 读取 config 配置文件
        require([`../../ui-component/${key}/m/form/index.js`], (module) => {
            // deep clone object
            const data = JSON.parse(JSON.stringify(module.config));
            resolve(data);
        });
    });
}

// 装修页模块
const design = {
    namespaced: true,
    state: {
        first_loaded: false, // 首次加载是否成功
        loading: false, // 页面是否加载中
        preview_in_drag: false, // 预览区域是否在拖拽中
        selected_vdc: {}, // 选中的组件数据对象，打开form表单
        show_component_form: false, // 是否展示组件配置项,
    },

    actions: {
        /**
         * 打开form表单
         * @param {Object} vdc 组件数据对象
         */
        async form_open ({ state }, vdc) {

            // 如果组件没有读取配置项，则读取 config.js 文件
            if (vdc.is_loaded_config == false) {
                // 读取组件的配置项
                const config = await load_component_config(vdc.component_key, vdc.template_name);
                vdc.update_set('config', config);
            }
            // 展示 form
            state.selected_vdc = null;
            state.selected_vdc = vdc;
            state.show_component_form = true;
        },

        /**
         * 关闭表单
         */
        form_close ({ state }) {
            state.show_component_form = false;
        },

        /**
         * 中间预览区域，定位到对应的组件楼层
         * @param {*} floor_index 楼层索引
         */
        component_locate_by_floor () {
            message.error('定位功能还没准备好');
        },

        /**
         * 页面加载
         * @param {object} request  页面参数
         */
        page_load ({ state, dispatch }) {
            state.loading = true;

            // 装修页获取页面数据
            design_get_page_info().then(resource => {
                // 3秒后跳回首页
                if (resource.code == 1) {
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 3000);
                    return false;
                }

                // 拼装页面数据
                const res = resource.data;
                const data = {
                    page_id: res.pageId || '',
                    group_id: res.groupId || '',
                    pipeline: res.pipeline || 'zf',
                    lang: res.lang || 'en',
                    site_code: res.siteCode || '',
                    platform: res.platform || 'm',
                    title: res.pageTitle || '',
                    layouts: [],
                    goodsSKU: [],
                };
                
                // 存储页面数据
                dispatch('page/load', data, { root: true });  

                // 11-10 通过 API 获取当前页面组件的商品数据 - Cullen
                dispatch('page/load_remote_goods_data', {
                    is_first: 1
                }, { root: true }); 

                // 更新状态
                state.loading = false;
                state.first_loaded = true;
            }, (err) => {
                err.message && message.error(err.message);
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            });
        },

        /**
         * 页面保存函数
         * @author Cullen
         * @date 2019-11-26
         */
        page_save ({ state }) {
            // 开启 loading 状态
            state.loading = true;
            setTimeout(() => {
                state.loading = false;
                message.success('保存成功');
            }, 200);
        },

        /**
         * 清除页面组件
         */
        page_reset ({ rootState }) {
            // 弹层
            Modal.confirm({
                title: '确认删除所有组件？',
                onOk () {
                    rootState.page.new_layouts = [];
                    rootState.page.goodsSKU = [];
                }
            });
        },

        /**
         * 装修页更新页面布局排序
         * @param {Array} layouts 所有组件数据
         */
        page_update_layout_v2 ({ commit }, layouts) {
            commit('page/update_new_layout', layouts, { root: true });
        }
    }
};

export default design;
