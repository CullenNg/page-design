<template>
    <div class="sub-page-item">
        <template v-if="info.pageId">
            <div class="sub-page-tag grey" >草稿</div>
            <!-- <div class="sub-page-tag green">1</div> -->
            <!-- <div class="sub-page-tag green">1</div> -->
            <!-- <div class="sub-page-tag warn" >1</div> -->

            <div class="sub-page-native-tag" v-if="info.platform == 'wap'">
                <a-icon type="mobile" />
            </div>

            <img class="sub-page-image" :src="info.banner" />

            <!-- 页面信息 -->
            <div class="sub-page-info">
                <div class="sub-page-id">
                    ID: {{ info.pageId }} 
                </div>
                <div class="sub-page-title">{{ info.pageTitle }}</div>
                <div>
                    <span class="sub-page-create-time">
                        <a-icon type="file-add" />2020-06-18 18:18:04
                    </span>
                    <span class="sub-page-creator">{{ create_name }}</span>
                </div>
                <div>
                    <span class="sub-page-update-time">
                        <a-icon type="form" />2020-06-18 18:18:04
                    </span>
                    <span class="sub-page-updator">{{ update_name }}</span>
                </div>

                <a
                    href="javascript:;"
                    class="sub-page-view">
                    查看访问地址
                </a>

                <div class="sub-page-more">
                    <a-dropdown>
                        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                            <a-icon type="ellipsis" />
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item :disabled="disabled" @click="handle_delete">删除</a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </div>
            </div>

            <!-- 锁定层 -->
            <div v-if="disabled" class="sub-page-item-lock">
                <a-icon type="lock" />
                <label>已锁定</label>
            </div>

            <!-- 操作层 -->
            <controller
                v-if="!disabled"
                :info="info">
            </controller>
        </template>
    </div>
</template>

<script>

import controller from './list-item-controller.vue';

export default {
    props: {
        info: {
            type: Object
        },
        // 当前站点 code
        site: {
            type: String,
            required: true,
        },
        // 当前应用端
        platform: {
            type: String
        },
        // 是否可用
        disabled: {
            type: Boolean,
            default: false
        }
    },

    components: {
        controller
    },

    data () {
        return {
            create_name: 'Cullen',
            update_name: 'Cullen'
        };
    },

    methods: {
        /**
         * 删除主页面的弹窗
         */
        handle_delete () {
            const that = this;
            this.$confirm({
                title: '提示',
                content: '确定删除首页列表信息吗？删除后，不可恢复，请谨慎操作！',
                okText: '删除',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                    that.$message.success('页面删除成功');
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>

.sub-page-item {
    position: relative;
}

// 新增按钮图标
.anticon-plus {
    display: block;
    text-align: center;
    width: 100%;
    font-size: 56px;
    color: #949AA1;
    margin-top: 94px;
    &+label {
        display: block;
        text-align: center;
        margin-top: 20px;
        color: #949AA1;
    }
}

.sub-page-image {
    display: grid;
    width:290px;
    height:108px;
    border-radius: 10px 10px 0px 0px;
}

.sub-page-tag {
    position: absolute;
    left: 0px;
    top: 0px;
    padding-left: 8px;
    padding-right: 8px;
    height:24px;
    line-height: 24px;
    border-radius:10px 0px 10px 0px;
    color: #fff;
    font-size: 12px;
    &.warn {
        background:rgba(255,161,29,1);
    }
    &.green {
        background:#00CB93;
    }
    &.grey {
        background:#949AA1;
    }
}
.sub-page-native-tag {
    position: absolute;
    right: 10px;
    top: 10px;
    color: #1e9fff;
    font-size: 24px;
}

// AB 首页的标识
.activity-tag {
    position: absolute;
    right: 0px;
    width:50px;
    height:24px;
    border-radius:12px 0px 0px 12px;
    top: 142px;
    text-align: center;
    font-size: 12px;
    line-height: 24px;
    &.green {
        color: #02C5BC;
        background-color: rgba(2, 197, 188, 0.15);
    }
    &.pink {
        color: #A476FF;
        background-color: rgba(164, 118, 255, 0.15);
    }
}

.sub-page-info {
    padding: 16px;
    padding-bottom: 0px;
}

.sub-page-id {
    color: #409EFF;
    margin-bottom: 4px;
}

.sub-page-title {
    font-size: 16px;
    color: #3F4245;
    height: 22px;
    line-height: 22px;
    margin-bottom: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.sub-page-creator,
.sub-page-create-time,
.sub-page-update-time,
.sub-page-updator {
    color: #949AA1;
    font-size: 12px;
}

.sub-page-creator,
.sub-page-updator {
    float: right;
}

// 查看访问地址
.sub-page-view {
    display: inline-block;
    clear: both;
    margin-top: 8px;
    min-height: 21px;
    color: #6B7075;
    &:hover {
        color: #409EFF;
    }
}

// 查看所有页面ID
.sub-page-view-ids {
    color: #6B7075;
}

// 功能操作层交互
.sub-page-item:hover .sub-page-controller {
    opacity: 1;
}

// 锁定 
.sub-page-item-lock {
    position: absolute;
    left: 0px;
    top: 0px;
    right: 0px;
    height: 108px;
    background-color: rgba(255, 255, 255, 0.88);
    text-align: center;
    border-radius: 10px 10px 0 0;
    i {
        font-size: 30px;
        margin-top: 25px;
    }
    label {
        display: block;
        line-height: 2em;
    }
}

// 更多选项
.sub-page-more {
    position: absolute;
    right: 10px;
    bottom: 22px;
}
.ant-dropdown-link {
    position: absolute;
    top: 0px;
    right: 0px;
    font-weight: bold;
    height: 28px;
    line-height: 28px;

    .anticon {
        &:hover {
            background-color: #409EFF;
            border-radius: 100%;
            svg {
                color: #fff;
            }
        }
    }
    svg {
        font-size: 28px;
    }
}
</style>