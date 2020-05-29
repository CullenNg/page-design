<template>
    <div class="form-item col-1">
        <label>{{ config.title || '' }}</label>
        <!-- 选择图片 -->
        <div class="image-picker">
            <img :src="thumbnail_url">
            <input type="text" v-model="current_value" v-on:blur="handle_input_change">
        </div>
    </div>
</template>

<script>

export default {
    name: 'unit-image',

    props: {
        // 图片地址
        value: {
            type: String,
            default: ''
        },
        // 配置项
        config: {
            type: Object,
            default () {
                return {};
            }
        },
        // 根配置项
        rootConfig: {
            type: Object,
            default () {
                return {};
            }
        }
    },

    data () {
        return {
            current_value: this.value, // 组件内置的变量
            thumbnail_url: this.value, // 缩略图
        }
    },

    watch: {
        value (newVal) {
            this.thumbnail_url = newVal;
            this.current_value = newVal;
        }
    },

    methods: {

        /**
         * 检查图片大小
         * @param {Int} width
         * @param {Int} height
         * @requires {Object} config 可选项
         * @requires {Object} rootConfig 根配置项
         */
        handle_check_size (width, height) {
            if (this.config.width != null && this.config.height != null) {
                const maxWidth = Number(eval(`this.rootConfig.${this.config.width}.value`));
                const maxHeight = Number(eval(`this.rootConfig.${this.config.height}.value`));
                if (width === maxWidth && height === maxHeight) {
                    return true;
                } else {
                    this.$message.error(`图片尺寸不对，只能使用尺寸为 ${maxWidth}x${maxHeight} 的素材`);
                    return false;
                }
            } else {
                return true;
            }
        },

        // 输入框值变化
        handle_input_change (e) {

            // https://pics6.baidu.com/feed/c8177f3e6709c93dee8d1083a64a44dad00054c0.jpeg?token=8a6517d38be2e94eecd6d9a09decf952

            const url = e.target.value;
            // 判断是否有变更
            if (url === this.thumbnail_url) return false;
            // 判断不为空
            if (url != '') {
                // 获取图片大小
                const originalImg = new Image();
                originalImg.src = url;
                originalImg.onload = () => {
                    const width = originalImg.width;
                    const height = originalImg.height;
                    // 检查大小
                    const res = this.handle_check_size(Number(width), Number(height));
                    if (res) {
                        this.$emit('input', url);
                        this.thumbnail_url = url;
                    } else {
                        e.target.value = '';
                        this.$emit('input', '');
                        this.thumbnail_url = '';
                        return false;
                    }
                    console.log('s');
                };
                originalImg.onerror = () => {
                    e.target.value = '';
                    this.current_value = '';
                    this.$emit('input', '');
                    this.thumbnail_url = '';
                };
            } else {
                this.$emit('input', url);
                this.thumbnail_url = url;
            }
        }
    }
}
</script>

<style lang="less">

</style>