import { get, post } from './core';

/**
 * Mock数据地址
 * @description
 * http://rap2.taobao.org/repository/editor?id=254744&mod=381924
 */

/**
 * 获取组件列表
 */
export const design_get_component_list = () => { return get('/get_component_list') };
export const design_get_component_template_list = () => { return get('/get_component_template_list') };

/**
 * 装修页面数据
 */
export const design_get_page_info = () => { return get('/design_get_page_info'); }

/**
 * 装修页保存接口
 */
export const design_save_page_info = () => { return get('/design_get_page_info'); }

export default {};