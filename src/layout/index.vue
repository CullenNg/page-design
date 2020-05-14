<template>
    <div id="app">
        <a-locale-provider :locale="zh_CN">
            <router-view></router-view>
        </a-locale-provider>
    </div>
</template>

<script>
// 语言包
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';

export default {
    name: 'app',
    data () {
        return {
            zh_CN,
        }
    }
}
</script>

<style lang="less">

// 自定义的弹窗
.geshop-modal {
    .ant-modal-body {
        font-size: 13px;
    }
    .ant-modal-footer {
        border-top: none;
        text-align: center;
        padding-top: 8px;
        padding-bottom: 32px;
        .ant-btn {
            padding: 0 32px;
        }
    }
}

// 全局的 checkbox 
.ant-checkbox-wrapper,
.ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: 0px;
    margin-right: 24px;
}
.ant-checkbox-wrapper span + span {
    padding-left: 4px;
    padding-right: 0px;
}

// 全局的 geshop-table 
.geshop-table.ant-table-wrapper {
    thead th {
        padding: 15px;
        line-height: 18px;
        background:rgba(243,245,247,1);
        border-bottom: none;
        color: #3F4245;
        font-size: 13px;
        font-weight: 400;
    }
}
</style>
