// 数据配置
const datas = {
    list: {
        title: '图片设置',
        type: 'images',
        value: [],
        options: {
            image: {
                title: '轮播图地址',
                type: 'image',
                value: '',
                width: 'styles.width',
                height: 'styles.height',
            },
            link: {
                title: '跳转连接',
                type: 'text',
                value: '',
            }
        }
    }
};

// 样式配置
const styles = {};

import template1 from './template1';

export const config = {
    datas,
    styles,
    layout: [
        template1
    ]
}
