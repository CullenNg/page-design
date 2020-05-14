<template>
    <div class="form-item col-1">
        <label>图片配置</label>
        <div>
            <a-button
                class="button-add"
                size="large"
                type="primary"
                @click="handle_dialog_open">
                已配置图片( {{ current_value.length }} )
            </a-button>
        </div>

        <!-- 图片管理器 -->
        <images-manager
            ref="images-manager"
            v-if="dialog.visible"
            :value="current_value"
            :options="config.options"
            :rootConfig="rootConfig"
            @confirm="handle_dialog_confirm"
            @cancel="handle_dialog_cancel">
        </images-manager>
    </div>
</template>

<script>

// 图片管理弹窗
import imagesManager from "../more/images-manager/index";

// Main code
export default {
    name: 'unit-images',
    props: {
        value: {
            type: Array
        },
        // 配置
        config: {
            type: Object,
            required: true
        },
        // 根配置
        rootConfig: {
            type: Object,
            required: true
        }
    },
    components: {
        imagesManager
    },
    data () {
        return {
            current_value: this.value,
            // 配置数据源的弹窗
            dialog: {
                visible: false
            }
        }
    },

    methods: {
        /**
         * 打开商品数据配置的弹窗
         */
        handle_dialog_open () {
            this.dialog.visible = true;
        },

        /**
         * 弹层-确认回调
         * @param {Array} list 具体数据
         */
        handle_dialog_confirm (list) {
            this.current_value = [...list];
            this.$emit('input', [...list]);
        },

        /**
         * 取消弹层
         */
        handle_dialog_cancel () {
            this.dialog.visible = false;
        }
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
