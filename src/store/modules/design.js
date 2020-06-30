import { Modal } from 'ant-design-vue'
import { message } from 'ant-design-vue';

// 组件实例
import Vdc from '@/core/vdc/vdc';

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
        component_temlate_list: [], // 所有组件的模版列表
    },

    mutations: {
        /**
         * 更新所有组件的模版列表
         * @param {Object} state 
         * @param {Array} list 模版列表
         */
        udpate_component_template_list (state, list) {
            state.component_temlate_list = list;
        }
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

            // 如果组件没有模版列表，则加载
            if (vdc.template_list.length <= 0) {
                const template_list = state.component_temlate_list.filter(x => x.component_key == vdc.component_key);
                vdc.update_set('template_list', template_list);
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
         * @param {Vdc} component 组件
         * @param {Number} index 组件楼层
         */
        component_locate_by_floor ({}, {component, index}) {
            const dom = document.getElementById(component.id);
            const middleDom = document.getElementById('design-middle-layout');
            // 获取元素的纵坐标（相对于窗口）
            function getTop (e) {
                var offset=e.offsetTop;
                if(e.offsetParent!=null) offset+=getTop(e.offsetParent);
                return offset;
            }
            const top = index == 0 ? 0 : getTop(dom) - 50;
            middleDom.scrollTop = top;
        },

        /**
         * 页面加载
         * @param {object} request  页面参数
         */
        page_load ({ state, dispatch }, page_id) {
            state.loading = true;

            // 装修页获取页面数据
            design_get_page_info(page_id).then(res => {
                // 拼装页面数据
                const local_components = JSON.parse(localStorage.getItem('layouts') || '[]');
                const data = {
                    page_id: res.pageId || '',
                    lang: res.lang || 'en',
                    platform: res.platform || 'm',
                    title: res.pageTitle || '',
                    components: res.components.map(x => new Vdc(x))
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
        page_save ({ state, rootState }) {
            // 开启 loading 状态
            state.loading = true;
            
            setTimeout(() => {
                state.loading = false;

                // 删除部分不需要传输到后端的字段
                // let cmpts_arr = JSON.parse(JSON.stringify(rootState.page.components));
                const cmpts_arr = rootState.page.components.map(vdc => {
                    vdc.inject_remote_data();
                    const copy_vdc = JSON.parse(JSON.stringify(vdc));
                    // 删除字段
                    delete copy_vdc.is_loaded_config;
                    delete copy_vdc.lastmodify;
                    delete copy_vdc.config;
                    delete copy_vdc.template_list;
                    return copy_vdc;
                });

                // localStorage.setItem('layouts', JSON.stringify(cmpts_arr));

                // 保存的参数
                const saveParams = {
                    "pageTitle": rootState.page.info.title,
                    "lang": rootState.page.info.lang,
                    "pageId": rootState.page.info.page_id,
                    "platform": rootState.page.info.platform,
                    "components": cmpts_arr
                };
                console.log(JSON.stringify(saveParams));

                
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
