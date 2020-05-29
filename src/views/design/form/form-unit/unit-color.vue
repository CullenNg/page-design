<template>
    <div :class="`form-item col-${config.col || 1}`">
        <label for="">{{ config.title }}</label>
        <div class="color-picker-wrapper">
            <a-input
                size="large"
                v-model="color2"
                @blur="handleInputChange">
                
                <ColorPicker
                    slot="addonBefore"
                    :value="color1"
                    @change="handlePickerChange" />
            </a-input>
        </div>
    </div>
</template>

<script>
/**
 * 颜色选择器
 */
import { ColorPicker } from 'element-ui';
import 'element-ui/lib/theme-chalk/color-picker.css';

export default {
    props: ['value', 'config'],

    components: {
        ColorPicker,
    },

    data () {
        return {
            color1: '', // 存放色块的值
            color2: '', // 文本框的值
        }
    },

    created () {
        this.color1 = this.value;
        this.color2 = this.value;
        // 兼容处理
        if (this.value == '#00000000') {
            this.color1 = '#ffffff';
        }
    },

    methods: {

        /**
         * 颜色选择器的值变更
         */
        handlePickerChange (value = '') {
            this.color_formatter(value);
        },

        /**
         * 文本输入框的值变更
         */
        handleInputChange (event) {
            let value = event.target.value || '';
            this.color_formatter(value);
        },

        /**
         * 颜色格式化， 正则判断
         */
        color_formatter (value) {
            // 只允许输入完整的十六进制的值
            if (/^#[A-Fa-f0-9]{6,8}$/.test(value) === false) {
                this.color1 = '#ffffff';
                this.color2 = '#00000000';
            } else {
                this.color1 = value;
                this.color2 = value;
            }
            // 透明度兼容APP端
            if (value === '#00000000') {
                this.color1 = '#ffffff';
            }
            this.$emit('input', this.color2);
        }
    }
}
</script>

<style lang="less">

// 颜色选择器
.design-form-body {
    
    .color-picker-wrapper {
        display: flex;
        flex-wrap: nowrap;
        .ant-input-group-addon:first-child {
            padding: 0px;
            border: none;
            border-radius: 0px;
        }
        .el-color-picker {
            display: block;
        }
        .el-color-picker__trigger {
            border-color: #E8EAEC;
            border-right: none;
            padding: 0px;
            border: none;
        }
        .el-color-picker__color {
            border-color: #E8EAEC;
            border-right: none;
            border-radius: 4px 0px 0px 4px;
            overflow: hidden;
        }
        .el-color-picker__icon.el-icon-arrow-down {
            color: #E8EAEC;
        }
        .el-icon-arrow-down {
            display: none;
        }
    }
}

</style>
