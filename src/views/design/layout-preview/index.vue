<template>
    <div
        id="design-middle-layout"
        class="design-layout-preview"
        @click.self="$store.dispatch('design/form_close')">

        <!-- 主要布局，中间，最小宽度 375x667 -->
        <div class="main-layout is-app">
            
            <!-- 拖拽区域 -->
            <nexted />

            <!-- 空信息 -->
            <div class="is-empty" v-if="components.length <= 0">
                <img :src="images.emptyImage">
                哎哟，您还没有放置组件哦~
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'
import controller  from './controller.vue';
import emptyImage from '@/resource/images/empty-preview.png';
import nexted from './nested';

export default {

    components: {
        draggable,
        controller,
        nexted
    },

    data () {
        return {
            // 拖拽组件参数
            dragOptions: {
                group: "description",
                disabled: false,
                touchStartThreshold: 5,
                ghostClass: "sortable-ghost",
                dragClass: "sortable-drag",
                filter: ".controller-title, .controller-aside", // 不允许此元素拖拽
            },
            images: {
                emptyImage 
            }
        };
    },

    computed: {
        ...mapState({
            components: state => state.design.components
        }),
    },

    methods: {
        /**
         * 开始拖拽
         */
        handle_drag_start () {
            this.$store.state.design.preview_in_drag = true;
        },

        /**
         * 结束拖拽
         */
        handle_drag_end () {
            this.$store.state.design.preview_in_drag = false;
        }
    }
}
</script>

<style lang="less" scoped>

.design-layout-preview {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 100%;
    padding-top: 114px;
    padding-bottom: 100px;
    overflow-y: scroll;

    // 主要预览布局
    .main-layout {
        position: relative;
        margin: 0 auto;
        width: 10rem;
        min-height: 667px;
        background: #fff;
        box-shadow:-10px 20px 30px 0px rgba(192,197,205,0.8);
   
        // 空数据的样式
        .is-empty {
            position: absolute;
            left: 0px;
            top: 270px;
            right: 0px;
            text-align: center;
            color: #C7DCFF;
            font-size: 14px;
            img {
                margin: 0 auto;
                display: block;
            }
        }
    }

    // 拖拽区域
    .dragArea {
        min-height: 667px;
        > span {
            display: block;
            min-height: 667px;
        }
    }
}

// 拖拽效果
.flip-list-move {
    transition: transform 0.5s;
}

// 拖拽组件容器
.list-group-item {
    position: relative;
    &.is-hover {
        &:before {
            position: absolute;
            content: " ";
            left: 0px;
            bottom: 0px;
            top: 0px;
            right: 0px;
            border: dashed 2px #409EFF;
        }
        .component-controller {
            display: block;
        }
    }

    // 选中打开表单中
    &.is-active {
        &::before {
            position: absolute;
            content: " ";
            left: 0px;
            bottom: 0px;
            top: 0px;
            right: 0px;
            border: solid 3px #409EFF;
        }
    }
}
</style>

<style lang="less">

// 拖拽时的样式
.design-layout-preview {
    .main-layout {
        .dragArea {
            > .sortable-ghost {
                position: relative;
                list-style: none;
                width: 100%;
                height: 100px;
                line-height: 100px;
                text-align: center;
                background:rgba(64,158,255,0.3) !important;
                cursor: move;

                i,
                p,
                .component-box,
                > .dragArea {
                    display: none;
                }

                > * {
                    display: none;
                }

                &:before {
                    position: absolute;
                    content: " ";
                    left: 0px;
                    bottom: 0px;
                    top: 0px;
                    right: 0px;
                    border: 3px solid rgba(64,158,255,1);
                }
                &:after {
                    top: 0px;
                    content: "我要在这里";
                }
            }
        }
    }
}

// 测试信息
.debuger-info {
    background: #333;
    color: #fff;
    padding: 10px;
    label {
        font-weight: bold;
    }
    p {
        margin: 0px;
        margin-bottom: 10px;
    }
}
</style>
