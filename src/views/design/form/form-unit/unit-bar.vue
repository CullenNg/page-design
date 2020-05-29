<template>
    <div class="form-item col-1">
        <label>{{ config.title }}</label>
        <div class="slide-bar-wrapper">
            <div style="width: 236px; float: left;">
                <a-slider
                    :min="config.min || 1"
                    :max="config.max || 100"
                    v-model="local_value"
                    @afterChange="handle_bar_change"/>
            </div>
            <div style="width:68px; float: right;">
                <a-input-number
                    :min="config.min || 1"
                    :max="config.max || 100"
                    v-model="local_value2" 
                    @change="handle_input_change"/>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: ['value', 'config'],

    data () {
        let local_value = 0;
        const prop_value = Number(this.value);
        // 强制转 Number 类型，判断大小
        if (prop_value >= this.config.min && prop_value <= this.config.max) {
            local_value = prop_value;
        } else {
            if (prop_value < this.config.min) {
                local_value = this.config.min;
            }
            if (prop_value > this.config.max) {
                local_value = this.config.max;
            }
        }
        return {
            local_value,
            local_value2: local_value
        }
    },

    methods: {
        handle_bar_change (value = 0) {
            this.local_value2 = value;
            this.$emit('input', value);
        },
        handle_input_change (value = 0) {
            if (typeof(value) === 'number') {
                this.local_value = value;
            }
            this.local_value2 = value;
            this.$emit('input', value);
        }
    }
}
</script>