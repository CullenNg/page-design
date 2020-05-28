import { Modal } from 'ant-design-vue'
import { message } from 'ant-design-vue';

import {
    design_get_page_info,
    design_save_page_info,
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


/**
 * 创建组件唯一的ID，规则：时间戳
 * @return {String}
 */
const component_create_id = () => {
    const timestamp = new Date().getTime();
    return timestamp;
};
window.component_create_id = component_create_id;

// 装修页模块
const design = {
    namespaced: true,
    state: {
        first_loaded: false, // 首次加载是否成功
        loading: false, // 页面是否加载中
        preview_in_drag: false, // 预览区域是否在拖拽中
        selected_id: 0, // 选中的组件ID，打开form表单
        show_component_form: false, // 是否展示组件配置项,
    },

    mutations: {
        
    },

    actions: {
        /**
         * 打开form表单
         * @param {number} id 表单ID
         */
        async form_open ({ state, rootState, commit }, id) {
            // 避免多次点击
            if (id === state.selected_id) return false;

            // 获取组件vdc对象
            const vdc = rootState.page.components.filter(x => x.id === id)[0];

            // 如果组件没有读取配置项，则读取 config.js 文件
            if (vdc.is_loaded_config == false) {

                // 读取组件的配置项
                const config = await load_component_config(vdc.component_key, vdc.template_name);
                vdc.update_set('config', config);

                // 存到全局变量里面
                commit('page/component_update', vdc, { root: true });
            }

            // 展示 form
            state.selected_id = id;
            state.show_component_form = true;
        },

        /**
         * 关闭表单
         */
        form_close ({ state }) {
            state.selected_id = '';
            state.show_component_form = false;
        },

        /**
         * 装修页增加组件
         * @param {Object} vdc vdc对象
         */
        async component_add ({ commit }, vdc) {

            // 加载配置项
            const config = await load_component_config(vdc.component_key, vdc.template_name);
            vdc.update_set('config', config);

            // 存到全局变量里面
            commit('page/component_add', vdc, { root: true });
        },

        /**
         * 删除组件
         * @description
         *  1. 触发 confrim 弹窗
         *  2. 请求 AJAX
         *  3. 自定义回调
         * @param {Number} id 当前页面组件的唯一ID
         */
        component_delete ({ state, commit }, id) {
            // 弹层
            Modal.confirm({
                title: '确认删除该组件？',
                onOk () {
                    commit('page/component_delete', id, { root: true });
                    // 如果删除的组件，是当前打开表单的组件，则关闭表单区域，并且清空选择值
                    state.selected_id = null;
                    state.show_component_form = false;
                }
            });
        },

        /**
         * 更换组件模版
         * @param {object} state
         * @param {string} template_name 模版文件夹名字
         */
        component_template_change ({ state }, template_name) {
            message.destroy();
            message.success('更换模版成功');
        },

        /**
         * 中间预览区域，定位到对应的组件楼层
         * @param {*} floor_index 楼层索引
         */
        component_locate_by_floor ({ rootState }, floor_index) {
            // const component_top = $('#canvas').find('.list-group-item').eq(floor_index).offset().top;
            // const body_top = $('.design-layout-preview').scrollTop();
            // const body_padding = floor_index == 0 ? 114 : 50;
            // $('.design-layout-preview').animate({
            //     scrollTop: parseInt(component_top + body_top - body_padding)
            // });
        },

        /**
         * 页面加载
         * @param {object} request  页面参数
         */
        page_load ({ state, dispatch }, request) {
            state.loading = true;

            // 回调函数
            const { callback } = request;

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
                    relations: res.relations.list || [],
                    layouts: [],
                    components: [],
                    pipelines: res.activityInfo.allLangList || [],
                    activity_id: res.activityInfo.id || '',
                    languages: res.languages || [],
                    preview_url: res.preview_url || '',
                    env: 1,
                    goodsSKU: [],
                };
                
                /**
                 * 个别特殊处理(容错处理)
                 * 0. layouts 数据和 components 数据做校验，是否对应
                 * 1. 每个组件增加 lastmodify 字段
                 * 2. ID 强制转为 Number 类型
                 */
                try {
                    // 1.1 校验 layouts 数据
                    data.layouts = res.pageData.layouts.map(id => Number(id));
                    data.layouts = data.layouts.filter(id => {
                        const all_components_id = res.pageData.list.map(item => Number(item.id));
                        return all_components_id.includes(id);
                    }) || [];

                    // 1.2 校验组件数据
                    data.components = res.pageData.list.map(item => {
                        // 克隆1个对象出来
                        const item2 = Object.assign({}, item);

                        // 2. ID强制转为 Number
                        item2.id = Number(item.id);
                        item2['lastmodify'] = Number(item.id);
                        item2['template_name'] = 'template1';

                        // 3. 商品数据抽取到 page.state.goodsSKU 里面。
                        if (Array.isArray(item2.goodsSKU)) {
                            item2.goodsSKU.map(x => {
                                // 重新绑定组件ID，解决同步渠道带来的组件ID不对应的问题
                                x.component_id = item2.id;
                                // 追加到 store
                                data.goodsSKU.push(Object.assign({}, x));
                            });
                            // goods 字段默认取 [0] 个数据源ID
                            try {
                                item2.data.goods = item2.goodsSKU[0].id;
                            } catch (err) {
                                console.warn(err);
                            }
                        };
                        return item2;
                    });
                } catch (err) {
                    data.layouts = [];
                    data.components = [];
                    data.goodsSKU = [];
                    console.error('layouts & components error');
                }
                // console.log('路由的数据', res.pageData);
                // console.log('遍历保存的数据====', data);

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
         * @description 1. 保存到 store, 2. 数据通过接口保存到数据库
         * @author Cullen
         * @date 2019-11-26
         */
        page_save ({ state, rootState, commit }) {
            // 开启 loading 状态
            state.loading = true;

            // 清除垃圾组件
            rootState.page.components.map(item => {
                if (rootState.page.layouts.includes(item.id) == false) {
                    commit('page/component_delete', item.id, { root: true });
                }
            });

            // 构造请求参数
            const request = {
                page_id: rootState.page.info.page_id,
                group_id: rootState.page.info.group_id,
                pipeline: rootState.page.info.pipeline,
                lang: rootState.page.info.lang,
                layouts: [...rootState.page.layouts],
                components: [...rootState.page.components] || [],
            }
            /**
             * 格式化组件数据，删除无用的数据，减少AJAX传送体积
             * 1. 去除config里面的无效数据
             * 2. 增加3个数据纬度，数据配置+样式配置+商品SKU数据
             */
            request.components = request.components.map(cmpt_clone => {
                const cmpt = Object.assign({}, cmpt_clone);
                delete cmpt.icon;
                delete cmpt.lastmodify;

                // 如果当前组件有开启表单，则组装数据
                if (cmpt.hasOwnProperty('config')) {
                    cmpt.data = {};
                    cmpt.style = {};
    
                    // 数据配置
                    Object.keys(cmpt.config.datas).map(key => {
                        const value = cmpt.config.datas[key].value;
                        cmpt.data[key] = value;
                    });
    
                    // 样式配置
                    Object.keys(cmpt.config.styles).map(key => {
                        const value = cmpt.config.styles[key].value;
                        cmpt.style[key] = value;
                    });
                    delete cmpt.config;
                }
                delete cmpt.remote_data;
                delete cmpt.remote_style;
                delete cmpt.is_loaded_config;
                delete cmpt.template_list;

                // 找到当前的组件的商品SKU数据
                cmpt.goodsSKU = [];
                const current_component_goodsSKU = rootState.page.goodsSKU.filter(x => Number(x.component_id) === Number(cmpt.id));
                
                // 过滤里面的不需要的字段
                cmpt.goodsSKU = current_component_goodsSKU.map(item => {
                    const clone = JSON.parse(JSON.stringify(item));
                    clone.goodsInfo = [];
                    clone.pagination = {};
                    clone.relation_component_id = [];
                    clone.filters = {};
                    return clone;
                });

                return cmpt; 
            });

            console.log(request);
            state.loading = false;
            message.success('保存成功');
        },

        /**
         * 清除页面组件
         */
        page_reset ({ rootState }) {
            // 弹层
            Modal.confirm({
                title: '确认删除所有组件？',
                onOk () {
                    rootState.page.components = [];
                    rootState.page.layouts = [];
                    rootState.page.goodsSKU = [];
                }
            });
        },

        /**
         * 装修页更新页面布局排序
         * @param {Object} state
         * @param {Array} layouts 布局排序数组
         * [1,2,3,4,5,{ id: 111, groups: [222,333] }]
         */
        page_update_layout ({ commit }, layouts) {
            commit('page/update_layout', layouts, { root: true });
        },

        /**
         * 复制组件
         * @param {Number} id 复制的组件ID
         */
        component_copy ({ rootState }, { id, index }) {
            // 复制组件数据
            const vdc_origin = rootState.page.components.filter(x => Number(x.id) === id)[0];
            const vdc_clone = vdc_origin.duplicate();
            
            // 更新页面组件数据
            rootState.page.components.push(vdc_clone);

            // 更新页面布局信息
            rootState.page.layouts.splice(index + 1, 0, vdc_clone.id);

            message.success('组件复制成功');
            return false;
        },
    }
};

export default design;
