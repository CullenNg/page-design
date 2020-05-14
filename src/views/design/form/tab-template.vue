<template>
    <ul class="sheet-list">
        <template v-for="template in list">
            <li
                :key="template.id"
                :class="{ 'active': template_id == template.id }"
                @click="handle_change_template(template)">
                <i :class="`iconfont geshop-icon icon-${component_key}-${template_name_en}`"></i>
            </li>
        </template>
    </ul>
</template>

<script>
export default {
    props: {
        // 组件ID
        component_id: {
            required: true
        },
        // 模版列表
        list: {
            type: Array,
            required: true
        }
    },

    data () {
        return {
            component_key: '',
            // 当前选中的模版ID
            template_id: 0, 
            template_name_en: 'template1',
            // 模版列表字段: [
            //     {
            //         "id": 510,
            //         "name_en": "template1",
            //         "name": "模版一",
            //         "status": 1,
            //         "is_vue_ssr": 0,
            //         "is_async": 1,
            //         "pic": "https://geshop.s3.amazonaws.com/uploads/Qb3CnSX49rdzpeEtuIs2B6GNy0q578MF.png",
            //         "component_key": "U000244",
            //         "create_user": "wujianeng",
            //         "create_time": 1566895923,
            //         "update_user": "wujianeng",
            //         "update_time": 1567733413,
            //         "is_delete": 0,
            //         "place": 1
            //     }
            // ]
        }; 
    },

    methods: {
        /**
         * 切换模版
         * @param {Number} id 模版ID
         * @param {String} name 模版标题
         * @param {String} name_en 模版文件夹
         */
        handle_change_template ({ id, name, name_en }) {
            if (id === this.template_id) return false;
            this.template_id = id;
            // 获取组件信息，更新选中的模版值
            const component_info = this.$store.state.page.components.filter(x => x.id === this.component_id)[0];
            component_info.template_id = id;
            component_info.template_name = name_en;
            component_info.template_title = name;
            // 获取组件配置信息
            this.$emit('update', component_info.template_title, component_info.template_id);
        }
    },

    created () {
        // 组件信息
        const component_info = this.$store.state.page.components.filter(x => x.id === this.component_id)[0];
        this.component_key = component_info.component_key;
        this.template_name_en = component_info.template_name;

        // 默认选中
        this.template_id = component_info.template_id;
        this.$emit('update', component_info.template_title, component_info.template_id);
    }
}
</script>

<style lang="less" scoped>
    
    // 模版选择
    ul.sheet-list {
        display: flex;
        flex-wrap: wrap;
        padding: 0px;
        margin: 0px;
        list-style: none;
        margin-top: 16px;
        li {
            flex-shrink: 0;
            width: 56px;
            height: 40px;
            border: solid 1px #ddd;
            box-sizing: border-box;
            margin-right: 10px;
            border-radius: 2px;
            cursor: pointer;
            text-align: center;
            line-height: 40px;
            color: #C9CED1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        li.active {
            border-color: #409EFF;
            color: #409EFF;
        }
        i.iconfont {
            font-size: 28px;
        }
    }

</style>