<template>
    <div :class="`form-item col-${config.col || 1}`">
        <label>{{ config.title }}</label>
        <a-radio-group
            v-model="current_value.status"
            @change="handle_radio_change">
            <a-radio
                :value="1"
                :key="1">
                是
            </a-radio>
            <a-radio
                :value="0"
                :key="0">
                否
            </a-radio>
        </a-radio-group>

        <template v-if="current_value.status == 1">
            <p style="color: #999; margin-top: 10px;">如开启分页功能，水平导航可能不能正常工作</p>
        </template>

        <template v-if="current_value.status == 0">
            <label style="margin-top: 10px;">展示数量</label>
            <div>
                <a-select
                    size="large"
                    style="width: 100%"
                    v-model="current_value.pageSize"
                    @change="handle_select_change">
                    <a-select-option
                        v-for="item in options"
                        :key="item.value"
                        :value="item.value">
                        {{ item.value }}
                    </a-select-option>
                </a-select>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    props: ['value', 'config'],

    data () {
        return {
            options: [
                { value: 20 },
                { value: 60 },
                { value: 120 }
            ],
            current_value: {
                status: 1,
                pageSize: 30
            },
        }
    },

    methods: {

        /**
         * 下拉选择的值变更
         */
        handle_select_change (value = '') {
            this.current_value.pageSize = value;
            this.$emit('input', this.current_value);
        },

        /**
         * 切换是否分页开关
         */
        handle_radio_change () {
            this.$emit('input', this.current_value);
        }
    },

    created () {
        const status = !isNaN(this.value.status) ? this.value.status : 1;
        this.current_value.status = parseInt(status);
        this.current_value.pageSize = this.value.pageSize || 20;
    },

}
</script>
