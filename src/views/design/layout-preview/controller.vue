<template>
    <div class="component-controller">
        <!-- 组件标题 -->
        <div class="controller-title">{{title}}</div>

        <!-- 组件删除 -->
        <div class="controller-aside">
            <button class="button-remove" @click="$store.dispatch('design/delete_page_component', id);">
                <i class="iconfont design-delete"></i>
            </button>
        </div>

        <!-- UI组件的入口 -->
        <div
            :class="{
                'design-component': true,
                'is-active': design_selected_id === id && show_component_form === true,
                'is-hover': in_drag == false && mouse_hover_id === id,
            }"
            @click="$store.dispatch('design/form_open', id);"
            @mouseenter="mouse_hover_id = id"
            @mouseleave="mouse_hover_id = ''">
            <slot />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    props: {
        id: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            default: '未命名组件'
        }
    },

    data () {
        return {
            mouse_hover_id: 0, // 鼠标经过的ID
        };
    },

    computed: {
        ...mapState({
            design_selected_id: state => state.design.selected_id,  // 装修页选中的组件ID
            show_component_form: state => state.design.show_component_form,
            in_drag: state => state.design.preview_in_drag // 是否在拖拽状态中
        }),
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

// 布局容器控制栏
.controller-panel {
    background-color: #409EFF;
    color: #fff;
    height: 40px;
    line-height: 40px;
    padding-left: 14px;
    cursor: pointer;
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