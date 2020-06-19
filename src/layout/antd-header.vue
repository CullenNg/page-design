<template>
    <header class="geshop-head" :style="{ 'left': '0px' }">
        <!-- 下拉选择渠道 -->
        <a-select
            class="geshop-header-site-switch"
            placeholder="请选择"
            :value="selected_site"
            :dropdownMatchSelectWidth="false">
            <template v-for="item in siteLists">
                <a-select-option
                    v-if="!item.children"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                    :class="item.style">{{ item.name }}
                </a-select-option>
            </template>
        </a-select>

        <div class="site-signout">
            <span class="icon_user">
                {{ username | name_first_code }}
            </span>
            <span class="user-name">
                <span class="geshop-username">
                    {{ username }}
                </span>
            </span>
            <div class="geshop-user-exit">
                <p>退出</p>
            </div>
        </div>
    </header>
</template>

<script>
// import '../../../resources/fonts/svg-fonts/style.css'

export default {
    name: 'siteHeader',
    data () {
        return {
            username: 'Cullen',
            selected_site: 'DEMO',
            siteLists: [{
                name: 'DEMO',
                code: 'DEMO'
            }],
        }
    },
    filters: {
        // 名字首字母
        name_first_code (val = 'C') {
            return val.substr(0, 1).toUpperCase()
        }
    }
};
</script>

<style lang="less">

header.geshop-head {
    position: fixed;
    left: 220px;
    right: 0px;
    height: 50px;
    background:rgba(255,255,255,1);
    box-shadow: 2px 0px 6px 2px rgba(0,0,0,0.09);
    z-index: 2;
}

// 下拉渠道
.geshop-header-site-switch {
    width:160px;
    height:32px;
    display: inline-block;
    outline: none;
    margin-top: 9px;
    margin-left: 24px;

    .ant-select-selection {
        width: 100%;
        height:32px;
        border-radius: 0px;
        border-left: none;
        border-top: none;
        border-bottom: none;
        border-right: none;
        outline: none;
        background:rgba(243,245,247,1);
        border-radius:16px;
        box-shadow: none !important;
        .ant-select-selection__rendered {
            line-height: 32px;
            outline: none;
        }
    }

    .ant-select-selection-selected-value {
        padding-left: 16px;
        color: #1e9fff;
    }
}


// 右侧退出按钮
.site-signout {
    float: right;
    width: 158px;
    height: 50px;
    line-height: 50px;
    color: #ffffff;
    z-index: 100;
    position: relative;
    &:hover .geshop-user-exit {
        height: 45px;
	    transition: height .3s linear;
    }

    .user-name {
        font-size: 16px;
        color: #333333;
        margin-left: 4px;
        display: inline-block;
    }
    .icon_user {
        text-align: center;
        width: 30px;
        line-height: 30px;
        border-radius: 30px;
        display: inline-block;
        background-color: #1e9fff;
        font-size: 14px;
        color: #ffffff;
    }

    .geshop-user-exit {
        display: block;
        width: 120px;
        height: 0px;
        border: none;
        position: absolute;
        right: 36px;
        top: 50px;
        background-color: #ffffff;
        overflow: hidden;
        box-shadow: 0px 0px 10px #ccc;
        z-index: 200;
        p {
            margin-top: 5px;
            display: block;
            width: 100%;
            height: 32px;
            line-height: 32px;
            color:#333333;
            padding:0px 0px !important;
            text-align: left;
            padding-left: 19px !important;
            border: none;
        }
    }
}
</style>
