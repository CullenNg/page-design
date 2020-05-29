<template>
    <transition name="slide-fade">
        
        <div class="design-layout-form" v-if="show">
            
             <!-- 组件标题 -->
            <h2 class="form-head">{{ component_title || 'unknow' }}组件</h2>

            <!-- 循环所有的组件表单 -->
            <template v-for="id in layouts">

                <!-- 组件表单 -->
                <form-content
                    v-if="id === selected_id"
                    :id="id"
                    :key="id">
                </form-content>

            </template>

        </div>

    </transition>
</template>

<script>

import formContent from './tab-content.vue';

export default {

    components: {
        formContent
    },

    data () {
        return {
            // 组件标题
            component_title: '', 
        }
    },

    computed: {
        show () {
            return this.$store.state.design.show_component_form;
        },

        /**
         * 选中的组件ID
         */
        selected_id () {
            return this.$store.state.design.selected_id;
        },
        
        /**
         * 获取所有组件
         */
        layouts () {
            return this.$store.state.page.layouts;
        }
    },

    watch: {
        /**
         * 监听选中的组件ID，如果有变更，则重新加载数据
         */
        selected_id (id) {
            if (this.show === true) {
                this.load(id);
            }
        }
    },

    methods: {
        /**
         * 读取组件标题
         * @param {number} 组件ID
         */
        async load (id) {
            this.component_title = this.$store.state.page.components.filter(x => x.id === id)[0].component_title;
        }
    }
}
</script>

<style lang="less" scoped>
.design-layout-form {
    background: #fff;
    width: 360px;
    position: fixed;
    right: 0px;
    top: 50px;
    bottom: 0px;
    z-index: 1;
    transition: all 0.5s;
    padding: 24px;
    padding-right: 0px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
}

// 标题
.form-head {
    padding: 0px;
    margin: 0px auto 16px;
    font-size: 18px;
    font-weight: 600;
    color: #3F4245;
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
