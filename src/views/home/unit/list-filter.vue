<template>
    <div class="list-filter">
        <a-input-group compact size="large">
            <a-select v-model="current_search_key" style="width:140px">
                <template v-for="option in search_key_optinos">
                    <a-select-option :value="option.key" :key="option.key">{{ option.label }}</a-select-option>
                </template>
            </a-select>
            <a-input v-model="search_value" @pressEnter="handle_search" :placeholder="current_search_placeholder" />
        </a-input-group>
        <a-button size="large" type="primary" @click="handle_new">+新增页面</a-button>
    </div>
</template>

<script>

// 页面列表
import getPageList from '@/interface/json-data/design_get_page_info.json';

export default {
    props: ['pageNo', 'pageSize', 'site', 'reflesh'],
    data () {
        return {
            // 当前搜索的字段名称
            current_search_key: 'keywords',
            search_value: '',
            search_key_optinos: [
                { key: 'keywords', label: '页面名称', },
            ]
        };
    },

    computed: {
        platform () {
            return 'wap';
        },
        current_search_placeholder () {
            const item = this.search_key_optinos.filter(x => x.key == this.current_search_key)[0];
            return '请输入需要搜索的' + item.label;
        }
    },

    watch: {
        // 监听页码的变更
        pageNo () {
            this.handle_search();
        },
        platform () {
            this.handle_search();
        },
        reflesh () {
            this.handle_search();
        }
    },

    methods: {

        /**
         * 新增首页
         */
        handle_new () {
            
        },

        /**
         * 执行查询
         */
        handle_search () {
            if (this.platform == '' || this.site == '') {
                return false;
            }

            this.$emit('beforeResponse', true);
            if (getPageList.code == 0) {
                this.$emit('response', getPageList.data);
                this.$emit('beforeResponse', false);
            }
        }
    },

    mounted () {
        this.handle_search();
    }
}
</script>

<style lang="less">

.list-filter {
    position: absolute;
    right: 0px;
    top: -50px;
    display: flex;
    flex-wrap: nowrap;

    .ant-input-group {
        width: 700px;
        display: flex;
        margin-right: 16px;
        .ant-select-selection {
            border-radius: 20px 0 0px 20px !important;
        }
        .ant-select-selection-selected-value {
            line-height: 40px;
        }
        .ant-input {
            border-radius: 0 20px 20px 0px;
        }
    }

    > .ant-btn {
        margin-left: 8px;
        border-radius: 20px;
        font-size: 14px;
    }

    .ant-select-selection-selected-value {
        width: 100%;
        text-align: center;
    }
}

</style>