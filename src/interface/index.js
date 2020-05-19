import { get, post } from './core';

/**
 * @description
 * http://rap2.taobao.org/repository/editor?id=254744&mod=381924
 */

/**
 * 获取组件列表
 */
export const design_get_component_list = () => { return get('/get_component_list') };

/**
 * 装修页面数据
 */
export const design_get_page_info = () => { return get('/design_get_page_info'); }

/**
 * 装修页保存接口
 */
export const design_save_page_info = () => { return get('/design_get_page_info'); }

export default {};