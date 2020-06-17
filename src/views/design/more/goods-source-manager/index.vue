<template>
    <!--数据配置-->
    <design-dialog
        :visible="visible"
        :width="960"
        wrapClassName="dialog-goods-source-manager"
        title="已选商品数据"
        :confirmLoading="loading"
        @isOk="handle_confirm"
        @isCancel="handle_cancel">

        <div class="container-body">

            <ul class="goods-list">
                <li v-for="item in goods_list" :key="item.goods_sn">
                    <img :src="item.goods_img" alt="">
                </li>
            </ul>
            
        </div>

    </design-dialog>
</template>

<script>

import goodsList from '@/interface/json-data/get_goods_list.json';


export default {
    name: 'goods-source-manager',

    props: {
        // 是否展示
        visible: {
            type: Boolean,
            default: false
        },

        // 数据源ID
        value: {
            required: true,
            default: ''
        }
    },

    data () {
        return {
            goods_list: goodsList.data,
            loading: false
        };
    },

    methods: {

        /**
         * 弹窗按钮 - 确认
         */
        handle_confirm () {
            this.$emit('confirm', this.goods_list);
            this.$emit('update:visible', false);
        },

        /**
         * 弹窗按钮 - 取消
         */
        handle_cancel () {
            this.$emit('update:visible', false);
        }
    }
}
</script>

<style lang="less" scoped>
// 容器
.container-body {

    .goods-list {
        list-style: none;
        padding: 0;
        margin: 0px;
        display: flex;
        flex-wrap: wrap;
        > li {
            width: 80px;
            height: 80px;
            margin-right: 14px;
            margin-bottom: 14px;
            > img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>