// import { Modal } from 'ant-design-vue'
const page = {
    namespaced: true,
    state: {
        // 环境变量，1=装修，2=预览, 3=发布
        env: 1,
        // 当前页面信息
        info: {
            page_id: 0,         // 页面ID
            group_id: 0,        // 当前页面的唯一ID
            title: '',          // 页面标题
            pipeline: '',       // 当前页面渠道
            lang: '',           // 当前页面选中的语种，默认英语,
            site_code: '',      // 站点编码，ZF/RG
            platform: '',       // 设备终端，[pc/m],
            activity_id: '',    // 活动ID
            od: '',  // 千人千面需求，大数据生成的用户ID
            country_code: '',    // 用户访问的国家,
            bts_unique_id: ''   // 实验分流标示
        },
        relations: [], // 可用设备端口
        pipelines: [], // 可用渠道

        // 布局和组件基础数据
        components: {}, // 组件信息
        layouts: [], // 布局信息
        new_layouts: [],

        // 存放API层的数据
        goodsSKU: [], // 当前页面所有组件的商品类型数据源

        // 页面数据
        remote_data_loaded: false, // 页面远端数据是否加载完毕
        remote_data: [], // 页面远端数据， { 1: {}, 2: {} }

        languages: [], // 页面语言包
        preview_url: '', // 预览链接
        isNewGuys: true, // 是否新老用户，1=新用户, 2=老用户, 通过 cookie['WEBF-dan_num'] 订单量来判断
    },

    mutations: {
        /**
         * 更新页面布局信息
         * @param {Object} state
         * @param {Array} layouts 布局信息数组
         * [1,2,3,4,5,{ id: 111, groups: [222,333] }]
         */
        update_layout (state, layouts) {
            state.layouts = layouts.map(x => x.id);
        },

        update_new_layout (state, layouts) {
            state.new_layouts = layouts;
        },

        /**
         * 增加组件
         * @param {Object} state 
         * @param {Object} data 组件数据
         */
        component_add (state, data) {
            state.components.push(data);
        },

        /**
         * 更新组件数据
         * @param {object} state 
         * @param {object} data 组件数据
         */
        component_update (state, data) {
            state.components = state.components.map(x => {
                if (x.id === data.id) {
                    return data;
                } else {
                    return x;
                }
            });
        }
    },

    actions: {
        /**
         * 加载页面数据
         * @param {String} group_id 页面分组ID
         * @param {String} pipeline 渠道
         * @param {String} lang 语言
         * @param {String} platform 设备终端
         * @param {String} title 页面标题
         * @param {Array} relations 可支持设备终端数据
         * @param {Array} pipelines 可用的渠道列表
         * @param {Array} layouts 页面布局信息
         * @param {Object} components 页面组件信息
         * @param {Object} languages 组件的语言包信息
         * @param {Number} env 页面环境变量
         * @param {Array} goodsSKU 页面的商品数据
         */
        load ({ state }, data) {
            const {
                page_id,
                group_id,
                pipeline,
                lang,
                site_code,
                platform,
                title,
                relations,
                layouts,
                components,
                pipelines,
                languages,
                preview_url,
                env,
                goodsSKU,
                activity_id
            } = data;
            // update store value
            state.env = env; // 页面环境变量
            state.info.page_id = page_id;
            state.info.group_id = group_id;
            state.info.title = title;
            state.info.pipeline = pipeline;
            state.info.lang = lang;
            state.info.site_code = site_code;
            state.info.platform = platform;
            state.info.activity_id = activity_id; // 活动ID
            state.relations = relations; // 设备终端
            state.layouts = layouts; // 布局
            state.components = components; // 组件
            state.pipelines = pipelines; // 可用渠道
            state.languages = languages; // 语言包
            state.preview_url = preview_url; // 预览链接
            state.goodsSKU = goodsSKU; // 页面的商品数据
        },

        /**
         * 通过API获取远端商品数据
         * @param {Number} params.is_first 是否首次加载, 1=是
         * @param {object} params.data 额外参数
         * @param {function} params.callback 回调函数
         */
        load_remote_goods_data ({ state, dispatch }, params = {}) {

            // 装修预览和发布页的接口区分
            let url = '';

            // 解决跨域问题，用的JSONP
            const dataType = 'jsonp';
            
            // 基础的请求参数
            const basic_request = {
                page_id: state.info.page_id,
                site_code: state.info.site_code,
                pipeline: state.info.pipeline,
                lang: state.info.lang,
                cookie_id: state.info.od,
                bts_unique_id: state.info.bts_unique_id,
                country_code: state.info.country_code,
                user_group: state.isNewGuys ? 0 : 1,
                env: state.env,
                agent: 'wap'
            };

            // 如果是第一次请求
            if (params.is_first) {
                basic_request.is_first = params.is_first;
            }

            // 合并请求的参数
            const merge_request = Object.assign(basic_request, params.data || {});

            const res = {"code":0,"message":"success","data":{"1588906992541":{"skuInfo":[{"id":"1588907399051","type":"3","component_id":"1588906992541","sku":"","sop_rule_id":"","sop_rule_name":"","price_sys_ids":"14949","tsk_info":{"tsk_begin_time":"1588867200","tsk_end_time":"1624636799"},"goodsInfo":[{"goods_id":"557955","goods_sn":"454843201","goods_title":"Zip Pocket PU Leather Panel Backpack","goods_img":"https:\/\/gloimg.zafcdn.com\/zaful\/pdm-product-pic\/Clothing\/2018\/08\/23\/grid-img\/1534987293059075717.jpg","detail_url":"http:\/\/www.pc-zaful-spider-php5.fpm.egomsl.com\/zip-pocket-pu-leather-panel-backpack-puid_2800426.html?kuid=557955","shop_price":"37.99","market_price":"70.43","discount":28,"stock_num":2,"tsk_price":"19.99","tsk_total_num":2,"tsk_sale_num":0,"tsk_left_num":2},{"goods_id":"566016","goods_sn":"280080808","goods_title":"Funny Graphic Fleece Hoodie","goods_img":"https:\/\/gloimg.zafcdn.com\/zaful\/pdm-product-pic\/Clothing\/2018\/09\/03\/grid-img\/1535959167077609976.jpg","detail_url":"http:\/\/www.pc-zaful-spider-php5.fpm.egomsl.com\/funny-graphic-fleece-hoodie-puid_2800808.html?kuid=566016","shop_price":"36.89","market_price":"54.23","discount":36,"stock_num":2,"tsk_price":"19.99","tsk_total_num":2,"tsk_sale_num":0,"tsk_left_num":2},{"goods_id":"566047","goods_sn":"110738909","goods_title":"ZAFUL0test0 Cami Wide Leg Jumpsuit","goods_img":"https:\/\/gloimg.zafcdn.com\/zaful\/pdm-product-pic\/Clothing\/2018\/08\/27\/grid-img\/1535990322708422898.jpg","detail_url":"http:\/\/www.pc-zaful-spider-php5.fpm.egomsl.com\/zaful-cami-wide-leg-jumpsuit-puid_1107389.html?kuid=566047","shop_price":"38.99","market_price":"50.69","discount":39,"stock_num":2,"tsk_price":"19.99","tsk_total_num":2,"tsk_sale_num":0,"tsk_left_num":2}]}]},"1588906988501":{"skuInfo":[{"id":"1588907350068","type":"2","component_id":"1588906988501","sku":"","sop_rule_id":"604","sop_rule_name":"\u8718\u86db\u4fa0","price_sys_ids":"","goodsInfo":[{"goods_id":557955,"goods_sn":"454843201","goods_title":"Zip Pocket PU Leather Panel Backpack","goods_img":"https:\/\/gloimg.zafcdn.com\/zaful\/pdm-product-pic\/Clothing\/2018\/08\/23\/grid-img\/1534987293059075717.jpg","market_price":"70.43","shop_price":"19.99","discount":72,"is_on_sale":1,"goods_number":997,"url_quick":"","url_title":"http:\/\/m.wap-zaful-master-php5.fpm.egomsl.com\/zip-pocket-pu-leather-panel-backpack-puid_4548432.html?kuid=557955"},{"goods_id":557971,"goods_sn":"279996101","goods_title":"Layered Disc Pendant Choker Necklace","goods_img":"https:\/\/gloimg.zafcdn.com\/zaful\/pdm-product-pic\/Clothing\/2018\/08\/23\/grid-img\/1534987343226361614.jpg","market_price":"4.48","shop_price":"94.99","discount":-123,"is_on_sale":1,"goods_number":10,"url_quick":"","url_title":"http:\/\/m.wap-zaful-master-php5.fpm.egomsl.com\/layered-disc-pendant-choker-necklace-puid_2799961.html?kuid=557971"},{"goods_id":557857,"goods_sn":"278677108","goods_title":"Casual Striped Jogger Pants","goods_img":"https:\/\/gloimg.zafcdn.com\/zaful\/pdm-product-pic\/Clothing\/2018\/08\/21\/grid-img\/1534983385019748789.jpg","market_price":"42.09","shop_price":"9.99","discount":76,"is_on_sale":1,"goods_number":1007,"url_quick":"","url_title":"http:\/\/m.wap-zaful-master-php5.fpm.egomsl.com\/casual-striped-jogger-pants-puid_2786771.html?kuid=557857"},{"goods_id":557973,"goods_sn":"279751401","goods_title":"Halloween Stone Texture Teardrop Design Earrings","goods_img":"https:\/\/gloimg.zafcdn.com\/zaful\/pdm-product-pic\/Clothing\/2018\/08\/23\/grid-img\/1534987349447563144.jpg","market_price":"5.81","shop_price":"9.99","discount":-72,"is_on_sale":1,"goods_number":997,"url_quick":"","url_title":"http:\/\/m.wap-zaful-master-php5.fpm.egomsl.com\/halloween-stone-texture-teardrop-design-earrings-puid_2797514.html?kuid=557973"},{"goods_id":557824,"goods_sn":"271459203","goods_title":"Fashion Unisex Classic Trucker Baseball Golf Mesh Cap Hat vintage question mark women men hip-hop baseball dad hat baseball cap","goods_img":"https:\/\/gloimg.zafcdn.com\/zaful\/pdm-product-pic\/Maiyang\/2018\/06\/13\/grid-img\/1534979376584364052.jpg","market_price":"28.09","shop_price":"9.99","discount":64,"is_on_sale":1,"goods_number":199,"url_quick":"","url_title":"http:\/\/m.wap-zaful-master-php5.fpm.egomsl.com\/fashion-unisex-classic-trucker-baseball-golf-mesh-cap-hat-vintage-question-mark-women-men-hip-hop-baseball-dad-hat-baseball-cap-puid_2714592.html?kuid=557824"},{"goods_id":557821,"goods_sn":"271459004","goods_title":"Fashion Unisex Classic Trucker Baseball Golf Mesh Cap Hat vintage question mark women men hip-hop","goods_img":"https:\/\/gloimg.zafcdn.com\/zaful\/pdm-product-pic\/Maiyang\/2018\/06\/13\/grid-img\/1534979367647587003.jpg","market_price":"7.72","shop_price":"21.99","discount":-185,"is_on_sale":1,"goods_number":200,"url_quick":"","url_title":"http:\/\/m.wap-zaful-master-php5.fpm.egomsl.com\/fashion-unisex-classic-trucker-baseball-golf-mesh-cap-hat-vintage-question-mark-women-men-hip-hop-puid_2714590.html?kuid=557821"},{"goods_id":562737,"goods_sn":"280339603","goods_title":"Side Bear Logo Striped Jogger Pants","goods_img":"https:\/\/gloimg.zafcdn.com\/zaful\/pdm-product-pic\/Clothing\/2018\/08\/29\/grid-img\/1535595862586419223.jpg","market_price":"46.41","shop_price":"19.99","discount":57,"is_on_sale":1,"goods_number":100,"url_quick":"","url_title":"http:\/\/m.wap-zaful-master-php5.fpm.egomsl.com\/side-bear-logo-striped-jogger-pants-puid_2803396.html?kuid=562737"},{"goods_id":557933,"goods_sn":"279711501","goods_title":"Tied Side V Neck Palazzo Jumpsuit","goods_img":"https:\/\/gloimg.zafcdn.com\/zaful\/pdm-product-pic\/Clothing\/2018\/08\/23\/grid-img\/1534987159383175729.jpg","market_price":"45.87","shop_price":"9.99","discount":78,"is_on_sale":1,"goods_number":1003,"url_quick":"","url_title":"http:\/\/m.wap-zaful-master-php5.fpm.egomsl.com\/tied-side-v-neck-palazzo-jumpsuit-puid_2797115.html?kuid=557933"}],"pagination":{"page_num":1,"page_size":20,"total_count":8}}]}}};
 
            // 如果是有回调函数的则执行
            if (params.callback) {
                return params.callback(res);
            }
            // 如果没回调函数则执行下面的数据
            if (res.code != 0) {
                return dispatch('load_local_goods_data');
            }

            // 遍历
            Object.keys(res.data).map(component_id => {
                // 如果是商品数据类型的话
                if (res.data[component_id].hasOwnProperty('skuInfo') == true) {
                    // ajax数据源列表
                    const source_list = res.data[component_id].skuInfo;
                    // 遍历ajax数据源
                    Array.isArray(source_list) && source_list.map(item => {
                        // 如果有的则覆盖, 没有则追加
                        state.goodsSKU = state.goodsSKU.filter(x => parseInt(x.id) != parseInt(item.id));
                        state.goodsSKU.push(Object.assign({}, item));
                    });
                } else {
                    state.remote_data.push({
                        component_id,
                        data: res.data[component_id]
                    });
                }
            });
            // 远端数据加载成功标记
            state.remote_data_loaded = true;
        },

        /**
         * 当页面数据API调取失败的时候，再去页面同步数据
         */
        load_local_goods_data ({ state }) {
            // 兜底同步商品数据到store
            [...state.components].map(cmpt => {
                Array.isArray(cmpt.goodsSKU) && cmpt.goodsSKU.map(item => {
                    state.goodsSKU.push(Object.assign({}, item));
                });
            });
            state.remote_data_loaded = true;
        },
    }
};

export default page;
