<template>
    <draggable
        class="dragArea"
        tag="ul"
        :group="{ name: 'people' }"
        :list="list"
        @change="handle_drag_change">
        <li v-for="el in list" :key="el.id">
            <template v-if="el.id">
                <controller :id="el.id" :title="el.component_title">
                    <!-- {{el}} -->
                    <component
                        :is="el.component_key"
                        :id="el.id"
                        :styles="el | styleFormate"
                        :datas="el | dataFormate"
                    />
                </controller>
            </template>    
            <template v-else>
                waiting
            </template>
        </li>
    </draggable>
</template>
<script>
import controller  from './controller.vue';
import draggable from "vuedraggable";
import { mapState } from 'vuex';

export default {
    name: "nested-draggable",
    components: {
        controller,
        draggable
    },
    computed: {
        ...mapState({
            list: state => state.design.components
        }),
    },
    methods: {
        /**
         * 拖拽结束事件变更
         */
        async handle_drag_change (data) {
            // 新增组件模式
            if (data.hasOwnProperty('added')) {
                this.$store.dispatch('design/add_page_component', {
                    component_key: data.added.element,
                    index: data.added.newIndex,
                });
            }
        },
    },

    filters: {
        // 功能数据
        dataFormate (conponent) {
            // 如果有配置项的话
            if (conponent.is_loaded_config && conponent.hasOwnProperty('config')) {
                const datas = {};
                Object.keys(conponent.config.datas).map(key => {
                    datas[key] = conponent.config.datas[key].value;
                });
                return datas;
            } else {
                return conponent.remote_data || {};
            }
        },
        // 样式数据
        styleFormate (conponent) {
            // 如果有配置项的话
            if (conponent.is_loaded_config && conponent.hasOwnProperty('config')) {
                const styles = {};
                Object.keys(conponent.config.styles).map(key => {
                    styles[key] = conponent.config.styles[key].value;
                });
                return styles;
            } else {
                return conponent.remote_style || {};
            }
        },
    },
};
</script>

<style scoped lang="less">
ul.dragArea {
    padding-left: 0px;
    list-style: none;
}
</style>