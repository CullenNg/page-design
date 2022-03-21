// 数据配置
const datas = {
    goods: {
        title: '商品数据',
        value: '',
        type: 'goods',
        able: [1]
    }
};

// 样式配置
const styles = {
    margin_top: {
        title: '组件上边距',
        type: 'number',
        value: '0',
        col: 2
    },
    margin_bottom: {
        title: '组件下边距',
        type: 'number',
        value: '0',
        col: 2,
    },
    bg_color: {
        title: '组件背景色',
        type: 'color',
        value: '#f8f8f8',
    },
    box_is_whole: {
        title: '背景是否整体式',
        type: 'radio',
        value: '1',
        options: [
            { label: '是', value: '1' },
            { label: '否', value: '0' }
        ]
    },
    bg_radius: {
        title: '背景圆角',
        type: 'bar',
        value: 12,
        min: 0,
        max: 100
    },
    item_radius: {
        title: '单个商品圆角',
        type: 'bar',
        value: 12,
        min: 0,
        max: 100
    },
    discount_show: {
        title: '是否显示',
        type: 'radio',
        value: '1',
        options: [
            { label: '是', value: '1' },
            { label: '否', value: '0' }
        ]
    },
    discount_type: {
        title: '显示方式',
        type: 'radio',
        value: '1',
        options: [
            { label: '**%OFF', value: '1' },
            { label: '-**%', value: '0' }
        ]
    },
    discount_width: {
        title: '折扣标宽度',
        type: 'number',
        value: '80',
        col: 2
    },
    discount_height: {
        title: '折扣标高度',
        type: 'number',
        value: '80',
        col: 2
    },
    discount_margin_top: {
        title: '整体上偏移',
        type: 'number',
        value: '0',
        col: 2
    },
    discount_margin_right: {
        title: '整体右偏移',
        type: 'number',
        value: '0',
        col: 2
    },
    discount_padding_top: {
        title: '文字上偏移',
        type: 'number',
        value: '18',
        col: 2
    },
    discount_padding_right: {
        title: '文字右偏移',
        type: 'number',
        value: '15',
        col: 2
    },
    discount_bg_color: {
        title: '背景颜色',
        type: 'color',
        value: '#333333',
        col: 2
    },
    discount_font_color: {
        title: '文字颜色',
        type: 'color',
        value: '#FFFFFF',
        col: 2
    },
    discount_bg_image: {
        title: '背景图片',
        type: 'image',
        value: ''
    },
    shop_price_color: {
        title: '文字颜色',
        type: 'color',
        value: '#333333'
    },
    shop_price_title: {
        title: '销售价文案',
        type: 'text',
        value: 'Now'
    }
};

import template1 from './template1';

export default {
    datas,
    styles,
    layout: [
        template1
    ]
}
