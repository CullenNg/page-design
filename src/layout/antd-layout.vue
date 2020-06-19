<template>
    <a-layout>

        <!-- 顶部 -->
        <site-header />

        <!-- 中心内容 -->
        <a-layout :style="{ margin: '50px 0px 0px 0px', padding: '32px' }">

            <!-- 路由面包屑 -->
            <site-breadcrumb></site-breadcrumb>
        
            <!-- 路由 -->
            <a-layout-content
                :style="{
                    margin: '8px 0px 0px 0px',
                    minHeight: containerHeight+'px',
                    background: '#fff'
                }">
                <router-view></router-view>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script>
import siteHeader from './antd-header.vue';
import siteBreadcrumb from './antd-breadcrumb.vue';

export default {
	name: 'layout',
	components: {
        siteHeader,
        siteBreadcrumb
    },
	data () {
		return {
            containerHeight: 0, // 窗口高度
		}
    },

    async mounted () {
        // 计算高度
		this.containerHeight = window.innerHeight - 130
	}
}
</script>

<style lang="less" scoped>
.ant-layout-content {
    background: transparent !important;
}
</style>
