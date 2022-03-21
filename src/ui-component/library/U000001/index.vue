<template>
    <a
        class="component-wrapper u000242"
        :href="href"
        :style="wrapper_style">
        {{ title }}
    </a>
</template>

<script>
export default {
    props: ['styles', 'datas'],

    computed: {
        /** 样式 */
        wrapper_style () {
            const {
                margin_top,
                margin_bottom,
                padding_top,
                padding_bottom,
                bg_color,
                bg_img,
                text_style,
                text_align,
                text_size,
                text_color
            } = this.styles;
            return `
                width: 100%;
                margin-top: ${this.$px2rem(margin_top)};
                margin-bottom: ${this.$px2rem(margin_bottom)};
                padding-top: ${this.$px2rem(padding_top)};
                padding-bottom: ${this.$px2rem(padding_bottom)};
                background-color: ${bg_color};
                background-image: url(${bg_img});
                background-size: 100% auto;
                bakcground-position: center;
                font-weight: ${text_style};
                text-align: ${text_align};
                font-size: ${this.$px2rem(text_size)};
                color: ${text_color};
            `;
        },

        /** 标题 */
        title () {
            return this.datas.title || 'Title';
        },

        /** 超链接 */
        href () {
            return this.datas.href || 'javascript: void(0);';
        }
    },

    mounted () {
        this.$emit('loaded');
    }
};
</script>

<style lang="less" scoped>
.component-wrapper {
    display: block;
    max-width: 100%;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
    text-decoration: none;
}
</style>
