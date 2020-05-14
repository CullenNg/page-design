// 表单布局
const layout = {
    datas: [
        {
            title: '基础配置',
            groups: ['userGroup', 'goods']
        },
    ],
    styles: [
        {
            title: '常用配置',
            groups: [
                'margin_top',
                'margin_bottom',
                'bg_color',
                'box_is_whole'
            ]
        },
        {
            title: '商品样式',
            icon: false,
            groups: [
                'bg_radius',
                'item_radius'
            ]
        },
        {
            title: '折扣标',
            icon: false,
            groups: [
                'discount_show',
                'discount_type',
                'discount_bg_color',
                'discount_font_color',
                'discount_bg_image'
            ]
        },
        {
            title: '销售价',
            icon: false,
            groups: [
                'shop_price_color',
                'shop_price_title'
            ]
        }
    ]
}

export default layout;
