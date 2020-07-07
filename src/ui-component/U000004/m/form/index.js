// 数据配置
const datas = {
    title: {
        title: '标题文案',
        type: 'text',
        value: 'FLASH SALE',
    },
    time: {
        title: '时间区间',
        type: 'time',
        value: [],
    }
};

// 样式配置
const styles = {
    margin_top: {
        title: '组件边距(上)',
        type: 'number',
        value: 0,
        col: 2
    },
    margin_bottom: {
        title: '组件边距(下)',
        type: 'number',
        value: 0,
        col: 2,
    },
    bg_color: {
        title: '组件背景色',
        type: 'color',
        value: '#FFFFFF',    
    },
    text_color: {
        title: '标题文字颜色',
        type: 'color',
        value: '#333333',    
    },
    time_text_bg_color: {
        title: '状态文字/时间背景色',
        type: 'color',
        value: '#333333',
        col: 2  
    },
    time_text_color: {
        title: '时间文字颜色',
        type: 'color',
        value: '#FFFFFF',
        col: 2  
    },
};

// 布局
import template1 from './template1';

export const config = {
    datas,
    styles,
    layout: [
        template1
    ]
};