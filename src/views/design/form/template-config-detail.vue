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
                        <component
                            v-if="is_diy(configs[key].type)"
                            v-model="configs[key].value"
                            :key="key"
                            :is="units[configs[key].type]"
                            :config="configs[key]"
                            :rootConfig.sync="rootConfig">
                        </component>

                        <!-- 非自定义 -->
                        <div
                            v-else
                            :key="key"
                            :class="`form-item col-${configs[key].col || 1}`">

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
                </div>
            </div>
        </template>
    </div>
</template>

<script>

// 所有控件
import {
    colorPicker,
    goods,
    imagePicker,
    images,
    bar,
    tab,
    page,
    sort
} from './form-unit/index.js';

export default {
    props: ['type', 'layout', 'configs', 'rootConfig'],

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
                page,
                sort
            },
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
                'page',
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
            } catch (err) {}
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
    }
}
</script>
