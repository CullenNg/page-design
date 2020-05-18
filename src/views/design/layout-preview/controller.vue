<template>
    <div class="component-controller" v-if="component">
        <!-- 组件标题 -->
        <div class="controller-title">
            {{ component.component_title }}-{{ component.template_title }}
        </div>

        <!-- 组件删除 -->
        <div class="controller-aside">
            <button class="button-remove" @click="handle_component_delete(id)">
                <i class="iconfont design-delete"></i>
            </button>
        </div>

        <!-- UI组件的入口 -->
        <div
            :class="{
                'design-component': true,
                'is-active': design_selected_id === id,
                'is-hover': in_drag == false && mouse_hover_id === id
            }"
            @click="handle_component_select(id)"
            @mouseenter="handle_component_hover(id)"
            @mouseleave="handle_component_leave">
                
            <load-component
                v-if="component"
                :id="id"
                :uikey="component.component_key"
                :template="component.template_name || 'template1'">
            </load-component>
        </div>

        <!-- <p>组件数据：{{ component }}</p> -->
    </div>
</template>

<script>

// 组件加载主体
import loadComponent from '../../../components/ui-component-load/index.vue';

export default {
    // 传入组件ID
    props: ['id'],

    components: {
        loadComponent
    },

    data () {
        return {
            mouse_hover_id: 0, // 鼠标经过的ID,
            // 真实组件
            component_module: null,
            dataset: {
                datas: {},
                styles: {}
            }
        };
    },

    computed: {
        // 页面所有组件
        layouts () {
            return this.$store.state.page.layouts;
        },
        // 返回当前组件
        component () {
            return this.$store.state.page.components.filter(x => x.id === this.id)[0];
        },
        // 装修页选中的组件ID
        design_selected_id () {
            return this.$store.state.design.selected_id;
        },
        // 是否在拖拽状态中
        in_drag () {
            return this.$store.state.design.preview_in_drag;
        }
    },

    methods: {
        /**
         * 删除组件
         * @param {number} id 组件ID
         */
        handle_component_delete (id) {
            this.$store.dispatch('design/component_delete', id);
        },

        /**
         * 选择组件
         * @param {number} id 组件ID
         * @param {string} component_key 组件的KEY
         * @param {string} template 组件的模版，默认 template1
         */
        handle_component_select (id) {
            this.$store.dispatch('design/form_open', id);
        },

        /**
         * 鼠标经过组件，增加虚线
         * @param {number} id 组件ID
         */
        handle_component_hover (id) {
            this.mouse_hover_id = id;
        },

        /**
         * 鼠标离开组件，删除虚线
         * @param {number} id 组件ID
         */
        handle_component_leave () {
            this.mouse_hover_id = '';
        }
    }
};
</script>

<style lang="less" scoped>

// 组件容器
.design-component {
    position: relative;
    overflow: hidden;

    &:before {
        display: none;
        position: absolute;
        content: " ";
        left: 0px;
        bottom: 0px;
        top: 0px;
        right: 0px;
        border: dashed 2px #409EFF;
        z-index: 2;
    }

    // 组件容器 - 鼠标经过
    &:hover {
        &::before {
            display: block;
        }
    }

    // 组件容器 - 选中
    &.is-active {
        &::before {
            border: solid 3px #409EFF;
            display: block;
        }
    }
}

// 控制栏容器
.component-controller {
    position: relative;
    &:hover {
        .controller-aside {
            display: block;
        }
    }
}


// 删除组件
.controller-aside {
    display: none;
    position: absolute;
    left: 100%;
    padding-left: 8px;

    > button {
        outline: none;
        border: none;
        width: 36px;
        height: 36px;
        background: #fff;
        box-shadow:-1px 2px 6px 0px rgba(188,195,206,1);
        border-radius: 36px;
        cursor: pointer;
        color: #AEB1B3;
        i {
            font-size: 23px;
        }
        &:hover {
            color: #409EFF;
        }
    }
}


// 组件标题
.controller-title {
    position: absolute;
    right: 100%;
    top: 0px;
    height:32px;
    line-height: 32px;
    background:rgba(255,255,255, 0.4);
    border-radius:16px;
    padding: 0 16px;
    word-break: keep-all;
    white-space: nowrap;
    font-size:14px;
    transform: translateX(-8px);
    color: #6B7075;
}
</style>