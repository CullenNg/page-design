<template>
    <a-row type="flex" justify="space-between">

        <!-- 路由标题 -->
        <a-col class="route-name">{{ $route.meta.name }}</a-col>

        <!-- 面包屑 -->
        <a-col style="text-align: right">
            <a-breadcrumb :routes="routes" v-if="show_bread">
                <template slot="itemRender" slot-scope="{route, params, routes, paths}">
                    <span v-if="routes.indexOf(route) === routes.length - 1">
                        {{route.name}}
                    </span>
                    <router-link v-else :to="route.path">
                        {{route.name}}
                    </router-link>
                </template>
            </a-breadcrumb>
        </a-col>
    </a-row>
</template>
<script>
export default {
    data () {
        return {};
    },
    computed: {
        show_bread () {
            return this.routes.length > 1;
        },
        routes () {
            const _routes = [];
            // 遍历当前 match 到的路由
            this.$route.matched.map(x => {
                const show_bread = x.meta.hasOwnProperty('show_bread') ? x.meta.show_bread : true;
                const name = x.meta.hasOwnProperty('name') ? x.meta.name : '';
                name && show_bread && _routes.push({
                    path: x.path,
                    name: name
                });
            });
            return _routes;
        }
    }
};
</script>

<style lang="less" scope>
    .route-name {
        font-size:20px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(63,66,69,1);
        margin-bottom: 10px;
    }
</style>
