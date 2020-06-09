/**
 * 基础数据
 */
class Config {
    constructor () {
        this.state = {
            datas: {},
            styles: {
                margin_top: { title: '组件边距(上)', type: 'number', value: 0, col: 2 },
                margin_bottom: { title: '组件边距(下)', type: 'number', value: 0, col: 2, },
                margin_left: { title: '组件边距(左)', type: 'number', value: 0, col: 2 },
                margin_right: { title: '组件边距(右)', type: 'number', value: 0, col: 2, },
                padding_top: { title: '内边距(上)', type: 'number', value: 30, col: 2, },
                padding_bottom: { title: '内边距(下)', type: 'number', value: 30, col: 2, },
                padding_left: { title: '内边距(左)', type: 'number', value: 0, col: 2, },
                padding_right: { title: '内边距(右)', type: 'number', value: 0, col: 2, },
            }
        }
    }

    /**
     * 合并数据
     * @param {Object} datas
     * @param {Object} styles
     * @returns {Object}
     */
    merge (data) {
        const __data = data;
        Object.keys(this.state).map(key => {
            __data[key] = Object.assign(__data[key], this.state[key]);
        });
        return __data;
    }
}

export default new Config();