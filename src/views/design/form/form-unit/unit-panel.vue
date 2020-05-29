<template>
    <div class="form-group" ref="dom">
        <!-- 标题 -->
        <div class="form-group-title" @click="handle_toogle_slide">
            <a-icon type="caret-down" v-if="slide"/>
            {{ title }}
            <span class="form-group-desc">{{ desc }}</span>
        </div>

        <!-- 自定义内容 -->
        <div class="form-group-body">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // 标题
        title: {
            type: String
        },
        // 描述
        desc: {
            type: String
        },
        // 文案内容
        content: {
            type: String
        },
        // 是否开启展示功能，默认开启
        slide: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        /**
         * 通过 class 来 [收起/展开] 内容
         */
        handle_toogle_slide () {
            // 判断是否开启了功能
            if (!this.slide) return false;
            // 判断当前状态
            const dom = $(this.$refs.dom);
            const class_name = 'is-hide';
            dom.hasClass(class_name) ? dom.removeClass(class_name) : dom.addClass(class_name);
        }
    }
}
</script>

<style lang="less">
.design-form-body {

    .form-group {
        margin-top: 40px;
    }

    // panel 标题
    .form-group-title {
        font-size: 16px;
        font-weight:600;
        color:rgba(63,66,69,1);
        line-height: 22px;
        cursor: pointer;

        // 标题箭头
        .anticon-caret-down {
            transition: all .5s;
        }
    }

    // panel 描述
    .form-group-desc {
        font-size: 14px;
        color: #999;
        font-weight: normal;
    }

    // panel 内容
    .form-group-body {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    // panel 隐藏模式下
    .form-group.is-hide {
        // 箭头动画
        .anticon-caret-down {
            transform: rotate(180deg);
        }
        // 隐藏具体内容
        .form-group-body {
            display: none;
        }
    }
}
</style>