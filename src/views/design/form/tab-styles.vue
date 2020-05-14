<template>
    <div>
        <!-- 循环样式配置项 -->
        <template v-for="(group, index) in layout">

            <div
                :key="index"
                :class="{
                    'form-group': true,
                    'is-hide': slideup_group_index.includes(index)
                }">

                <!-- 标题 -->
                <div class="form-group-title" @click="handle_group_toggle(index)">
                    <a-icon type="caret-down"/>
                    {{ group.title }}
                </div>

                <div class="form-group-body">

                    <template v-for="key in group.groups">
                        <!-- 如果是自定义的组件 -->
                        <template v-if="is_diy(configs[key].type)">
                            <component
                                v-model="configs[key].value"
                                :key="key"
                                :is="units[configs[key].type]"
                                :config="configs[key]"
                                :rootConfig.sync="rootConfig">
                            </component>
                        </template>

                        <!-- 非自定义 -->
                        <template v-else>
                            <div :key="key" :class="`form-item col-${configs[key].col || 1}`">

                                <!-- 配置项名字 -->
                                <label> {{ configs[key].title }} </label>

                                <!-- 文本输入框 -->
                                <template v-if="configs[key].type ==='text' || !configs[key].type ">
                                    <a-input
                                        v-model="configs[key].value"
                                        size="large"
                                        :maxlength="configs[key].max || 200"
                                        placeholder="请输入">
                                    </a-input>
                                </template>

                                <!-- 数字输入框 -->
                                <template v-if="configs[key].type ==='number'">
                                    <a-input-number
                                        :disabled="configs[key].disabled ? true : false"
                                        :min="set_number_min(configs[key].min)"
                                        :max="set_number_max(configs[key].min)"
                                        v-model="configs[key].value"
                                        @change="handle_number_change(key)"/>
                                </template>

                                <!-- 单选 radio -->
                                <template v-if="configs[key].type === 'radio'">
                                    <a-radio-group v-model="configs[key].value">
                                        <a-radio
                                            :value="x.value"
                                            v-for="(x, index) in configs[key].options"
                                            :key="index">
                                            {{ x.label }}
                                        </a-radio>
                                    </a-radio-group>
                                </template>

                                <!-- 多选 -->
                                <template v-if="configs[key].type === 'checkbox'">
                                    <a-checkbox-group v-model="configs[key].value">
                                        <a-checkbox value="A">A</a-checkbox>
                                        <a-checkbox value="B">B</a-checkbox>
                                        <a-checkbox value="C">C</a-checkbox>
                                        <a-checkbox value="D">D</a-checkbox>
                                        <a-checkbox value="E">E</a-checkbox>
                                    </a-checkbox-group>
                                </template>
                            </div>
                        </template>

                    </template>
                </div>
            </div>
        </template>
        <!-- {{ configs }} -->
    </div>
</template>

<script>

// 颜色选择器
import colorPicker from './unit-color.vue';
import goods from './unit-goods.vue';
import imagePicker from './unit-image.vue';
import images from './unit-images.vue';
import bar from './unit-bar.vue';
import tab from './unit-tab.vue';
import navigator from './unit-navigator.vue';
import page from './unit-page.vue';
import connection from './unit-connection';
import sort from './unit-sort';

export default {
    props: ['id', 'type', 'layout'],

    data () {
        return {
            // 自定义的表单控件
            units: {
                color: colorPicker,
                goods: goods,
                image: imagePicker,
                images,
                bar,
                tab,
                navigator,
                page,
                connection,
                sort
            },
            // layout: [], // 配置项的排列
            configs: {}, // 配置项详细字段,
            rootConfig: {}, // 根配置
            slideup_group_index: [], // 记录隐藏的配置集合的索引值，默认全部展开
        }
    },

    methods: {
        // 判断是否自定义控件
        is_diy (type) {
            const map = [
                'color',
                'goods',
                'image',
                'images',
                'bar',
                'tab',
                'navigator',
                'page',
                'connection',
                'sort'
            ];
            return map.includes(type);
        },

        // 设置数值最小
        set_number_min (val) {
            if (Number(val) === 0) {
                return 0;
            } else {
                return Number(val) || -9999;
            }
        },

        // 设置数值最大值
        set_number_max (val) {
            return Number(val) || 9999;
        },

        // 数字输入框，值变化，绑定其他配置项的值
        handle_number_change (key) {
            let value = this.configs[key].value;
            // 如果值为空，则默认改为0
            if (value === '') {
                value = 0;
            }
            try {
                if (this.configs[key].hasOwnProperty('bind')) {
                    const bindStr = this.configs[key].bind;
                    eval('this.configs.' + bindStr + '=' + value);
                }
            } catch (err) {
                console.log(err);
            }
        },

        /**
         * 收起/展开 配置项组合
         * @param {Number} index 组合数组索引
         */
        handle_group_toggle (index)  {
            if (this.slideup_group_index.includes(index)) {
                this.slideup_group_index = this.slideup_group_index.filter(x => x != index);
            } else {
                this.slideup_group_index.push(index);
            }
        }
    },

    created () {
        // 加载组件对应的 config 文件 
        //this.layout = this.$store.state.page.components.filter(x => x.id === this.id)[0].config.layout[this.type];
        // 当前tab的配置
        this.configs = this.$store.state.page.components.filter(x => x.id === this.id)[0].config[this.type];
        // 根配置
        this.rootConfig = this.$store.state.page.components.filter(x => x.id === this.id)[0].config;
    }
}
</script>
