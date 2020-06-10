// 数据配置
const datas = {
    list: {
        title: '图片设置',
        type: 'images',
        value: [
            {
                image: '',
                link: '',
            }
        ],
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
const styles = {
    margin_top: {
        title: '组件边距(上)',
        type: 'number',
        value: 0,
        col: 2,
    },
    margin_bottom: {
        title: '组件边距(下)',
        type: 'number',
        value: 0,
        col: 2,
    },
    width: {
        title: '轮播图(宽)',
        type: 'number',
        disabled: true,
        value: 750,
        col: 2,
    },
    height: {
        title: '轮播图(高)',
        type: 'number',
        value: 360,
        col: 2,
    }
};

import template1 from './template1';

export const config = {
    datas,
    styles,
    layout: [
        template1
    ]
}
