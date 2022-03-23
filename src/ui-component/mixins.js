export default {
    props: {
        // 组件唯一ID
        id: {
            type: String | Number,
            required: true
        },
        // 业务数据
        datas: {
            type: Object,
            default () {
                return {}
            }
        },
        // 样式数据
        styles: {
            type: Object,
            default () {
                return {}
            }
        },
    },

    computed: {
        // 语言包
        languages () {
            return {}
        }
    },

    // 默认的生命周期 -》加载完毕
    mounted () {
        this.$emit('loaded');
    }
}