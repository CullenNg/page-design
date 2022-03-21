import formGlobalConfig from '/src/ui-component-form/global.js'

/**
 * Virtual component for design
 */
export default class Vdc {
    /**
     * 
     * @param {Number} id 组件唯一ID
     * @param {String} component_key 组件唯一KEY
     * @param {String} component_title 组件名字
     * @param {Number} template_id 模版ID
     * @param {Number} template_name 模版文件夹名称
     * @param {Number} template_title 模版中文名称
     * @param {Array} template_list 拥有的模版列表
     * @param {Object} remote_data 数据库存的值
     * @param {Object} remote_style 数据库存的值
     */
    constructor ({
        id = 0,
        component_key = 'U000001',
        component_title = '测试组件',
        template_id = 0,
        template_name = 'template1',
        template_title = '默认模版',
        template_list = [],
        remote_data = {},
        remote_style = {},
    }) {
        this.id = id;
        this.component_key = component_key;
        this.component_title = component_title;
        this.template_id = Number(template_id);
        this.template_name = template_name;
        this.template_title = template_title;
        this.template_list = template_list;
        this.config = {
            layout: [],
            datas: {},
            styles: {},
        };
        this.is_loaded_config = false;
        this.remote_data = Object.assign({}, remote_data);
        this.remote_style = Object.assign({}, remote_style);
        // 创建组件唯一ID
        if (id == 0) this.generate_component_id();
    }

    /**
     * 创建组件唯一ID
     */
    generate_component_id () {
        const id = new Date().getTime();
        this.id = id;
        return id;
    }

    /**
     * 获取组件配置项方法
     * @param {String} field 字段key
     * @param {Object} data 值
     */
    update_set (field, data) {
        if (typeof data == "object") {
            this[field] = JSON.parse(JSON.stringify(data));
        } else {
            this[field] = data;
        }

        // 如果更新了配置项的字段，则插入remote_data数据到config字段
        if (field == 'config') {
            this.is_loaded_config = true;
            this.inject_config_data();
        }

        // 更新时间
        this.update_lastmodiy();
    }

    /**
     * 最后更新时间
     */
    update_lastmodiy () {
        this.lastmodify = new Date().getTime();
    }

    /**
     * 把remote_data 和 remote_style 的数据插入到config字段里面
     */
    inject_config_data () {
        // data 类型
        Object.keys(this.remote_data).map(key => {
            try {
                this.config.datas[key].value = JSON.parse(JSON.stringify(this.remote_data[key]));
            } catch (err) {
                console.warn(`key '${key}' is dosen't exit`);
            }
        });

        // style 类型
        Object.keys(this.remote_style).map(key => {
            try {
                // 普通赋值
                this.config.styles[key].value = JSON.parse(JSON.stringify(this.remote_style[key]));
                // 判断是否有绑定其他字段的关联关系
                if (this.config.styles[key].hasOwnProperty('bind') === true) {
                    const bindStr = this.config.styles[key].bind;
                    const value = this.config.styles[key].value;
                    eval('this.config.styles.' + bindStr + '=' + value);
                }
            } catch (err) {
                console.warn(`key '${key}' is dosen't exit`);
            }
        });
    }

    /**
     * 把 config 的数据添加到 remote_data 和 remote_style 里面
     */
    inject_remote_data () {
        Object.keys(this.config.datas).map(key => {
            this.remote_data[key] = this.config.datas[key].value;
        });
        Object.keys(this.config.styles).map(key => {
            this.remote_style[key] = this.config.styles[key].value;
        });
    }

    /**
     * 复制自身
     * @returns {Vdc}
     */
    duplicate () {
        const vdc = new Vdc(this);
        vdc.generate_component_id();
        if (this.is_loaded_config == true) {
            vdc.update_set('config', this.config);
        }
        return vdc;
    }

    /**
     * 加载组件表单配置项
     * @return {Promise}
     */
    initFormConfig () {
        const self = this
        const { component_key, is_loaded_config } = this
        const mergeConfig = (source, data) => {
            const copyData = JSON.parse(JSON.stringify(data))
            Object.keys(source).map(key => {
                copyData[key] = Object.assign(copyData[key], source[key]);
            });
            return copyData;
        }
        return new Promise((resolve, reject) => {
            if (is_loaded_config === true) {
                return resolve()
            } else {
                // 读取 config 配置文件
                require([`/src/ui-component-form/library/${component_key}/index.js`], (module) => {
                    // deep clone object
                    const data = JSON.parse(JSON.stringify(module.default));
                    const mergeData = mergeConfig(formGlobalConfig, data);
                    Vdc.prototype.update_set.call(self, 'config', mergeData);
                    Vdc.prototype.update_set.call(self, 'is_loaded_config', true)
                    resolve();
                });
            }
        });
    }
}