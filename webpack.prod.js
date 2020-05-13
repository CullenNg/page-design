const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const SimpleProgressWebpackPlugin = require( 'simple-progress-webpack-plugin') // 打包进度条
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = merge(common, {
	mode: 'production',
	output: {
		filename: '[name]_[hash:8].js'
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['babel-preset-env']
				}
			}
		}]
	},
	plugins: [
		new CleanWebpackPlugin(
			['dist/*.js', 'dist/*.map'],
			{
				verbose: true,
				dry: false,
			}
		),
		new SimpleProgressWebpackPlugin()
	],
	optimization: {
		splitChunks: {
			chunks: 'all',
			minSize: 30000,
			maxSize: 0,
			minChunks: 1,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			automaticNameDelimiter: '~',
			name: true,
			cacheGroups: {
				ant: {
					chunks: "initial",
					test: /ant\-design\-vue/,
					name: 'bundle_ant',
					priority: 2,
					minSize: 30000,
					minChunks: 1,
					enforce: true,
					reuseExistingChunk: true // 可设置是否重用该chunk
				},
				bundle: {
					chunks: "initial",
					name: 'common',
					priority: 1,
					minSize: 30000,
					minChunks: 1,
					enforce: true,
					reuseExistingChunk: true // 可设置是否重用该chunk
				},
				async: {
					chunks: "async",
					name: 'async_views',
					priority: 0,
					minSize: 30000,
					minChunks: 1,
					enforce: true,
					maxAsyncRequests: 5, // 最大异步请求数， 默认1
					maxInitialRequests : 3, // 最大初始化请求书，默认1
					reuseExistingChunk: true // 可设置是否重用该chunk
				},
			}
		}
	}
})
