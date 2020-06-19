# 可视化页面装修
基于 ```vue``` + ```ant-design``` + ```vue-draggable``` 实现的可视化页面装修功能，基于业务需求和层出不穷的活动营销页面而诞生。

[![Vue](https://img.shields.io/badge/Vue-%5E2.5.16-brightgreen)](https://cn.vuejs.org)
[![Ant-deisgn](https://img.shields.io/badge/Antd-v1.3.10-brightgreen)](https://antdv.com/)
[![Vue.Draggable](https://img.shields.io/badge/Vue.Draggable-v2.23.0-brightgreen)](https://github.com/SortableJS/Vue.Draggable)

![截图1.png](https://github.com/CullenNg/doc-images/blob/master/page-design/1.png)

![演示1.gif](https://github.com/CullenNg/doc-images/blob/master/page-design/QQ20200619-105646.gif)

## 目录
* [查看演示 DEMO](https://cullenng.github.io/page-design/#/home)
* 特点
* 1. 自由拖拽组件
* 2. 支持[M]端布局
* 3. 支持实时预览，所见即所得
* 4. 支持业务组件的自定义配置项（JSON）
* 5. 支持快速创建自定义的业务组件
* [安装](https://github.com/CullenNg/page-design#安装)
* [启动](https://github.com/CullenNg/page-design#使用)
* [代码目录](#代码目录)
* 目前支持组件列表
* 1. [标题栏](https://github.com/CullenNg/page-design#标题栏)
* 2. [广告图](https://github.com/CullenNg/page-design#广告图)
* 3. [商品列表](https://github.com/CullenNg/page-design#商品列表)
* [更新日志](https://github.com/CullenNg/page-design#更新日志)

## 安装
```
$ npm install
```

## 启动
1. 命令行执行：```npm run dev```
2. 浏览器打开链接：[localhost:3001](http://localhost:3001)

## 代码目录
```
├── README.md
├── package.json
├── src
│   ├── html
│   ├── interface // 接口
│   │   ├── core.js
│   │   ├── index.js
│   │   ├── json-data
│   │   │   ├── design_get_page_info.json
│   │   │   ├── get_component_list.json
│   │   │   ├── get_component_template_list.json
│   │   │   ├── get_goods_list.json
│   │   │   ├── material_folder.json
│   │   │   └── material_folder_details.json
│   │   └── material.js
│   ├── layout
│   ├── main.js
│   ├── resource // 图片
│   ├── router // 路由
│   ├── store
│   ├── system-components // 系统公共组件
│   │   ├── dialog
│   │   ├── dialog-goods-manager
│   │   ├── form-unit
│   │   ├── images-manager
│   │   ├── images-sort
│   │   └── ui-component-load
│   ├── ui-component // 业务组件
│   │   ├── U000001
│   │   ├── U000002
│   │   ├── U000003
│   │   ├── common-config.js
│   │   └── component-unit // 业务组件里面公共的元素
│   └── views // 系统页面
│       ├── home // 列表页
│       └── design // 装修页
├── webpack.common.js
├── webpack.dev.js
└── webpack.prod.js
```

## 业务组件配置项自定义
[查看文档](https://github.com/CullenNg/page-design/blob/master/component-config.md)

## 目前支持组件列表

### 标题栏
![标题栏演示.gif](https://github.com/CullenNg/doc-images/blob/master/page-design/QQ20200619-105646.gif)

### 广告图
![广告图演示.gif](https://github.com/CullenNg/doc-images/blob/master/page-design/QQ20200619-180450.gif)

### 商品列表
![商品列表演示.gif](https://github.com/CullenNg/doc-images/blob/master/page-design/QQ20200619-180559.gif)

## 更新日志 

### v1.0 [2020-06-15]
1. 广告图组件: 调整图片加载的方法，优化UI，暂时去除其他配置项
2. 标题栏组件: 增加 margin, padding, text-align 的配置项
3. 商品列表组件：调整商品数据的增加方式
4. 装修页：获取页面数据改为json获取
5. 增加2个演示页面数据