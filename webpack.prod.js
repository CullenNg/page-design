const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const SimpleProgressWebpackPlugin = require( 'simple-progress-webpack-plugin') // 打包进度条
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = htmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
			['dist/*'],
			{ verbose: true, dry: false, }
		),
		new SimpleProgressWebpackPlugin(),
		new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/html/index.html',
            inject: true,
            chunks: ['main'],
            // 路径源修改
            static: '/',
            timestamp: new Date().getTime(),
            minify: {
                //删除html的注释
                removeComments: true,
                //删除空格
                collapseWhitespace: true
            }
		}),
		new BundleAnalyzerPlugin()
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
			}
		}
	}
})
