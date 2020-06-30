<template>
    <div class="design-layout-sortable">

        <!-- 悬浮按钮 -->
        <div class="sortable-aside">
            <!-- <button :class="{ active: show }" @click="handle_show_sortable">
                <i class="iconfont design-sortable"></i>
                <p>页面</p>
            </button> -->
            <button :class="{ active: show }" @click="handle_show_sortable">
                <i class="iconfont design-sortable"></i>
                <p>楼层</p>
            </button>
            <!-- <button :class="{ active: show }" @click="handle_show_sortable">
                <i class="iconfont design-sortable"></i>
                <p>模版</p>
            </button> -->
        </div>

        <div class="design-layout-sortable-wrapper">
            <!-- 标题 -->
            <h2 class="sortable-head">楼层管理</h2>

            <div class="is-empty" v-if="page_components.length <= 0">
                <img :src="images.emptySort">
                没有组件，这里空空如也~
            </div>
        
            <!-- 内容 -->
            <a-spin :spinning="loading" v-else>
                <div
                    :class="{
                        'sortable-body': true,
                        'in-drag': inDrag,
                        'out-drag': !inDrag
                    }">

                    <!-- 删除所有组件 -->
                    <div style="text-align: right;">
                        <span class="button-clear-all" @click="handle_page_reset">清除所有组件</span>
                    </div>

                    <!-- 拖拽容器 -->
                    <draggable
                        tag="ul"
                        :list="page_components"
                        v-bind="dragOptions"
                        @start="inDrag = true">

                        <!-- 动画 -->
                        <transition-group type="transition" :name="!inDrag ? 'flip-list' : null">

                            <!-- item -->
                            <li
                                v-for="(item, index) in page_components"
                                :key="item.id"
                                :class="{
                                    'in-hover': inHover == item.id
                                }"
                                @click="handle_location_component(item, index)"
                                @mousemove="inHover = item.id"
                                @mouseleave="inHover = ''">
                                <p>{{ item.component_title || '未知组件' }} - {{ item.template_title || '未知模版' }}</p>

                                <div class="buttons">
                                    <!-- 删除 -->
                                    <span class="ignore-elements" @click.stop="handle_component_copy(item.id, item.component_key, index)">
                                        <i class="iconfont design-copy" />
                                    </span>
                                    <span class="ignore-elements" @click.stop="handle_component_delete(index)">
                                        <i class="iconfont design-delete-2" />
                                    </span>
                                </div>
                            </li>
                        </transition-group>

                    </draggable>

                </div>
            </a-spin>

        </div>


    </div>
</template>

<script>
import draggable from 'vuedraggable';
import emptySort from '@/resource/images/empty-sort.png';

export default {
    data () {
        return {
            loading: false,
            // 拖拽组件参数
            dragOptions: {
                animation: 200, // 动画时间
                group: "description",
                disabled: false,
                ghostClass: "sortable-ghost",
                dragClass: "sortable-drag",
                filter: ".ignore-elements"
            },
            inDrag: false, // 是否正在拖拽
            inHover: 0, // 鼠标 hover 的 <li> 的 component_id
            images: {
                emptySort
            }
        };
    },

    computed: {
        // 组件信息
        page_components: {
            get () {
                return this.$store.state.page.components || [];
            },
            set (arr) {
                this.$store.dispatch('design/page_update_layout_v2', arr);
            }
        },
        // 根据是否展示组件配置项，决定组件排序组件是否展示
        show () {
            return !this.$store.state.design.show_component_form;
        }
    },

    components: {
        draggable
    },

    methods: {

        /**
         * 结束拖拽
         */
        handleDragEnd (c) {
            this.inDrag = false;
        },

        /**
         * 保存排序数据
         */
        save_layouts_sort () {
            // 更新到 store 里面
            this.$store.dispatch('design/page_update_layout_v2', this.layouts);
        },

        /**
         * 删除组件
         * @param {Number} index 数组索引
         */
        handle_component_delete (index) {
            this.page_components.splice(index, 1);
        },

        /**
         * 复制组件
         * @param {Number} id 组件ID
         * @param {String} component_key 组件编码
         * @param {Number} index 组件顺序索引
         */
        async handle_component_copy (id, component_key, index) {
            this.$message.warning('复制功能还没准备好。');
        },

        /**
         * 粘贴组件
         * @param {Number} id 组件ID
         */
        handle_component_paste (id) {
            this.$store.dispatch('design/component_paste', id);
        },

        /**
         * 删除所有组件
         */
        handle_page_reset () {
            this.$store.dispatch('design/page_reset');
        },

        /**
         * 展示排序弹层
         */
        handle_show_sortable () {
            this.$store.dispatch('design/form_close');
        },

        /**
         * 中间预览区域，定位到点击的组件
         * @param {Vdc} component 组件对象
         */
        handle_location_component (component, index) {
            this.$store.dispatch('design/component_locate_by_floor', { component, index });
        }
    }
}
</script>

<style lang="less" scoped>

// 整体布局
.design-layout-sortable {
    position: fixed;
    right: 0px;
    top: 50px;
    bottom: 0px;
    width: 360px;
    background: #fff;
    box-sizing: border-box;
}
.design-layout-sortable-wrapper {
    position: relative;
    padding: 24px;
    overflow-y: auto;
    height: 100%;
}

// 标题
.sortable-head {
    padding: 0px;
    margin: 0px;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 13px;
    color: #3F4245;
}

// 为空
.is-empty {
    text-align: center;
    color: #C7DCFF;
    font-size: 14px;
    margin-top: 170px;
    img {
        margin: 0 auto;
        display: block;
    }
}

// 拖拽区域
.sortable-body {

    // 删除所有组件
    .button-clear-all {
        display: inline-block;
        width: 88px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        margin-bottom: 12px;
        font-size: 12px;
        cursor: pointer;
        &:hover {
            background:rgba(240,242,245,1);
            border-radius:12px;
        }
    }

    // 组件列表
    ul {
        list-style: none;
        padding: 0px;
        margin: 0px;

        li {
            cursor: move;
            position: relative;
            padding: 0 24px;
            margin-bottom: 16px;
            width: 100%;
            height: 48px;
            line-height: 48px;
            background: #fff;
            border-radius: 24px;
            box-sizing: border-box;
            box-shadow: 0px 0px 0px 1px #E9EAEC;


            // 鼠标滑过
            &.in-hover {
                background: #409EFF;
                color: #fff;
                box-shadow: 0px 2px 6px 0px rgba(188,195,206,0.8);
                span {
                    color: #409EFF;
                }
                .buttons {
                    display: block;
                }
            }

            // 拖拽中
            &.sortable-ghost, &.sortable-chosen {
                opacity: .2 !important;
                background: #409EFF;
                box-shadow: 0px 2px 6px 0px rgba(188,195,206,0.8);
                color: #fff;
                span {
                    color: #409EFF;
                }
            }

            p {
                margin: 0px;
            }

            // 按钮区域
            .buttons {
                display: none;
                position: absolute;
                right: 24px;
                top: 0px;
                bottom: 0px;
                text-align: right;

                > span {
                    text-align: center;
                    vertical-align: middle;
                    display: inline-block;
                    background: #fff;
                    border-radius: 100%;
                    width: 24px;
                    height: 24px;
                    line-height: 24px;
                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }
    }
}

// 侧边按钮
.sortable-aside {
    position: absolute;
    right: 100%;
    margin-right: 8px;
    top: 200px;
    
    button {
        width:56px;
        height:56px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 6px 0px rgba(188,195,206,1);
        border-radius:8px;
        border: none;
        outline: none;
        line-height: 1em;
        color: #6B7075;
        padding-top: 4px;
        
        i {
            font-size: 23px;
        }
        p {
            font-size: 12px;
            line-height: 12px;
            margin: 0px;
            margin-top: 4px;
        }
    }
    button:hover, button.active {
        background: #409EFF;
        color: #fff;
        cursor: pointer;
    }
}


.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}

</style>
