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
    },
    effect: {
        title: '动画效果',
        type: 'radio',
        value: 'slide',
        options: [
            { label: '左右切换', value: 'slide' },
            { label: '淡入淡出', value: 'fade' }
        ]
    },
    delay: {
        title: '动画时间间隔（毫秒）',
        value: '3000',
        type: 'number',
        min: 3000,
        max: 10000
    }
};

// 样式配置
const styles = {};

import template1 from './template1';

export default {
    datas,
    styles,
    layout: [
        template1
    ]
}
