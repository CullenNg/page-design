<template>
    <span
        class="my_shop_price my-shop-price bold"
        :data-orgp="value"
        :data-currency="currency"
        :data-original_amount="value">
        ${{ value }}
    </span>
</template>

<script>
export default {
    name: 'shop-price-zaful',
    props: {
        // 价格
        value: {
            default: '0.00',
            required: true
        },
        // 币种，默认USD美元
        currency: {
            default: ''
        },
        // 配置项
        config: {
            type: Object,
            default () {
                return {};
            }
        }
    }
};
</script>
