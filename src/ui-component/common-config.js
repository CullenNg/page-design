/**
 * 基础数据
 */
class Config {
    constructor () {
        this.state = {
            datas: {},
            styles: {
                margin_top: { title: 'top', type: 'number', value: 0, col: 4 },
                margin_bottom: { title: 'bottom', type: 'number', value: 0, col: 4, },
                margin_left: { title: 'left', type: 'number', value: 0, col: 4 },
                margin_right: { title: 'right', type: 'number', value: 0, col: 4, },
                padding_top: { title: 'top', type: 'number', value: 30, col: 4, },
                padding_bottom: { title: 'bottom', type: 'number', value: 30, col: 4, },
                padding_left: { title: 'left', type: 'number', value: 0, col: 4, },
                padding_right: { title: 'right', type: 'number', value: 0, col: 4, },
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