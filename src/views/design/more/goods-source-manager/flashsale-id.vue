<template>
    <div class="container">
        <!-- 输入框区域 -->
        <a-textarea
            v-model="form.id"
            name="price_sys_ids"
            placeholder="秒杀ID(多个秒杀ID用,隔开填入)"
            :rows="8" />

    </div>
</template>

<script>

// API
import {
    ZF_goodsTplList
} from '../../../../interface/index'

/**
 * 字符串内容格式化
 * create by Cullen 2019/12/17
 * @description 
 * 1. 去除空格
 * 2. 去除回车，替换成逗号
 * 3. 去除连续2个逗号
 * @param {String} content 传入内容，字符串
 * @returns {String}
 */
const trim = (content = '') => {
    return content.replace(/(^\s*)|(\s*$)/g, '').split(' ').join('').replace(/\n/g, ',').replace(',,', ',');
}

export default {
    name: 'flashsale',
    props: ['price_sys_ids'],
    data () {
        return {
            // 表单
            form: {
                id: this.price_sys_ids,
            }
        };
    },

    computed: {
        // 获取所有组件的数据源
        component_goodsSKU () {
            return this.$store.state.page.goodsSKU;
        }
    },

    methods: {
        /**
         * 获取商品列表
         */
        async get_goods_list () {
            let goodsInfoList = []; // 暂存商品列表

            // 判断是否有
            if (this.form.id != '') {
                const info = this.$store.state.page.info;
                const request = {
                    page: 1,
                    limit: 100,
                    lang: info.lang,
                    pageId: info.page_id,
                    pipeline: info.pipeline,
                    price_sys_ids: this.form.id
                };
                const res = await ZF_goodsTplList(request); // 获取商品列表数据
                if (res.code == 0) {
                    return [...res.data];
                }
            }
        },

        /**
         * 确认按钮
         */
        async handle_confirm (callback) {
            // 格式化
            this.form.id = trim(this.form.id);
            // 判断是否有填入
            if (this.form.id.length == 0) {
                callback && callback({
                    type: 3,
                    price_sys_ids: this.form.id
                });
                return false;
            }
            this.$emit('update:loading', true);
            // 如果有公共校验函数
            this.$valid.designCommonValid({
                check_type: 'price_sys',
                check_rules: 'PRICE_VALIDATE_ID_EXITS, PRICE_VALIDATE_TIME_CONSISTENT',
                price_sys_ids: this.form.id,
                success: (res) => {
                    this.$emit('update:loading', false);
                    // 更新数据
                    callback && callback({
                        type: 3,
                        price_sys_ids: this.form.id
                    });
                },
                update: (res) => {
                    this.form.id = res;
                },
                filter: (res) => {
                    this.form.id = res;
                },
                error: () => {
                    this.$emit('update:loading', false);
                }
            });
        },
    }
}
</script>
