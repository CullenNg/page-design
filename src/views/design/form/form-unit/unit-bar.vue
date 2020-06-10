<template>
    <div class="form-item col-1">
        <label>{{ config.title }}</label>
        <div class="slide-bar-wrapper">
            <div style="width: 236px; float: left;">
                <a-slider
                    :min="config.min || 1"
                    :max="config.max || 100"
                    v-model="local_value"
                    @afterChange="handleChange"/>
            </div>
            <div style="width:68px; float: right;">
                <a-input-number
                    :min="config.min || 1"
                    :max="config.max || 100"
                    v-model="local_value" 
                    @change="handleChange"/>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: ['value', 'config'],

    computed: {
        local_value: {
            get () {
                return this.value;
            },
            set (newValue) {
                this.$emit('input', newValue);
            }
        }
    },
    methods: {
        handleChange (value = 0) {
            this.local_value = value;
        }
    }
}
</script>