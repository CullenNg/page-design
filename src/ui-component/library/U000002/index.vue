<template>
    <div class="U000002-template1">
        <img v-if="list.length == 0" :src="defaultUrl" alt="">
        <img v-if="list.length == 1" :src="list[0].image" alt="">
        <Swiper
            v-else
            :options="swiperOption"
            ref="mySwiper">
            <!-- slides -->
            <Swiper-slide v-for="(item, idx) in list" :key="idx">
                <div class="list-image">
                    <img :src="item.image" alt="">
                </div>
            </Swiper-slide>
            <!--分页-->
            <div class="swiper-pagination" slot="pagination"></div>
        </Swiper>
    </div>
</template>

<script>
import 'swiper/css/swiper.css'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import defaultUrl from '@/resource/images/default-banner.png';
import mixins from '../../mixins'

export default {
    mixins: [mixins],
    data () {
        return {
            // 轮播图设置
            swiperOption: {
                autoplay: true,
                loop: true,
                delay: 3000,
                observer:true,
                autoHeight: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                }
            },
            defaultUrl
        };
    },

    components: {
        Swiper,
        SwiperSlide
    },

    computed: {
        // 初始化
        swiper () {
            return this.$refs.mySwiper.swiper;
        },
        // 广告轮播列表
        list () {
            try {
                let list = [...this.datas.list] || [];
                list = list.filter(item => item.image != '');
                return list;
            } catch (err) {
                return [];
            }
        }
    },

    methods: {
        // rem转换
        px2rem (val = 0) {
            return (val / 75) + 'rem';
        }
    }
};
</script>

<style lang="less">
    .U000002-template1 .swiper-pagination {
        bottom: 0rem;
    }

    .U000002-template1 .swiper-pagination-bullet {
        position: relative;
        margin: 0 .16rem!important;
        vertical-align: top;
        border-radius: 0;
        width: .853rem;
        height: .13rem;
        background-color: rgba(255, 255, 255, .8)!important;
    }

    .U000002-template1 .swiper-pagination-bullet:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: .053rem;
        background-color: #fff;
    }

    .U000002-template1 .swiper-pagination-bullet-active {
        background: #fff;
    }

</style>

<style lang="less" scoped>
    .U000002-template1 {
        display: block;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        width: 375/37.5rem;
        overflow: hidden;
        img {
            width: 100%;
        }      
    }
</style>
