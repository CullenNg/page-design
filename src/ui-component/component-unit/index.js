import Discount_zaful_m from './discount/index.vue';
import shopPrice from './shop_price/index.vue';
import Marketprice_zaful from './market_price/index.vue';
import GoodsImage_zaful from './image_goods/index.vue';
import loadMore_zaful from './load_more/index.vue';
import fixedTop_zaful from './fixed_top/index.vue';

// 所有组件列表
const components = [
    Discount_zaful_m,
    shopPrice,
    Marketprice_zaful,
    GoodsImage_zaful,
    loadMore_zaful,
    fixedTop_zaful,
];

// VUE 安装包, 注册所有插件
const install = (Vue) => {
    components.map(component => {
        Vue.component(component.name, component);
    });
};

export default {
    install,
};
