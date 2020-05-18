const path = require('path')
const globEntry = require('webpack-glob-entry')
const ManifestPlugin = require('webpack-manifest-plugin')

module.exports = {
	entry: globEntry('./src/*.js'),
	plugins: [
		new ManifestPlugin({
			basePath: '',
			publicPath: ''
		})
	],
	resolve: {
		extensions: ['.vue', '.js'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'@': path.resolve(__dirname, './src')
		}
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.less$/,
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader'
				}, {
					loader: 'less-loader'
				}]
			},
			{
				test: /\.png$/,
				use: ['url-loader']
			}
		]
	}
}
