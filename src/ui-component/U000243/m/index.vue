<template>
    <div class="U000243-template1" :style="style_body">
        <div class="wrap" :style="wrap_body">
            <img
                v-if="show"
                :src="defaultUrl"
                alt="" />

            <swiper
                v-else
                :options="swiperOption"
                ref="mySwiper"
                :style="wrap_body">
                <!-- slides -->
                <swiper-slide v-for="(item, idx) in list" :key="idx">
                    <div class="list-image">
                        <a :href="item.link_m == '' ? 'javascript:void(0);' : item.link_m">
                            <unit-goods-image
                                :default_img="defaultUrl"
                                :src="item.image"
                                :index="idx" />
                        </a>
                    </div>
                </swiper-slide>
                <!--分页-->
                <div class="swiper-pagination" slot="pagination" v-show="list.length > 1"></div>
            </swiper>
        </div>

    </div>
</template>

<script>
// import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
    props: ['datas', 'styles'],
    data () {
        const self = this;
        return {
            // 轮播图设置
            swiperOption: {
                // loop: true,
                observer: true,
                observeParents: true,
                slidesPerView: 1,
                autoplay: {
                    stopOnLastSlide: false,
                    disableOnInteraction: false,
                    delay: 5000
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                on: {
                    init: function () {
                        const lazyImg = self.$el.querySelectorAll('.js_gdexp_lazy');
                        lazyImg.forEach(item => {
                            let original = item.getAttribute('data-original');
                            let src = item.getAttribute('src');
                            if (original != src) {
                                item.setAttribute('src', original);
                            }
                        });
                    },
                    slideChangeTransitionEnd: function () {
                        // 切换进入另一屏时, 手动改变懒加载
                        const lazyImg = self.$el.querySelectorAll('.js_gdexp_lazy');
                        const activeIndex = this.activeIndex;

                        lazyImg.forEach((item, index) => {
                            if (activeIndex == index) {
                                let original = item.getAttribute('data-original');
                                let src = item.getAttribute('src');
                                if (original != src) {
                                    item.setAttribute('src', original);
                                }
                            }
                        });
                    }
                }
            },
            defaultUrl: 'https://geshopimg.logsss.com/uploads/SKXE5kTxofP0t2YWAvVJn34sq6aLCzcI.png'
        };
    },
    components: {
        swiper,
        swiperSlide
    },
    computed: {
        // 初始化
        swiper () {
            return this.$refs.mySwiper.swiper;
        },

        // 广告轮播列表
        list () {
            let list = [...this.datas.list] || [];
            list = list.filter(item => item.image != '');
            return list;
        },

        // 默认图
        show () {
            return this.list.length <= 0;
        },

        // 组件样式
        style_body () {
            const { margin_top, margin_bottom } = this.styles;
            const style = {
                marginTop: this.px2rem(margin_top),
                marginBottom: this.px2rem(margin_bottom)
            };
            return style;
        },

        // 轮播图片高度
        wrap_body () {
            const { height } = this.styles;
            const style = {
                height: this.px2rem(height)
            };
            return style;
        }
    },
    watch: {
        list () {
            const self = this;
            this.$nextTick(() => {
                const lazyImg = self.$el.querySelectorAll('.js_gdexp_lazy');
                lazyImg.forEach(item => {
                    let original = item.getAttribute('data-original');
                    let src = item.getAttribute('src');
                    if (original != src) {
                        item.setAttribute('src', original);
                    }
                });
            });
        }
    },

    methods: {
        // rem转换
        px2rem (val = 0) {
            return (val / 75) + 'rem';
        }
    },
    mounted () {
        this.$emit('loaded');
    }
};
</script>

<style lang="less">
    .U000243-template1 .swiper-pagination {
        bottom: 0rem;
    }

    .U000243-template1 .swiper-pagination-bullet {
        position: relative;
        margin: 0 .16rem!important;
        vertical-align: top;
        border-radius: 0;
        width: .853rem;
        height: .053rem;
        background-color: rgba(255, 255, 255, .5)!important;
    }

    .U000243-template1 .swiper-pagination-bullet:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: .053rem;
        background-color: #fff;
    }

    .U000243-template1 .swiper-pagination-bullet-active {
        background: #fff;
    }

</style>

<style lang="less" scoped>
    .U000243-template1 {
        display: block;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        width: 375/37.5rem;
        overflow: hidden;

        .wrap {
            img{
                max-height: 100%;
                max-width: 100%;
                width: auto;
                height: auto;
            }
            & /deep/ .geshop-zaful-image-goods {
                justify-content: center;

                & img{
                    max-height: 100%;
                    max-width: 100%;
                    width: auto;
                    height: auto;
                }
            }
        }
    }
</style>
