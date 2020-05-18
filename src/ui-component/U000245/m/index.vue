<template>
    <div
        :class="className"
        v-if="list.length > 0">
        <!-- style -->
        <div v-html="css"></div>
        <!-- 列表 -->
        <ul>
            <li v-for="(item, index) in list" :key="`${index}-${item.goods_sn}`">
                <!--折扣标-->
                <unit-discount
                    :value="item.discount"
                    :config="styles" />

                <!--商品图片-->
                <div class="item-image">
                    
                    <a :href="item.goods_number > 0 ? item.url_title: 'javascript:void(0);'">
                        <div class="image-goods">
                            <unit-goods-image
                                :src="item.goods_img"
                                :sku="item.goods_sn"
                                :index="index" />
                        </div>
                    </a>

                    <!--sold out-->
                    <div class="item-soldOut" v-if="item.goods_number <= 0">
                        <span>{{ languages.sold_out }}</span>
                    </div>
                </div>

                <div class="item-info">
                    <!--sku标题-->
                    <div class="item-title">
                        <a :href="item.goods_number > 0 ? item.url_title: 'javascript:void(0);'">{{ item.goods_title }}</a>
                    </div>

                    <div class="item-shop-market">
                        <!--销售价-->
                        <div class="item-shop bold">
                            <div class="shop-title">{{ styles.shop_price_title }}</div>
                            <span class="shop-title-block"></span>
                            <div class="shop-price">
                                <unit-shop-price
                                    :value="item.shop_price"
                                    :config="styles">
                                </unit-shop-price>
                            </div>
                        </div>
                        <!--市场价-->
                        <div class="item-market">
                            <unit-market-price
                                :value="item.market_price"
                                :shop-price="item.shop_price"
                                :config="styles">
                            </unit-market-price>
                        </div>
                    </div>
                </div>

            </li>
        </ul>
    </div>
</template>

<script>
// 自定义样式
const css = function () {
    const {
        margin_top,
        margin_bottom,
        bg_color,
        bg_radius,
        item_radius,
        shop_price_color
    } = this.styles;

    return `
        .component-${this.id} {
            margin-top: ${this.px2rem(margin_top)};
            margin-bottom: ${this.px2rem(margin_bottom)};
            background-color: ${bg_color || '#f8f8f8'};
        }

        .component-${this.id} ul {
            border-radius: ${this.px2rem(bg_radius || 12)};
        }

        .component-${this.id} li {
            border-radius: ${this.px2rem(item_radius || 12)};
        }

        .component-${this.id} .item-shop .shop-price {
            color: ${shop_price_color};
        }
    `;
};

export default {
    props: ['id', 'datas', 'styles', 'goodsSKU', 'languages'],
    computed: {
        css () {
            return '<style>' + css.call(this) + '</style>';
        },
        className () {
            const name = ['component-wrapper', `component-${this.id}`];
            this.whole && name.push('is-whole');
            return name;
        },
        env () {
            return this.$store.state.page.env;
        },
        list () {
            try {
                return this.goodsSKU[0].goodsInfo || [];
            } catch (err) {
                return [];
            }
        },
        // 背景整体式
        whole () {
            return this.styles.box_is_whole == 1;
        }
    },

    methods: {
        // rem转换
        px2rem (val = 0) {
            return (val / 75) + 'rem';
        }
    },

    watch: {
        list () {
            this.$store.dispatch('global/async_goods_init_2', this);
        }
    },

    mounted () {
        this.$emit('loaded');
        // 页面元素初始化
        this.$store.dispatch('global/async_goods_init_2', this);
    }
};
</script>

<style lang="less" scoped>
    // 默认
    .component-wrapper {
        display: flex;
        justify-content: center;
        width: 375/37.5rem;

        ul{
            display: flex;
            justify-content: space-between;
            flex-flow: row wrap;
            margin: 12/37.5rem 12/37.5rem 3/37.5rem;
            padding: 0;
            width: 100%;

            li{
                position: relative;
                width: 171/37.5rem;
                margin-bottom: 9/37.5rem;
                background-color: #FFFFFF;
                overflow: hidden;
            }

            // 商品图片
            .item-image{
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 228/37.5rem;

                .image-goods img{
                    width: 100%;
                }
            }

            // 商品详情
            .item-info {
                padding-left: 12/37.5rem;
                margin-bottom: 12/37.5rem;
            }
            // 标题
            .item-title{
                box-sizing: content-box;
                width: 147/37.5rem;
                font-size: 11/37.5rem;
                height: 15/37.5rem;
                line-height: 15/37.5rem;

                overflow:hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-break: keep-all;
                word-wrap: break-word;

                padding-top: 9/37.5rem;
                margin-bottom: 4/37.5rem;
                color: #333333;
                a {
                    color: #333333;
                    &:hover{
                        color: #333333;
                    }
                }
            }

            // 销售及市场价
            .item-shop-market{
                width: 100%;
            }

            .item-shop-market .item-shop {
                display: flex;
                flex-flow: row wrap;
                color: #333333;
                line-height: 24/37.5rem;
                align-items: baseline;

                .shop-title {
                    font-size: 13/37.5rem;
                    max-width: 147/37.5rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-break: keep-all;
                    word-wrap: break-word;
                }
                .shop-title-block {
                    display: inline-block;
                    width: 4/37.4rem;
                }

                .shop-price{
                    font-size: 18/37.5rem;
                    font-weight: bold;
                }
            }
            .item-market{
                color: #999999;
                line-height:17/37.5rem;
            }

            // 售空
            .item-soldOut{
                position: absolute;
                top: 91/37.5rem;
                left: 12/37.5rem;
                width: 147/37.5rem;
                height: 30/37.4rem;
                line-height: 30/37.4rem;
                border-radius: 40/37.5rem;
                background-color: #000000;
                opacity: 0.4;
                z-index: 1;
                > span{
                    display: block;
                    text-align: center;
                    font-weight:600;
                    font-size: 12/37.5rem;
                    color: #ffffff;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-break: keep-all;
                    word-wrap: break-word;
                    width: 100%;
                }
            }
        }
    }

    // 整体式
    .component-wrapper.is-whole {

        ul{
            margin: 12/37.5rem;
            padding: 12/37.5rem 12/37.5rem 0rem;
            width: 100%;
            background-color: #ffffff;

            li{
                width: 159/37.5rem;
            }

            // 商品图片
            .item-image{
                height: 212/37.5rem;
            }

            // 商品详情
            .item-info {
                padding-left: 0rem;
            }

            // 售空
            .item-soldOut{
                position: absolute;
                top: 91/37.5rem;
                width: 135/37.5rem;
            }
        }
    }
</style>
