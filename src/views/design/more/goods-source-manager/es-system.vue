<template>
    <div class="container">
        <div class="container-head">
            选品规则名称
            <a-input v-model="form.name"/>
            <a-button @click="handle_click_search()">查询</a-button>
        </div>
        <div class="container-body">
            <div class="tips">
                <span v-if="table.selected_rule_name != ''" class="tips-selected">
                    当前选择的规则：<strong>{{ table.selected_rule_name }}</strong>。
                    ID: <strong>{{ table.selected[0] }} </strong> 
                </span>
                <span class="tips-help">
                    没有合适的商品规则或需要增加选品？
                    <a class="a-button" href="#" @click="handle_open_window">去选品</a>
                </span>
            </div>
            <a-table
                bordered
                rowKey="ruleId"
                :columns="table.columns"
                :dataSource="table.list"
                :pagination="table.pagination"
                :loading="table.loading"
                :rowSelection="{
                    selectedRowKeys: table.selected,
                    onChange: handle_select_change,
                    hideDefaultSelections: true,
                    type: 'radio'
                }"
                :scroll="{ y: 400, x: true }"
                @change="handle_page_change">

                <!--时间-->
                <template slot="utime" slot-scope="text">
                    {{ text | date_formate }}
                </template>

            </a-table>
        </div>
    </div>
</template>
<script>

/**
 * 表格列配置
 */
const table_columns = [
    { title: 'ID', align: 'center', dataIndex: 'ruleId', width: 200 },
    { title: '规则名称', align: 'center', dataIndex: 'ruleName', width: 200 },
    { title: '更新时间', align: 'center', dataIndex: 'utime', width: 200, scopedSlots: { customRender: 'utime' } }
];

import {
    soa_rule_list
} from '../../../../interface/index';

export default {
    name: 'es-system',
    props: ['visible', 'sop_rule_id', 'sop_rule_name'],

    data () {
        return {
            form: {
                name: '' // 搜索规则关键字
            },
            // 表格相关的配置
            table: {
                list: [],
                columns: table_columns,
                pagination: {
                    current: 1,
                    pageSize: 7,
                    total: 1
                },
                loading: false,
                selected: [], // 复选框选中的ID
                selected_rule_name: '', // 选择的规则名字
            },
            is_addEvenListenr_message: false, // 是否已经监听 message 信息，避免多次调用
            ipsWindow: null, // 商品运营平台对象
        };
    },

    computed: {
        site_code () {
            try {
                return this.$store.state.page.info.site_code || 'zf';
            } catch (err) {
                return window.GESHOP_SITECODE || 'zf';
            }
        }
    },

    filters: {
        date_formate (val) {
            const date = new Date(val * 1000);
            const YY = date.getFullYear() + '-';
            const MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            const DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
            const hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            const mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            const ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
            return YY + MM + DD + " " + hh + mm + ss;
        }
    },

    methods: {
        /**
         * 初始化 
         */
        init () {
            // 更新已选的
            if (this.sop_rule_id) {
                this.table.selected = [this.sop_rule_id];
                this.table.selected_rule_name = this.sop_rule_name || ''; 
            } else {
                this.table.selected = [];
                this.table.selected_rule_name = '';
            }
            // 清除搜索关键字
            this.form.name = '';
            // 查询
            this.handle_click_search();
        },

        /**
         * 获取规则列表
         */
        async get_rule_list () {
            try {
                const res = await soa_rule_list({
                    site_code: this.site_code,
                    keyword: this.form.name,
                    page_num: this.table.pagination.current,
                    page_size: this.table.pagination.pageSize
                });
                this.table.list = [...res.data.list];
                this.table.pagination.total = parseInt(res.data.total || 0);
            } catch (err) {}
        },

        /**
         * 重置表单
         */
        handle_clear () {
            this.form.name = '';
            this.table.selected = [];
            this.table.pagination.current = 1;
        },

        /**
         * 点击查询
         */
        async handle_click_search (page = 1) {
            this.table.loading = true;
            this.table.pagination.current = page;
            await this.get_rule_list();
            this.table.loading = false;
        },

        // 复选框变化，选择ID
        handle_select_change (selected, row) {
            this.table.selected = selected;
            this.table.selected_rule_name = row[0].ruleName;
        },

        /**
         * 分页功能
         */
        handle_page_change (pagination, filters, sorter) {
            this.table.pagination.current = pagination.current;
            this.handle_click_search(pagination.current);
        },

        /**
         * 打开选品系统，选品之后的回调
         */
        handle_open_window () {
            const url =  window.GESHOP_URL_SOP_ADD_RULE;
            const ipsWindow = window.open(url, 'sop_window');
            try {
                this.ipsWindow = ipsWindow;
            } catch (err) {}
            if (!this.is_addEvenListenr_message) {
                window.addEventListener('message', (e) => {
                    this.is_addEvenListenr_message = true;
                    try {
                        if (e.data.message_type == 'design_xuanpin') {
                            // 清空选择项目
                            this.handle_clear();
                            // 重新查询列表
                            this.handle_click_search();
                            // 勾选对应的ID
                            this.table.selected = [e.data.rule_id.toString()];
                            // console.log('选中了:', this.table.selected);
                        }
                    } catch (err) {}
                });
            }

            // 延时发送消息
            setInterval(() => {
                ipsWindow.postMessage({'origin': 'geshop'}, "*");
            }, 3000);
        },

        /**
         * 确认按钮
         * @param {Function} callback 确认回调函数
         */
        handle_confirm (callback) {
            if (this.table.selected.length <= 0) {
                return this.$message.error('还未选择选品规则哟！');
            }
            // 获取最新的名字
            this.table.list.map(x => {
                if (x.ruleId == this.table.selected) {
                    this.table.selected_rule_name = x.ruleName;
                }
            });
            callback && callback({
                sop_rule_id: this.table.selected[0],
                sop_rule_name: this.table.selected_rule_name
            });
        },

        /**
         * 取消操作, 关闭选品的TAB
         */
        handle_cancel () {
            try {
                this.ipsWindow.close();
            } catch (err) {}
        }
    },

    watch: {
        visible (val) {
            val && this.init();
        }
    },

    mounted () {
        this.init();
    }
}
</script>

<style scoped lang="less">
    .container {
        position: relative;
    }

    .container-head {
        position: absolute;
        top: -48px;
        left: 300px;
        .ant-input {
            width: 200px;
        }
    }

    // 提示
    .tips {
        margin-bottom: 10px;
    }
    .tips-selected {
        margin-right: 12px;
    }
    .tips-help {
        color: #666;
    }

    // 去选品按钮
    .a-button {
        color: #1890ff;
    }
</style>