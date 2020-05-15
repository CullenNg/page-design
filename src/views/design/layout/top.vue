<template>
    <div class="design-layout-top">
        <a-row type="flex" justify="space-between" align="middle" class="header">
            <a-col :span="7" class="left">

                <!--logo-->
                <div class="geshop-logo">
                    <a href="/"><i class="iconfont logo"></i></a>
                </div>

                <!--渠道-->
                <div class="channel">
                    <span class="tip">渠道：</span>
                    <a-select
                        class="select-channel"
                        :value="current_pipeline"
                        :dropdownStyle="selectStyle"
                        :dropdownMatchSelectWidth="false"
                        @change="handlePipelineChange">

                        <a-icon
                            slot="suffixIcon"
                            type=" iconfont geshop-icon design-arrow-down">
                        </a-icon>

                        <a-select-option
                            v-for="(item, index) in select_options.pipelines"
                            :key="index"
                            :value="item.pipeline">
                            {{ item.pipeline_name }}
                        </a-select-option>
                    </a-select>
                </div>

                <!--语言-->
                <div class="language">
                    <a-select
                        class="select-channel"
                        :value="current_lang"
                        :dropdownStyle="selectStyle"
                        :dropdownMatchSelectWidth="false"
                        @change="handleLangChange">

                        <a-icon
                            slot="suffixIcon"
                            type=" iconfont geshop-icon design-arrow-down">
                        </a-icon>

                        <a-select-option
                            v-for="item in select_options.langs"
                            :key="item.key"
                            :value="item.key">
                            {{ item.name }}
                            <template v-if="item.is_default === 1">
                                <span class="default" style="color: #999;">(默认)</span>
                            </template>
                        </a-select-option>

                    </a-select>
                </div>

                <!--端口-->
                <div class="client">
                    <a-select
                        class="select-channel"
                        style="width: 70px;"
                        dropdownClassName="platformCls"
                        :value="current_platform"
                        :dropdownMatchSelectWidth="false"
                        @change="handleClientChange">
                        <a-icon
                            slot="suffixIcon"
                            type=" iconfont geshop-icon design-arrow-down">
                        </a-icon>

                        <a-select-option
                            v-for="(item, index) in select_options.platforms"
                            :key="index"
                            :value="item.code">
                            <i class="iconfont geshop-icon design-platform-pc" v-if="item.code == 'pc'"></i>
                            <i class="iconfont geshop-icon design-platform-wap" v-else></i>
                            <span class="title">{{ item.code == 'pc' ?  item.name : '移动端' }}</span>
                        </a-select-option>

                    </a-select>
                </div>
            </a-col>

            <!-- 页面标题 -->
            <a-col :span="7" class="middle">{{ activity_title }}</a-col>

            <!-- 右侧功能区域 -->
            <a-col :span="6" class="right">
                <a-select
                    class="select-channel"
                    placeholder="更多操作"
                    :dropdownStyle="selectStyle"
                    :dropdownMatchSelectWidth="false"
                    @change="handleMoreChange">
                    <a-icon
                        slot="suffixIcon"
                        type=" iconfont geshop-icon design-arrow-down"></a-icon>
                    <a-select-option
                        v-for="(item, index) in more_actions"
                        :key="index"
                        :value="item.value">
                        {{ item.name }}
                    </a-select-option>
                </a-select>

                <a href="javascript:void(0);" class="save" @click="handle_page_save">保存并继续</a>
                <a href="javascript:void(0);" class="release" @click="handle_page_release">发布</a>
            </a-col>

        </a-row>

    </div>
</template>

<script>

export default {
    name: 'design-top',
    data () {
        return {
            activity_title: '', // 活动标题

            current_pipeline: '',  // 当前选择的渠道
            current_lang: '', // 当前选择的语言
            current_platform: '', // 当前选择的端口

            select_options: {
                pipelines: [], // 所有渠道列表
                langs: [], // 所有语言列表
                platforms: [], // 所有设备终端列表
            },
            
            // 更多操作
            more_actions: [
                {
                    name: '操作一',
                    value: 0
                },
                {
                    name: '操作二',
                    value: 1
                }
            ],

            // 下拉选项的公共样式配置
            selectStyle: {
                'text-align': 'center'
            },
        }
    },
    
    methods: {
        /**
         * 渠道改变
         * @param {String} code 渠道编码
         * **/
        handlePipelineChange (code) {
            this.current_pipeline = code;
        },

        /**
         * 语言改变
         * @param {String} code 语言编码
         * **/
        handleLangChange (code) {
            this.current_lang = code;
        },

        /**
         * 端口改变
         * @param {String} code 设备端编码 pc/wap
         * **/
        handleClientChange (code) {
            this.current_platform = code;
        },

        /**
         * 更多操作
         * @param {Number} index
         * */
        handleMoreChange (index) {
            console.log(index);
        },

        /**
         * 页面保存
         */
        handle_page_save () {
            this.$store.dispatch('design/page_save');
        },

        /**
         * 发布页面
         */
        handle_page_release () {
            this.$message.success('发布成功');
        }
    },

    mounted () {
        const info = this.$store.state.page.info; // 当前装修页数据
        const pipelines = this.$store.state.page.pipelines; // 渠道
        const relations = this.$store.state.page.relations; // 端口

        // 页面标题
        this.activity_title = info.title;

         // 当前选中的值
        this.current_pipeline = info.pipeline;
        this.current_lang = info.lang;
        this.current_platform = info.platform;

        // 渠道列表
        this.select_options.pipelines = [...pipelines]; 

        // 语言列表
        this.select_options.langs = pipelines.filter((item) => {
            return item.pipeline == this.current_pipeline;
        })[0].langList;

        // 设备终端列表
        this.select_options.platforms = Object.keys(relations).map(key => {
            const item = relations[key];
            return {
                name: item.name,
                code: key,
                url: item.url
            }
        });
    }
}
</script>

<style lang="less">

    .design-layout-top {

        // 图标
        .design-arrow-down {
            font-size: 12px !important;
            transform: scale(0.5);
            transition: 0.5s;
            &:before {
                display: block;
            }
            &.drop {
                transform: scale(0.5) rotate(180deg);
            }
        }

        // 左侧
        .left {
            .select-channel .ant-select-selection {
                border: none;
                box-shadow: none;
                height: 42px;
            }
            .select-channel .ant-select-selection__rendered{
                line-height: 38px;
            }
        }

        // 右侧
        .right {
            .select-channel .ant-select-selection {
                border: none;
                box-shadow: none;
                border-radius: 16px;
                background-color: #F0F2F5;
            }
            .ant-select-selection__placeholder, .ant-select-selection-selected-value {
                color: #3F4245;
            }
            .ant-select-selection__rendered{
                margin-left: 22px;
            }
            a {
                text-decoration: none;
            }
        }

        .design-platform-pc, .design-platform-wap {
            font-size: 24px !important;
            vertical-align: middle;
        }
        .select-channel .title{
            vertical-align: middle;
        }

        // 渠道选择
        .channel {
            .ant-select-selection-selected-value {
                color: #409EFF !important;
            }
        }
    }
    
    // 端口选择
    .platformCls {
        .design-platform-pc, .design-platform-wap{
            font-size: 24px !important;
            vertical-align: middle;
        }
        .title {
            vertical-align: middle;
        }
    }

     // 下拉菜单选中项去除字体加粗
    .ant-select-dropdown-menu-item-selected,
    .ant-select-dropdown-menu-item-selected:hover {
        font-weight: 400 !important;
    }
</style>

<style lang="less" scoped>
.design-layout-top {
    position: fixed;
    left: 0px;
    top: 0px;
    right: 0px;
    width: 100%;
    height: 50px;
    background: rgba(255,255,255,1);
    box-shadow: 2px 0px 8px 0px rgba(188,195,206,1);
    z-index: 3;

    .header {
        height: 50px;
        flex-flow: row nowrap;
    }

    .left {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        min-width: 450px;

        .geshop-logo {
            width: 52px;
            border-right: 1px solid #E8EAEC;
            a {
                padding-left: 8px;
            }
            i {
                font-size: 32px;
            }
        }

        .channel,
        .language,
        .client{
            height: 50px;
            line-height: 50px;
            border-right: 1px solid #E8EAEC;
        }

        // 渠道选择
        .channel {
            padding-left: 16px;
            min-width: 190px;
            .select-channel {
                width: 122px;
            }
        }

        // 语言选择
        .language {
            .select-channel {
                width: 120px;
            }
            // 屏蔽默认语言的 tag
            .default {
                display: none;
            }
        }
        .client .title{
            display: none;
        }
    }

    .middle {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #3F4245;
        font-size: 18px;
        font-weight:600;
    }

    .right {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
        line-height: 50px;
        align-items: center;
        min-width: 470px;

        .save,
        .release {
            width: 96px;
            text-align: center;
            color: #3F4245;
        }
        .preview, .save {
            border-left: 1px solid #E8EAEC;
            &:hover {
                background: #F0F2F5;
            }
        }

        .release {
            background-color: #409EFF;
            color: #ffffff;
            &:hover {
                background: #228FFF;
            }
        }

        .select-channel {
            width: 144px;
            margin-right: 25px;
        }
    }


}
</style>
