<template>
    <div class="unit-tab">
        <template v-for="(item, tabIndex) in list">

            <!-- 标题 -->
            <div class="unit-tab-title" :key="`title-${tabIndex}`">
                {{ config.itemTitle }} {{ tabIndex + 1 }}
            </div>

            <!-- 遍历 tab -->
            <div class="unit-tab-wrapper" :key="tabIndex">
                
                <!-- 遍历配置项 -->
                <div
                    class="form-item col-1"
                    v-for="(key, itemIndex) in Object.keys(item)"
                    :key="itemIndex">

                    <!-- 文本框 -->
                    <template v-if="config.options[key].type === 'text'">
                        <label> {{ config.options[key].title }} </label>
                        <a-input
                            size="large"
                            placeholder="请输入"
                            v-model="item[key]">
                        </a-input>
                    </template>
                    
                    <!-- 其他控件 -->
                    <unit-entry
                        v-else
                        v-model="item[key]"
                        :type="config.options[key].type"
                        @input="emit"
                        :tab="item"
                        :tabIndex="tabIndex"
                        :config="config.options[key]"
                        :rootConfig="rootConfig">
                    </unit-entry>
                </div>

                <!-- 按钮组合 -->
                <div class="unit-tab-controller">

                    <!-- 上移 -->
                    <i
                        class="iconfont unit-tab-up"
                        v-show="tabIndex > 0"
                        @click="handle_up(tabIndex)"/>

                    <!-- 下移 -->
                    <i
                        class="iconfont unit-tab-down"
                        v-show="(tabIndex < list.length - 1) && list.length > 1"
                        @click="handle_down(tabIndex)"/>

                    <!-- 删除 -->
                    <i
                        class="iconfont unit-tab-delete"
                        v-show="list.length > 1"
                        @click="handle_remove(tabIndex)"/>

                    <!-- 增加 -->
                    <i
                        class="iconfont unit-tab-add"
                        @click="handle_add(tabIndex)"/>

                </div>
            </div>
        </template>
    </div>
</template>

<script>
import unitEntry from './index.vue';

export default {
    props: ['id', 'value', 'config', 'rootConfig'],
    data () {
        return {
            list: []
        }
    },

    components: {
        unitEntry,
    },

    methods: {
        // 获取克隆的数据结构
        get_clone () {
            const clone = {};
            // 更新默认的 value 值
            Object.keys(this.config.options).map(key => {
                clone[key] = this.config.options[key].value;
            });
            return Object.assign({}, clone);
        },

        // 增加
        handle_add (tabIndex) {
            this.list.splice(tabIndex + 1, 0, this.get_clone());
        },

        // 删除
        handle_remove (tabIndex) {
            this.list.splice(tabIndex, 1);
        },

        // 上移
        handle_up (tabIndex) {
            // 获取当前目标，并删除
            const target = Object.assign({}, this.list.filter((x,y) => y === tabIndex)[0]);
            this.list.splice(tabIndex, 1);
            // 插入
            this.list.splice(tabIndex - 1, 0, target);
        },

        // 下移
        handle_down (tabIndex) {
            // 获取当前目标，并删除
            const target = Object.assign({}, this.list.filter((x,y) => y === tabIndex)[0]);
            this.list.splice(tabIndex, 1);
            // 插入
            this.list.splice(tabIndex + 1, 0, target);
        },

        // target 插入元素, tabIndex: 下标值
        emit (e, target, tabIndex) {
            this.list.splice(tabIndex, 1, target);
        }

    },

    created () {
        // 获取 prop 数据，如果为空则添加1条记录
        this.list = this.value || [];
        if (this.list.length <= 0) {
            this.list.push(this.get_clone());
            this.$emit('input', this.list);
        }
    }
}
</script>

<style lang="less" scoped>

.unit-tab {
    width: 100%;
}

.unit-tab-title {
    margin-bottom: 4px;
}

.unit-tab-wrapper {
    position: relative;
    border-radius:2px;
    border:1px solid rgba(232,234,236,1);
    padding: 16px;
    box-sizing: border-box;
    width: 100%;
    margin-bottom: 16 + 30px;
}

.unit-tab-controller {
    position: absolute;
    height: 24px;
    right: 0px;
    bottom: -29px;
    i {
        cursor: pointer;
        font-size: 24px;
        color: #9FBED5;
        &:hover {
            color: #709EC0;
        }
    }
}
</style>
