<template>
    <div class="page-list">
        <a-radio-group v-if="show" class="page-template-list" name="page_id" @change="handleChange" :value="radioValue">
            <div class="list-item" v-for="(item, index) in tplList" :key="index">
                <span class="title">{{ item.name }}</span>
                <div class="content">
                    <a-radio :value="item.id">
                        <img :src="'/resources/images/default/picture.png'">
                    </a-radio>
                </div>
            </div>
        </a-radio-group>
        <div v-else>
            <div class="page-warn">{{ warn }}</div>
        </div>
    </div>

</template>

<script>
export default {
    name: 'page-template-list',
    props: {
        list: {
            type: Array
        },
        tplType: {
            type: [Number, String],
            default: 0
        }
    },
    data () {
        return {
            radioValue: 0,
            userName: localStorage.getItem('userName')
        }
    },
    watch: {
        tplType () {
            this.radioValue = 0;
        }
    },
    computed: {
        show () {
            if (this.tplType == 0) {
                const list = this.list.filter(item => {
                    return item.create_user == this.userName;
                })
                return list.length > 0;
            }
            return this.list.length > 0;
        },

        warn () {
            return this.tplType == 0 ? '您还没有自己的模板' : '暂无页面模板供使用';
        },
        tplList () {
            const self = this;

            if (this.tplType == 0) {
                const list = self.list.filter(item => {
                    return item.create_user == self.userName;
                })
                return list;
            } else if (this.tplType == 1) { // 公共
                const list = self.list.filter(item => {
                    return item.create_user != self.userName;
                })
                return list;
            }
        }
    },
    methods: {
        handleChange (e) {
            this.radioValue = e.target.value;
            this.$emit('getPageId', this.radioValue);
        }
    }
}
</script>

<style lang="less">
    .page-template-list {
        .ant-radio-wrapper {
            width: 206px;
            height: 206px;
            text-align: center;
            vertical-align: middle;
            border: 1px solid #E8EAEC;

            .ant-radio {
                position: absolute;
                right: 10px;
                top: 6px;
            }

            span.ant-radio + *{
                padding-left: 0px;
            }
        }

        .ant-radio-wrapper:hover, .ant-radio-wrapper:active{
            border: 1px solid #1E9FFF;
        }

        .ant-radio-wrapper-checked{
            border: 1px solid #1E9FFF;
        }
    }
</style>

<style lang="less" scoped>
    .page-list {
        max-height: 460px;
        overflow-y: auto;
    }

    .page-template-list {
        display: flex;
        flex-flow: row wrap;

        .list-item {
            width: 206px;
            overflow: hidden;
            margin:0px 24px 24px 0px;

            .title {
                display: block;
                line-height: 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-bottom: 4px;
            }
        }

        .list-item .content {
            position: relative;

            img{
                max-width: 100%;
                max-height: 100%;
                height: auto;
                width: auto;
            }
        }
    }

    // 滚动条样式
    .page-list::-webkit-scrollbar {
        width: 10px;
    }
    .page-list::-webkit-scrollbar-track {
        background-color:#ffffff;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius:5px;
    }
    .page-list::-webkit-scrollbar-thumb {
        background-color: #AEB1B3;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius:5px;
    }

    .page-warn {
        text-align: center;
        min-height: 300px;
        font-size: 16px;
        font-weight: 500;
    }
</style>
