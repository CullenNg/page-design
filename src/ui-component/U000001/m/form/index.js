// 公共配置项
import commonConfig from '../../../common-config';
// 模版
import template1 from './template1';

// 数据配置
const datas = {
    title: { title: '文案', type: 'text', value: 'Title', },
    href: { title: '跳转链接', type: 'text', value: '', }
};

// 样式配置
const styles = {
    width: { title: '标题宽度', type: 'number', value: 750, max: 750, },
    text_size: { title: '文字大小', type: 'bar', value: 30, min: 12, max: 100, },
    text_color: { title: '文字颜色', type: 'color', value: '#333333', },
    text_align: { title: '对齐方式', type: 'radio', value: 'center',
        options: [
            { label: '左对齐', value: 'left' },
            { label: '居中对齐', value: 'center' },
            { label: '右对齐', value: 'right' }
        ]  
    },
    text_style: { title: '文字粗细', type: 'radio', value: 'normal',
        options: [
            { label: '正常', value: 'normal' },
            { label: '加粗', value: 'bold' }
        ]    
    },
    bg_color: { title: '背景色', type: 'color', value: '#FFFFFF', },
    bg_img: { title: '背景图片', type: 'image', value: '', }
};

export const config = commonConfig.merge({
    datas,
    styles,
    layout: [
        template1
    ]
});
