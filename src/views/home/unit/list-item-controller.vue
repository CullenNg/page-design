<template>
    <div class="sub-page-controller">
        <button @click="handle_design">
            <a-icon theme="filled" type="edit" />
            <label>装修</label>
        </button>
        
        <button>
            <a-icon theme="filled" type="eye" />
            <label>预览</label>
        </button>
    </div>
</template>

<script>



export default {
    props: {
        info: {
            type: Object,
        }
    },

    methods: {
        
        /**
         * 打开装修页
         */
        handle_design () {
            this.$router.push({
                path: `/design?id=${this.info.pageId}`,
            });
        }
    }
    
}
</script>

<style lang="less" scoped>

.sub-page-controller {
    position: absolute;
    left: 0px;
    top: 0px;
    right: 0px;
    line-height: 108px;
    background-color: rgba(255, 255, 255, 0.88);
    text-align: center;
    border-radius: 10px 10px 0 0;
    opacity: 0;
}

// 按钮
.sub-page-controller {
    > button {
        display: inline-block;
        width:48px;
        height:32px;
        line-height: 30px;
        margin: 0 6px;
        border-radius:16px;
        vertical-align: middle;
        border:1px solid rgba(64,158,255,1);
        background-color: #fff;
        cursor: pointer;
        outline: none;
        i {
            display: block;
            color: #409EFF;
            font-size: 22px;
        }
        label {
            display: none;

        }
    }
    > button:hover {
        background:rgba(64,158,255,1);
        label {
            display: block;
            color: #fff;
            font-size: 12px;
            cursor: pointer;
        }
        i {
            display: none;
        }
    }
}
</style>