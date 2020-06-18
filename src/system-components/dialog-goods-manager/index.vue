<template>
    <design-dialog
        :visible.sync="visible"
        wrapClassName="goods-sku-manager"
        width="1200px"
        title="添加商品"
        @isOk="handle_confirm"
        @isCancel="handle_cancel">
        
            
        <a-table
            class="goods_tab"
            bordered
            :columns="columns"
            :dataSource="list"
            :pagination="false"
            :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :scroll="{ y: 400, x: true }">

            <!--商品图片-->
            <div slot="goods_img" class="goods_img" slot-scope="text">
                <img :src="text" />
            </div>
        </a-table>
    </design-dialog>
</template>

<script>

import goodsList from '@/interface/json-data/get_goods_list.json';

const columns = [
    { title: '商品ID', align: 'center', dataIndex: 'goods_id', key: 'goods_id', width: 96 },
    { title: '商品SKU', align: 'center', dataIndex: 'goods_sn', key: 'goods_sn', width: 120},
    { title: '商品标题', align: 'center', dataIndex: 'goods_title', key: 'goods_title' },
    {
        title: '商品图片',
        align: 'center',
        dataIndex: 'goods_img',
        key: 'goods_img',
        width: 92,
        scopedSlots: { customRender: 'goods_img' }
    },
    { title: '库存', align: 'center', dataIndex: 'goods_number', key: 'goods_number', width: 120 }
];

/**
 * 组件内部函数
 */
const helper = {
    /**
     * 更新表格数据的序号
     * @param {array} list 数据列表
     * @returns {Array}
     */
    update_table_index (list) {
        return [...list].map((item, index) => {
            item.key = index + 1;
            item.number = index + 1;
            return item;
        });
    }
}

export default {
    name: 'goods-sku',

    data() {
        return {
            visible: false,
            list: goodsList.data, // 商品列表
            selectedRowKeys: [], // 复选框选中
            columns,
        }
    },

    methods: {

        /**
         *  打开弹窗
         * @param {Array} current_skus 当前选中的SKU
         */
        show (current_skus) {
            // 根据SKU找到对应的数组索引
            this.selectedRowKeys = [];
            current_skus.map(goods_sn => {
                this.list.map((x, index) => {
                    if (x.goods_sn == goods_sn) {
                        this.selectedRowKeys.push(index);
                    }
                });
            });
            this.visible = true;
        },

        /**
         * 选择行
         */
        onSelectChange (selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
        },

        /**
         * 确认按钮
         */
        handle_confirm () {
            const list = this.selectedRowKeys.map(index => this.list[index]);
            this.$emit('onComfirm', list);
            this.visible = false;
        },

        /**
         * 取消按钮
         */
        handle_cancel () {
            this.visible = false;
        }
    }
}
</script>


<style lang="less" scoped>

    .btn-remove {
        margin-left: 10px;
        margin-bottom: 10px;
    }

    .goods_tab {
        // 序号
        .number {
            width: 80px;
            margin-left: 10px;
        }

        .goods_img {
            height: 60px;

            & > img {
                width: auto;
                height: auto;
                max-height: 100%;
                max-width: 100%;
            }
        }

        .ant-checkbox-wrapper, .ant-checkbox-wrapper + .ant-checkbox-wrapper {
            margin-right: 0px !important;
        }
    }


    .replace-goods-wrap {
        padding-right: 22px;

        .title {
            margin-bottom: 6px;
        }

        .img {
            margin-top: 12px;
            margin-bottom: 6px;
        }

        .goods_image {
            height: 440px;

            & > img {
                width: auto;
                height: auto;
                max-height: 100%;
                max-width: 100%;
            }
        }
    }
</style>

<style lang="less">
    // SKU 管理弹窗
    .goods-sku-manager {
        // 选项按钮
        .ant-btn {
            padding: 0 8px;
        }
        // 表头
        .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
            padding: 16px 0px !important;
        }
    }
</style>
