<template>
    <div class="form-item col-1">
        <label>商品数据</label>
        <div>
            <template v-if="!is_data_set">
                <a-button
                    class="button-add"
                    size="large"
                    type="primary"
                    @click="handle_open_dialog('add')">选择商品数据</a-button>
            </template>
            <!-- 编辑区域 -->
            <template v-else>
                <div class="form-goods">
                    <a-input
                        :disabled="true"
                        :value="tips"
                        size="large"
                        :data-id="current_value" />

                    <a-button
                        class="button-edit"
                        size="large"
                        type="primary"
                        @click="handle_open_dialog('edit')">重新修改</a-button>
                </div>
            </template>
        </div>
        <!-- 弹窗 -->
        <goods-source-manager
            ref="goodsSourceManager"
            :visible.sync="dialog.visible"
            :value.sync="current_value"
            :able="config.able"
            @confirm="handle_dialog_confirm"/>
    </div>
</template>

<script>

// 商品数据弹窗
import goodsSourceManager from '../../more/goods-source-manager/index';

// Main code
export default {
    props: ['value', 'config'],

    components: {
        goodsSourceManager
    },

    data () {
        return {
            current_value: this.value,
            is_data_set: false, // 是否已经设定商品数据
            // 配置数据源的弹窗
            dialog: {
                visible: false
            },
            // 提示文案
            tips: ''
        }
    },

    computed: {
        // 当前组件ID
        component_id () {
            return this.$store.state.design.selected_id;
        },
        // 当前组件goodsSKU
        component_goodsSKU () {
            return this.$store.state.page.goodsSKU;
        }
    },

    methods: {
        /**
         * 打开商品数据配置的弹窗
         */
        handle_open_dialog (type) {
            this.dialog.visible = true;
            this.$refs.goodsSourceManager.init();
        },

        /**
         * 商品数据配置弹窗 - 确认回调
         * @param {Object} data 具体数据
         */
        handle_dialog_confirm (data) {
            this.$emit('input', data.id);
            this.current_value = data.id;
            this.update_tips(data);
        },

        /**
         * 更新文案展示
         */
        update_tips (data) {
            // 空文案
            if (!data) {
                this.tips = '';
                this.is_data_set = false;
                return false;
            };
            // 根据数据模式去筛选
            switch (Number(data.type)) {
                case 1:
                    // 商品KU
                    this.tips = '已选择: 商品SKU';
                    this.is_data_set = data.skus != '';
                    break;
                case 2:
                    // SOP商品运营平台
                    this.tips = `已选择：规则 ${data.sop_rule_name}`;
                    this.is_data_set = data.sop_rule_id != '';
                    break;
                case 3:
                    // 秒杀
                    this.tips = `已选择：秒杀ID`;
                    this.is_data_set = data.price_sys_ids != '';
                    break;
            }
        }
    },

    /**
     * 组件初始化
     */
    created () {
        // 判断是否有数据，有则更新文案
        const data = this.component_goodsSKU.filter((item) => item.id == this.current_value);
        data[0] && this.update_tips(data[0]);
    }
}
</script>

<style lang="less" scoped>
// 选择按钮
.button-add {
    width: 100%;
    font-size: 14px;
}
// 编辑区域
.form-goods {
    display: flex;
    flex-flow: row nowrap;

    .ant-input {
        flex-shrink: 1;
        margin-right: 8px;
        text-overflow: ellipsis;
    }
    .button-edit {
        font-size: 14px;
        flex-shrink: 0;
    }
}
</style>
