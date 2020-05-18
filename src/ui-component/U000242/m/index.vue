<template>
    <div
        class="component-wrapper u000242"
        :style="wrapper_style">

        <a
            :class="{
                'bold': styles.text_style == '1'
            }"
            :href="datas.jump_link || 'javascript: void(0);'"
            :style="a_style">
            {{ datas.title || 'Title' }}
        </a>

    </div>
</template>

<script>
export default {
    props: ['styles', 'datas'],

    computed: {
        // 组件配置
        wrapper_style () {
            const {
                margin_top,
                margin_bottom,
                padding_top,
                padding_bottom,
                bg_color,
                bg_img
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
            `;
        },
        // a标签的样式
        a_style () {
            const { text_size, text_color } = this.styles;
            return `
                font-size: ${this.$px2rem(text_size)};
                color: ${text_color};
            `;
        }
    },

    mounted () {
        this.$emit('loaded');
    }
};
</script>

<style lang="less" scoped>

.component-wrapper {
    max-width: 100%;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
    a {
        text-decoration: none;
    }
}

.component-debuger {
    font-size: 14px;
    text-align-last: left;
    background: #333;
    color: #fff;
    padding: 10px;
}

</style>
