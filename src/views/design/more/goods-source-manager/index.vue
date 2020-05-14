<template>
    <!--数据配置-->
    <design-dialog
        :visible="visible"
        :width="960"
        wrapClassName="dialog-goods-source-manager"
        title="数据配置"
        :confirmLoading="loading"
        @isOk="handle_confirm"
        @isCancel="handle_cancel">

        <div class="container-body" :data-id="data_source_id">

            <!--数据模式-->
            <div class="mode-select">
                <div class="title">数据模式</div>
                <a-select
                    v-model="mode"
                    @change="handle_mode_change">
                    <template v-for="(item, index) in mode_list">
                        <a-select-option
                            v-if="!item.disabled"
                            :key="index"
                            :value="item.value">
                            {{ item.name }}
                        </a-select-option>
                    </template>
                </a-select>
            </div>

            <!--商品sku-->
            <div class="content" v-if="mode == 1">
                <enter-sku
                    ref="enterSku"
                    :sku.sync="enterSku.sku"
                    :value.sync="value"
                    :loading.sync="loading">
                </enter-sku>
            </div>

            <!-- 选品方式第三方平台 -->
            <div class="content" v-if="mode == 2">
                <es-system
                    ref="esSystem"
                    :visible="visible"
                    :sop_rule_id="esSystem.sop_rule_id"
                    :sop_rule_name="esSystem.sop_rule_name">
                </es-system>
            </div>

            <!-- 秒杀ID -->
            <div class="content" v-if="mode == 3">
                <flashsale
                    ref="flashsale"
                    :price_sys_ids="flashsale.id"
                    :loading.sync="loading">
                </flashsale>
            </div>
        </div>

    </design-dialog>
</template>

<script>

/**
 * 参考流程图
 * https://www.processon.com/view/link/5df8ad06e4b0c4255ea00256
 */

// 自填 SKU 模块
import enterSku from './enter-sku.vue';
// 商品运营平台模块（选品）
import esSystem from './es-system.vue';
// 秒杀ID 模块
import flashsale from './flashsale-id';

export default {
    name: 'goods-source-manager',

    components: {
        esSystem,
        enterSku,
        flashsale
    },

    props: {
        
        // 是否展示
        visible: {
            type: Boolean,
            default: false
        },

        // 数据源ID
        value: {
            required: true,
            default: ''
        },

        // 数据涞源类型， local/store, default=vuex
        origin: {
            type: String,
            default: 'vuex'
        },

        // 可用选项，默认全开
        able: {
            type: Array,
            default () {
                return [1,2,3]
            }
        }
    },

    data () {
        return {
            // 数据源ID，默认从 props 里面取
            data_source_id: this.value,
            // 绑定的组件ID
            component_id: 0,
            // 加载状态
            loading: false,
            // 数据模式
            mode: 2,
            mode_list: [
                { name: '商品SKU', value: 1, disabled: true },
                { name: '商品运营平台', value: 2, disabled: true },
                { name: '秒杀ID', value: 3, disabled: true }
            ],
            // 自填SKU的
            enterSku: {
                sku: '',
            },
            // 商品运营平台的数据
            esSystem: {
                sop_rule_id: '',
                sop_rule_name: '',
            },
            // 秒杀ID
            flashsale: {
                id: ''
            },
            // 自定义回调函数
            callback: null
        };
    },

    computed: {
        
        // 获取store里面的绑定组件ID
        store_component_id () {
            return this.$store.state.design.selected_id;
        },

        // 获取store里面的数据源
        store_goods_source () {
            return this.$store.state.page.goodsSKU;
        }
    
    },

    methods: {

        /**
         * 初始化
         * params 传参用于老装修页JS调用，原生APP新装修页不需要传参
         * 根据字段 origin 判断数据来源
         * origin = vuex 则用的 vuex 的数据
         * origin = local 直接用 params 的数据，兼容老装修页
         */
        init (params = {}) {
            
            let data = {};
            if (this.origin == 'vuex') {
                data = this.get_store_data_by_id(this.data_source_id);
                this.component_id = this.store_component_id;
            }
            if (this.origin == 'local') {
                data = params;
                // 更新数据源ID
                this.data_source_id = data.id;
                // 查看是否有
                this.component_id = data.component_id || 0;
            }

            // 开启模式选择项，props 的数据和传参数据合并
            const able_merge = this.able.concat(data.able || []);
            this.init_mode_selection(able_merge);

            // 初始化当前选择的 type 
            this.init_mode_selected(data.type);

            // 其他参数
            this.enterSku.sku = data.sku || '';
            this.esSystem.sop_rule_id = data.sop_rule_id || '';
            this.esSystem.sop_rule_name = data.sop_rule_name || '';
            this.flashsale.id = data.price_sys_ids || '';

            // 判断是否有自定义回调
            if (data.callback) {
                this.callback = data.callback;
            }
        },

        /**
         * 禁用数据模式的可选项
         * create by Cullen 2019/12/17
         * @param {Array} able 可用选项，[1,2,3,4,5,....]
         * 1=SKU
         * 2=商品运营平台
         * 3=秒杀ID
         */
        init_mode_selection (able = []) {
            if (Array.isArray(able) && able.length > 0) {
                able.map(code => {
                    this.mode_list.map(mode => {
                        if (mode.value == code) {
                            mode.disabled = false;
                        };
                    });
                });
            }
        },

        /**
         * 初始化当前选中的模式，如果选项 disabled 中则取第[0]个可选项
         * create by Cullen 2019/12/17
         * @param {Number} type 当前选中的模式
         * 1=SKU
         * 2=商品运营平台
         * 3=秒杀ID
         */
        init_mode_selected (type = 0) {
            const selected_type = parseInt(type);
            const avavible_options = this.mode_list.filter(mode => mode.disabled != true);
            const avavible_options_value = avavible_options.map(mode => mode.value);
            // 判断是否可用
            if (avavible_options_value.includes(selected_type)) {
                this.mode = selected_type;
            } else {
                this.mode = avavible_options_value[0];
            }
        },

        /**
         * 根据 id 来源，获取store的数据源
         * @param {String} id 数据源ID
         */
        get_store_data_by_id (id) {
            const res = this.$store.state.page.goodsSKU.filter((item) => item.id.toString() == id.toString());
            return res[0] || {};
        },

        /**
         * 弹窗按钮 - 确认
         */
        async handle_confirm () {
            // 自填 SKU
            if (this.mode == 1) {
                this.$refs.enterSku.handle_confirm((res) => {
                    // 更新数据中心
                    this.update_store_data(res);
                });
            }
            // 选品系统
            if (this.mode == 2) {
                this.$refs.esSystem.handle_confirm((res) => {
                    // 更新数据中心
                    this.update_store_data(res);
                });
            }
            // 秒杀ID
            if (this.mode == 3) {
                this.$refs.flashsale.handle_confirm((res) => {
                    // 更新数据中心
                    if (res != null) {
                        this.update_store_data(res);
                    } else {
                        this.$emit('update:visible', false);
                    }
                });
            }
        },

        /**
         * 弹窗按钮 - 取消
         */
        handle_cancel () {
            // 自填 SKU
            if (this.mode == 1) {
                
            }
            // 选品系统
            if (this.mode == 2) {
                this.$refs.esSystem.handle_cancel();
            }
            this.$emit('update:visible', false);
        },

        /**
         * 数据模式的改变
         * @param {string} mode 数据模式
         */
        handle_mode_change (mode) {
            this.mode = mode;
        },

        /**
         * 更新 store/local 的数据
         * @param {Number} type 数据模式
         * @param {String} sku 自填的 SKUS
         * @param {String} sop_rule_id 选品规则ID
         * @param {String} sop_rule_name 选品规则名字
         * @param {String} price_sys_ids 秒杀ID
         */
        async update_store_data ({ type = 2, sku = '', sop_rule_id = '', sop_rule_name = '', price_sys_ids = '' }) {
            this.loading = true;

            // 创建新的数据
            let data = {
                id: this.data_source_id || new Date().getTime(),
                type,
                component_id: this.component_id, // 绑定的组件ID
                sku,
                sop_rule_id,
                sop_rule_name,
                price_sys_ids
            };

            // 统一获取商品数据
            const res = await this.get_goods_by_type(data);

            // 错误处理
            if (res.code != 0) {
                this.$message.error(res.message || '服务器错误');
                this.loading = false;
                return false;
            }

            // 更新数据
            data.goodsInfo = [...res.data[0].goodsInfo || []];

            // 如果是秒杀ID的，增加额外的字段
            if (type == 3) {
                data.tsk_info = res.data[0].tsk_info || {};
            }

            // 存放 vuex 的数据
            switch (this.origin) {
                case 'vuex':
                    // 过滤已存在的
                    this.$store.state.page.goodsSKU = this.$store.state.page.goodsSKU.filter(x => x.id != this.data_source_id);
                    // 追加到 store 里面
                    this.store_goods_source.push(data);
                    break;
            }

            // 关闭弹窗, 向父组件更新数据源数据
            this.$emit('confirm', data);
            // 更新当前控件的数据源ID
            this.data_source_id = data.id;
            this.loading = false;
            this.$emit('update:visible', false);

            // 自定义回调
            this.callback && this.callback(data);
        },

        /**
         * 根据 type 获取商品数据
         * @returns {Object}
         */ 
        async get_goods_by_type (data) {
            // 判断是否引用 store 模块
            let request = {};
            if (this.$store) {
                request = {
                    page_id: this.$store.state.page.info.page_id,
                    site_code: this.$store.state.page.info.site_code,
                    pipeline: this.$store.state.page.info.pipeline,
                    lang: this.$store.state.page.info.lang
                };
            } else {
                request = {
                    page_id: 0,
                    site_code: window.GESHOP_SITECODE,
                    pipeline: window.GESHOP_PIPELINE,
                    lang: window.GESHOP_LANG
                };
            }

            return new Promise((resolve, reject) => {
                const sku_info = {
                    id: data.id,
                    type: data.type,
                    component_id: data.component_id,
                    sku: data.sku,
                    sop_rule_id: data.sop_rule_id,
                    price_sys_ids: data.price_sys_ids
                }
                $.ajax({
                    url: window.GESHOP_INTERFACE.geshopApi_design_goodsInfo.url,
                    type: 'POST',
                    dataType: 'jsonp',
                    data: {
                        page_id: request.page_id,
                        site_code: request.site_code,
                        pipeline: request.pipeline,
                        lang: request.lang,
                        sku_info: JSON.stringify([sku_info])
                    },
                    success: (res) => {
                        resolve(res);
                    },
                    error: (err) => {
                        reject(err);
                    }
                });
            });
        }
    }
}
</script>

<style lang="less" scoped>
// 容器
.container-body {

    // 模式选择
    .mode-select {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        .title {
            color: #3F4245;
            font-size:14px;
            margin-right: 10px;
        }

        .ant-select {
            width: 200px;
        }
    }
}
</style>

<style lang="less">
// 兼容在老装修页的 antd-css 冲突
.dialog-goods-source-manager {
    *,
    *::before,
    *::after {
    box-sizing: border-box;
    }
}
</style>