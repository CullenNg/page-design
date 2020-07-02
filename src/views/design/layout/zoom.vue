<template>
    <div class="zoom">
        <div class="button-minus" @click="handleMinus">
            <i class="iconfont minus"></i>
        </div>
        <div class="label-size" @click="handleReset">{{size}}%</div>
        <div class="button-plus" @click="handlePlus">
            <i class="iconfont plus"></i>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            base: 37.5,
            size: 100 
        };
    },
    methods: {
        handleReset () {
            this.size = 100;
        },
        handleMinus () {
            this.size > 50 ? this.size -= 10 : null;
        },
        handlePlus () {
            this.size < 200 ? this.size += 10 : null;
        }
    },
    watch: {
        size (val) {
            const px = (this.base * (val / 100)).toFixed(1);
            document.documentElement.style.fontSize = `${px}px`;
        }
    }
}
</script>

<style lang="less" scoped>

.zoom {
    position: fixed;
    bottom: 15px;
    left: 260px;
    display: flex;
    .label-size {
        margin: 0 5px;
        cursor: pointer;
        line-height: 30px;
        color: #666;
    }
    i {
        font-size: 20px;
        color: #aaa;
    }
    i:hover {
        color: #409EFF;
        cursor: pointer;
    }
}

</style>