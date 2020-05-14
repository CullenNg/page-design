<template>
    <div class="form-item col-1">
        <label>{{ config.title || '' }}</label>
        <!-- 选择图片 -->
        <div class="image-picker">

            <!-- 文本输入框 -->
            <a-input
                size="large"
                v-model="current_value"
                class="image-picker-wrapper"
                @blur="handle_input_change">
                <img
                    width="38"
                    height="38"
                    :src="thumbnail_url"
                    slot="addonBefore"
                    v-if="thumbnail_url"
                    @click="handle_open_material">
                <a-icon
                    v-else
                    slot="addonBefore"
                    type="plus"
                    @click="handle_open_material"/>
            </a-input>

            <!-- 素材库弹窗 -->
            <a-modal
                width="960px"
                :visible="visible.material"
                title="素材库管理"
                class="material-modal"
                @cancel="visible.material = false">

                <!-- 左侧文件夹列表 -->
                <div class="tree-list">
                    <a-tree
                        :treeData="treeData"
                        defaultExpandAll
                        showIcon
                        :selectedKeys.sync="selected_folder_keys"
                        @select="handle_folder_selecte">
                        <template slot="folder" slot-scope="{selected}">
                            <i class="iconfont geshop-icon design-folder" style="color: #81BFFF; font-size: 20px;"></i>
                        </template>
                    </a-tree>
                </div>

                <!-- 目录内容 -->
                <div :class="{
                        'files-list': true,
                        'is-empty': files_list.length <= 0 && loading_files == false
                    }">
                    <a-spin :spinning="loading_files">
                        <ul>
                            <li v-for="(item, index) in files_list" :key="index">
                                <div class="image-wrapper">
                                    <img :src="item.thumbnail_url" :alt="item.name">
                                    <span>{{ item.width }} x {{ item.height }}</span>
                                </div>
                                <label>{{ item.name }}</label>
                                <button @click="handle_chosen_file(item)">立即使用</button>
                            </li>
                        </ul>
                    </a-spin>
                </div>

                <!-- 页脚 -->
                <template slot="footer">

                    <!-- 创建目录 -->
                    <a-button icon="plus" @click="new_folder.visible = true">创建目录</a-button>

                    <!-- 文件上传 -->
                    <a-upload
                        name="files"
                        :multiple="true"
                        :disabled="selected_folder_id == null"
                        :data="upload.data"
                        :showUploadList="false"
                        action="/admin/resource/multi-file-upload"
                        :beforeUpload="handle_before_upload"
                        @change="handle_upload_change">
                        <a-button
                            type="primary"
                            :disabled="!selected_folder_id || upload.uploading"
                            :loading="upload.uploading"
                            icon="cloud-upload">
                            上传文件
                        </a-button>
                    </a-upload>
                </template>
                
            </a-modal>
            
            <!-- 创建目录弹窗 -->
            <design-dialog
                width="400px"
                title="创建目录"
                class="asdasdasdasda"
                @isOk="new_folder_confirm"
                @isCancel="new_folder.visible = false"
                :visible="new_folder.visible">
                <div style="padding-right: 24px;">
                    <a-input v-model="new_folder.folder_name" />
                </div>
            </design-dialog>

        </div>
    </div>
</template>

<script>

// 目录递归
function toTreeData(data, pid){
    function tree(id) {
        let arr = []
        data.filter(item => {
            return item.parent == id;
        }).forEach(item => {
            arr.push({
                id: item.id,
                title: item.title,
                children: tree(item.id),
                scopedSlots: {
                    icon: 'folder'
                }
            })
        })
        return arr
    }
    return tree(pid)  // 第一级节点的父id，是null或者0，视情况传入
}


export default {
    name: 'unit-image',

    props: {
        // 图片地址
        value: {
            type: String,
            default: ''
        },
        // 配置项
        config: {
            type: Object,
            default () {
                return {};
            }
        },
        // 根配置项
        rootConfig: {
            type: Object,
            default () {
                return {};
            }
        }
    },

    data () {
        return {
            current_value: this.value, // 组件内置的变量
            // 展示弹层
            visible: {
                material: false,
                new_folder: false,
            },
            thumbnail_url: this.value, // 缩略图
            treeData: [], // 目录列表
            files_list: [], // 素材数据列表
            selected_folder_id: null, // 选中的目录
            selected_folder_keys: [], // 选中的目录 KEY
            selected_folder_keys_backup: [], // 选中的目录 KEY，备用，记录上次结果
            loading_folder: false, // 目录加载中
            loading_files: false, // 内容加载中,

            // 创建目录的弹窗
            new_folder: {
                loading: false,
                visible: false,
                folder_name: '', // 目录名字
            },

            // 上传
            upload: {
                uploading: false, // 上传中
                data: {
                    parent_id: '',
                }
            }
        }
    },

    watch: {
        value (newVal) {
            this.thumbnail_url = newVal;
            this.current_value = newVal;
        }
    },

    methods: {
        // 获取目录数据，递归处理
        get_folder () {
            this.$api.design_material_folder().then(res => {
                const folders = res.data.map(item => {
                    return {
                        id: Number(item.id),
                        title: item.text,
                        children: [],
                        parent: item.parent === '#' ? '0' : item.parent,
                    }
                });
                folders.push({
                    id: 0
                });
                this.treeData = toTreeData(folders, 0);
            });
        },

        /**
         * 获取文件夹内容
         */
        get_folder_details () {
            this.loading_files = true;
            this.$api.design_material_folder_detail({
                id: this.selected_folder_id
            }).then(res => {
                this.loading_files = false;
                // 过滤 type = 1 的图片素材
                this.files_list = res.data.list.filter(item => item.type == '1') || [];
            });
        },

        /**
         * 打开素材管理的弹窗
         */
        handle_open_material () {
            this.visible.material = true;
            this.get_folder();
        },

        // 读取目录内容
        handle_folder_selecte (selectedKeys, e) {
            if (e.selectedNodes[0]) {
                this.selected_folder_keys = selectedKeys;
                this.selected_folder_keys_backup = selectedKeys;

                // 目录唯一ID
                const dir_id = e.selectedNodes[0].data.props.id;
                // 避免重复加载
                if (this.selected_folder_id === dir_id) return false;
                // 更新选中的目录ID
                this.selected_folder_id = dir_id;
                this.upload.data.parent_id = dir_id;
                // 读取文件夹内容
                this.get_folder_details();
            } else {
                this.selected_folder_keys = this.selected_folder_keys_backup;
            }
        },

        /**
         * 选择素材内容
         * @param {string} thumbnail_url 缩略图
         * @param {string} url 图片外连
         * @param {String} width 宽度
         * @param {String} Height 高度
         */
        handle_chosen_file ({ thumbnail_url, url, width, height }) {
            // 检查文件大小
            const res = this.handle_check_size(Number(width), Number(height));
            if (res === false) return false;
            // 选择文件
            this.visible.material = false;
            this.current_value = url;
            this.$emit('input', url);
            this.thumbnail_url = thumbnail_url;
        },

        /**
         * 检查图片大小
         * @param {Int} width
         * @param {Int} height
         * @requires {Object} config 可选项
         * @requires {Object} rootConfig 根配置项
         */
        handle_check_size (width, height) {
            if (this.config.width != null && this.config.height != null) {
                const maxWidth = Number(eval(`this.rootConfig.${this.config.width}.value`));
                const maxHeight = Number(eval(`this.rootConfig.${this.config.height}.value`));
                if (width === maxWidth && height === maxHeight) {
                    return true;
                } else {
                    this.$message.error(`图片尺寸不对，只能使用尺寸为 ${maxWidth}x${maxHeight} 的素材`);
                    return false;
                }
            } else {
                return true;
            }
        },

        handleCancel () {
            this.visible = false;
        },

        /**
         * 创建目录
         */
        async new_folder_confirm () {
            if (this.new_folder.folder_name != '') {
                await this.$api.design_material_folder_add({
                    name: this.new_folder.folder_name,
                    type: 0,
                    url: '',
                    parent_id: this.selected_folder_id || 0
                });
                this.new_folder.visible = false;
                this.new_folder.folder_name = '';
                this.get_folder();
            }
        },

        // 上传文件前
        handle_before_upload () {
            this.upload.uploading = true;
            return true;
        },

        // 上传文件成功
        handle_upload_change (info) {
            // if (info.file.status !== 'uploading') {
            //     console.log(info.file, info.fileList);
            // }
            // 上传完毕
            if (info.file.status === 'done') {
                this.upload.uploading = false;
                if (info.file.response.code === 0) {
                    this.$message.success(`${info.file.name} 上传成功`);
                    // 刷新文件夹的内容
                    this.get_folder_details();
                } else {
                    this.$message.error(info.file.response.message);
                }
            } else if (info.file.status === 'error') {
                this.upload.uploading = false;
                this.$message.error(`${info.file.name} 上传失败`);
            }
        },

        // 输入框值变化
        handle_input_change (e) {
            const url = e.target.value;
            // 判断是否有变更
            if (url === this.thumbnail_url) return false;
            // 判断不为空
            if (url != '') {
                // 获取图片大小
                const originalImg = new Image();
                originalImg.src = url;
                originalImg.onload = () => {
                    const width = originalImg.width;
                    const height = originalImg.height;
                    // 检查大小
                    const res = this.handle_check_size(Number(width), Number(height));
                    if (res) {
                        this.$emit('input', url);
                        this.thumbnail_url = url;
                    } else {
                        e.target.value = '';
                        this.$emit('input', '');
                        this.thumbnail_url = '';
                        return false;
                    }
                };
                originalImg.onerror = () => {
                    e.target.value = '';
                    this.current_value = '';
                    this.$emit('input', '');
                    this.thumbnail_url = '';
                };
            } else {
                this.$emit('input', url);
                this.thumbnail_url = url;
            }
        }
    }
}
</script>

<style lang="less">

// 素材管理的弹窗
.material-modal {
    .ant-modal-body {
        padding: 0px;
        display: flex;
        flex-wrap: wrap;
    }

    // 目录列表
    .tree-list {
        width: 260px;
        height: 460px;
        border-right: solid 1px #ddd;
        padding-bottom: 20px;
        overflow-x: hidden;
        overflow-y: auto;
        box-sizing: border-box;

        .ant-tree {
            padding-left: 10px;
        }

        .ant-tree-node-content-wrapper {
            padding: 0px;
        }

        // 选中的
        .ant-tree-treenode-selected {
            background: none !important;
        }

        // 子项
        .ant-tree-node-content-wrapper {
            &:hover {
                background: none !important;
            }
            &.ant-tree-node-selected {
                background: none !important;
            }
        }

        // 选择项标题
        .ant-tree-node-selected .ant-tree-title,
        .ant-tree-title:hover {
                background: #1e9fff;
                color: #fff;
                line-height: 24px;
                display: inline-block;
                padding-right: 8px;
                padding-left: 8px;
                border-radius: 4px;
        }

    }

    // 内容
    .files-list {
        width: 700px;
        height: 460px;
        overflow-y: auto;
        box-sizing: border-box;
        position: relative;

        // 数据为空
        &.is-empty {
            &:before {
                content: "暂无数据";
                position: absolute;
                left: 50%;
                top: 50%;
                margin-left: -28px;
                margin-top: -10px;
            }
        }

        // 预加载
        .ant-spin-nested-loading {
            position: absolute;
            left: 0px;
            top: 0px;
            right: 0px;
            bottom: 0px;
            .ant-spin-spinning {
                bottom: 0px;
                top: 0px;
                max-height: fit-content;
            }
        }

        ul {
            list-style: none;
            margin: 0px;
            padding: 0px;
            padding-left: 24px;
            padding-top: 24px;
            display: flex;
            flex-wrap: wrap;

            li {
                position: relative;
                width: 116px;
                height: 116 + 48px;
                overflow: hidden;
                padding: 8px;
                margin-right: 16px;
                margin-bottom: 20px;
                font-size: 12px;

                &:hover {

                    &::before {
                        position: absolute;
                        left: 0px;
                        bottom: 0px;
                        right: 0px;
                        top: 0px;
                        border: solid 2px #409EFF;
                        border-radius: 4px;
                        z-index: 1;
                        content: " ";
                    }

                    button {
                        visibility: visible;
                    }

                    label {
                        display: none;
                    }
                }

                .image-wrapper {
                    position: relative;
                    display: block;
                    width: 100px;
                    height: 100px;
                    font-size: 0px;
                    line-height: 100px;
                    background: #f9f9f9;
                    img {
                        display: inline-block;
                        vertical-align: middle;
                    }
                    span {
                        position: absolute;
                        left: 0px;
                        bottom: 0px;
                        right: 0px;
                        display: block;
                        height: 20px;
                        line-height: 20px;
                        text-align: center;
                        background: #f1f1f1;
                        color: #666;
                        font-size: 12px;
                    }
                }

                label {
                    display: block;
                    height: 40px;
                    overflow: hidden;
                    padding: 0 4px;
                    line-height: 1.7em;
                    margin-top: 6px;
                }

                button {
                    position: absolute;
                    left: 0px;
                    bottom: 0px;
                    right: 0px;
                    width: 100%;
                    height: 48px;
                    line-height: 48px;
                    visibility: hidden;
                    border: none;
                    background: #409EFF;
                    color: #fff;
                    cursor: pointer;
                    z-index: 2;
                    border-radius:0px 0px 4px 4px;
                    outline: none;
                }
            }
        }
    }
}
</style>