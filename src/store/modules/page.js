// import { Modal } from 'ant-design-vue'
const page = {
    namespaced: true,
    state: {
        // 环境变量，1=装修，2=预览, 3=发布
        env: 1,
        // 当前页面信息
        info: {
            page_id: 0,         // 页面ID
            title: '',          // 页面标题
            lang: '',           // 当前页面选中的语种，默认英语,
            platform: '',       // 设备终端，[pc/m],
        },

        // 页面数据
        remote_data_loaded: false, // 页面远端数据是否加载完毕
        remote_data: [], // 页面远端数据， { 1: {}, 2: {} }
        languages: [], // 页面语言包
        preview_url: '', // 预览链接
    },

    mutations: {
        /**
         * 更新页面布局信息
         * @param {Object} state
         * @param {Array} layouts 布局信息数组
         * [1,2,3,4,5,{ id: 111, groups: [222,333] }]
         */
        update_new_layout (state, layouts) {
            state.new_layouts = layouts;
        }
    },

    actions: {
        /**
         * 加载页面数据
         * @param {Number} env 页面环境变量
         * @param {String} lang 语言
         * @param {String} platform 设备终端
         * @param {String} title 页面标题
         */
        load ({ state }, data) {
            const {
                env = 1,
                page_id,
                title,
                lang,
                platform,
            } = data;
            state.env = env;
            state.info.page_id = page_id;
            state.info.title = title;
            state.info.lang = lang;
            state.info.platform = platform;
        },
    }
};

export default page;
