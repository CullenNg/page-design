<template>
    <div class="design-layout-components">

        <!-- 加载效果 -->
        <a-spin :spinning="loading">

            <!-- 循环组件分类 -->
            <div
                v-for="category in category_list"
                :key="category.category_id"
                :class="{
                    'components-category': true,
                    'slide-up': !selected_categorys.includes(category.category_id),
                    'slide-down': selected_categorys.includes(category.category_id)
                }">
                <h3 @click="handleSlide(category.category_id)">
                    <a-icon type="caret-down" />
                    {{ category.category_title }}
                </h3>

                <!-- 组件列表，拖拽 -->
                <draggable
                    tag="ul"
                    class="dragArea components-list"
                    :list="category.components"
                    :sort="false"
                    :clone="createCloneComponent"
                    :group="{ name: 'people', pull: 'clone', put: false }">

                    <!-- 子项 -->
                    <li
                        v-for="(item, index) in category.components"
                        :key="index"
                        :data-key="item.component_key">
                        <i :class="`iconfont geshop-icon ${item.icon}`"></i>
                        <p>{{ item.component_title }}</p>
                    </li>
                </draggable>
            </div>

        </a-spin>
    </div>
</template>

<script>
import Vdc from '../../core/vdc/vdc';
import draggable from 'vuedraggable'

import {
    // 组件列表接口
    design_get_component_list
} from '../../interface/index';

export default {
    data () {
        return {
            loading: true,
            // 组件数据，包含分类+组件
            category_list: [
                {
                    category_id: 1,
                    category_title: '基础组件',
                    components: []
                }
            ], 
            selected_categorys: [], // 选中的分类ID，判断是否展示分类的组件
        }
    },

    components: {
        draggable
    },

    methods: {

        /**
         * 获取组件列表数据
         */
        async get_components_data () {
            let remote_list = await design_get_component_list();

            // 数据字段统一
            const list = remote_list.map(item => {
                // 提取必要的字段
                const cmpt = {
                    id: item.id,
                    component_key: item.component_key,
                    component_title: item.name,
                    icon: item.icon || 'geshop-icon-zhandian',
                    template_id: Number(item.tpl_id) || 0,
                }

                // 判断是否有默认模版，以及模版数据
                if (cmpt.template_id > 0 && Array.isArray(item.tplList) == true) {
                    const list = item.tplList.filter(tpl => {
                        return tpl.id === item.tpl_id;
                    });
                    // 如有匹配的模版，则读取信息
                    if (list.length > 0) {
                        cmpt.template_title = list[0].name || '模版一',
                        cmpt.template_name = list[0].name_en || 'template1'
                    }
                }
                return cmpt;
            });

            // 过滤可用的组件
            this.category_list[0].components = [...list];

            // 数据更新到 store 里面
            this.$store.commit('design/update_avavible_components', remote_list);
        },

        /**
         * 展开，收缩分类数据
         * @param {Number|String} category_id 分类ID
         */
        handleSlide (category_id) {
            if (this.selected_categorys.includes(category_id)) {
                this.selected_categorys = this.selected_categorys.filter(x => x !== category_id);
            } else {
                this.selected_categorys.push(category_id);
            }
        },

        /**
         * 开始拖拽，复制拖拽对象
         * @param {Object} dragData 拖拽对象数据
         * @returns {Vdc} 返回复制的对象
         */
        createCloneComponent (dragData) {
            // 创建组件实例
            const vdc = new Vdc({
                component_key: dragData.component_key,
                component_title: dragData.component_title,
                template_id: dragData.template_id,
            });
            return vdc;
        }
    },

    async created () {

        // 获取列表数据
        await this.get_components_data();

        // 默认展示第一个分类
        this.selected_categorys.push(this.category_list[0].category_id);

        // 清除加载状态
        this.loading = false;
    },
}
</script>

<style lang="less" scoped>
.design-layout-components {
    position: fixed;
    left: 0px;
    top: 50px;
    bottom: 0px;
    width: 240px;
    background: rgba(255,255,255,1);
    padding: 16px;
    box-sizing: border-box;
    z-index: 1;
    overflow-y: scroll;
    &::-webkit-scrollbar {
        width: 0;
    }

    .components-category {
        h3 {
            position: relative;
            font-size:14px;
            font-weight:500;
            color:rgba(63,66,69,1);
            height: 32px;
            line-height: 32px;
            margin-bottom: 0px;
            cursor: pointer;
            i {
                color: #AEB1B3;
            }
        }

        // 列表
        ul {
            list-style: none;
            padding: 0px;
            margin: 0px;
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            li {
                flex-shrink: 0;
                color: #6B7075;
                width: 96px;
                height: 64px;
                border: solid 1px #E9EAEC;
                box-sizing: border-box;
                text-align: center;
                margin-bottom: 16px;
                border-radius:4px;
                cursor: move;
                // 图标
                i {
                    font-size: 24px;
                }
                // 文案
                p {
                    font-size: 12px;
                }
            }

            // 选中状态
            li {
                &:hover, &.is-chosen {
                    background:rgba(64,158,255,1);
                    border-color: #409EFF;
                    color: #fff;
                }
            }
        }
    }

    // 组件列表的样式状态
    .components-category {

        // 展示组件数据
        .anticon-caret-down {
            transition: all .5s;
        }
        // 隐藏组件数据
        &.slide-up {
            // 箭头图标
            .anticon-caret-down {
                transform: rotate(180deg);
            }
            ul {
                display: none;
            }
        }
    }
}
</style>
