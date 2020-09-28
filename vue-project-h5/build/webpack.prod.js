'use strict';

/**
 * output配置
 * 目录清理
 * css样式解析
 * css压缩，js压缩
 * js分离，splitChunks分块，css分离
 */

const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清除打包目录

const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 引入添加css指纹插件
const OptimizeCSSAssetsPlugins = require('optimize-css-assets-webpack-plugin') // 引入css压缩插件
const webpack = require('webpack');
const argv = require('yargs').argv; // node工具：获取命令行参数

const baseConfig = require('./webpack.base.js');
const merge = require('webpack-merge');


const getPublicPath = function() {
    console.log('====argv',argv);
    let url = argv && argv.publicPath;
    if (url) {
        if (/^\/|http/.test(url)) {
            url = url;
        } else {
            url = '/' + url;
        }
    } else {
        url = '/';
    }
    console.log('====url',url);
    return url;
};

module.exports = merge(baseConfig,{
    output: { // 输出文件
        path: path.join(__dirname, '../dist'), // 所有输出文件的目标路径，绝对路径
        publicPath: './' || getPublicPath(), // 输出解析文件的目录，url 相对于 HTML 页面
        // path是webpack所有文件的输出的路径，必须是绝对路径，比如：output输出的js,url-loader解析的图片，HtmlWebpackPlugin生成的html文件，都会存放在以path为基础的目录下
        // publicPath 并不会对生成文件的路径造成影响，主要是对你的页面里面引入的资源的路径做对应的补全，常见的就是css文件里面引入的图片
        // “path”仅仅告诉Webpack结果存储在哪里，
        // publicPath设置成相对路径后，相对路径是相对于build之后的index.html的。
        filename:'js/[name]_[chunkhash:7].js', // 中括号中name为占位符 chunkhash添加js指纹
        chunkFilename: 'js/[name]_[chunkhash:7].js',
        // 指未被列在 entry 中，却又需要被打包出来的 chunk 文件的名称，一般是异步加载的文件。
        // 主要是通过 import()、require.ensure()异步导入的模块;
        // 如果没有配置chunkFilename，就会把 [name] 替换为 chunk 文件的 id 号，打包后会生成例如：1.bundle.js这种文件~
        //////// 开发环境chunkhash不能和热更新一起用，所以不用chunkhash

        // libraryTarget: 'umd',
        // 将你的 library 暴露为所有的模块定义下都可运行的方式。它将在 CommonJS, AMD 环境下运行，或将模块导出到 global 下的变量。
        // umdNamedDefine: true 
        // 当使用了 libraryTarget: "umd",会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define。
    },

    mode: 'production', // 环境
    module: {
        rules: [

            // 它会应用到普通的 `.css` 文件
            // 以及 `.vue` 文件中的 `<style>` 块
            {
                test: /\.css$/,
                use: [ // 链式调用 从右到左，先用css-loader解析css,再传递给vue-style-loader
                // 'vue-style-loader',
                MiniCssExtractPlugin.loader, 
                // 该插件不能与style-loader一起使用，因前者是把样式提取出来，而后者是把样式插入到header里面，功能互斥
                'css-loader',
                {
                    loader:'postcss-loader' // 引入插件
                    // options:{ // autoprefixer的旧版本可以在此添加
                    //     plugins:() => {
                    //         require('autoprefixer')({ // 引入插件，自动给css3加前缀
                    //             overrideBrowserslist:['last 2 version','>1%','ios 7'] // 指定兼容浏览器版本: 浏览器最近两个版本、使用人数>1%、ios 7以上的版本
                    //         })
                    //     }
                    // }
                  },
                    {
                        loader:'px2rem-loader', // 引入插件，px转rem
                        options:{
                            /**
                             * 1rem等于75px,以width为750px的设计稿为标准,
                             * 比如p标签内设置font-size为24px;当width为750px时，根元素font-size为37.5px;
                             * 第一步：打包的时候转为rem,24 / 75 = 0.32rem;
                             * 第二步：由lib-flexible动态计算得根元素font-size为37.5px，即该宽度下，1rem为37.5px;
                             * 第三步：计算p标签内字体展示大小：0.32 * 37.5 = 12px
                             */
                            remUnit:75,
                            remPrecision: 8 // px转换为rem后的小数点位数
                        }
                    }
                ]
            },
            // 它会应用到普通的 `.less` 文件
            // 以及 `.vue` 文件中的 `<style lang="less">` 块
            {
                test: /\.less$/,
                use: [
                //   'vue-style-loader',
                MiniCssExtractPlugin.loader, 
                  'css-loader',
                  {
                    loader:'postcss-loader' // 引入插件
                    // options:{ // autoprefixer的旧版本可以在此添加
                    //     plugins:() => {
                    //         require('autoprefixer')({ // 引入插件，自动给css3加前缀
                    //             overrideBrowserslist:['last 2 version','>1%','ios 7'] // 指定兼容浏览器版本: 浏览器最近两个版本、使用人数>1%、ios 7以上的版本
                    //         })
                    //     }
                    // }
                  },
                    {
                        loader:'px2rem-loader', // 引入插件，px转rem
                        options:{
                            /**
                             * 1rem等于75px,以width为750px的设计稿为标准,
                             * 比如p标签内设置font-size为24px;当width为750px时，根元素font-size为37.5px;
                             * 第一步：打包的时候转为rem,24 / 75 = 0.32rem;
                             * 第二步：由lib-flexible动态计算得根元素font-size为37.5px，即该宽度下，1rem为37.5px;
                             * 第三步：计算p标签内字体展示大小：0.32 * 37.5 = 12px
                             */
                            remUnit:75,
                            remPrecision: 8 // px转换为rem后的小数点位数
                        }
                    },
                    'less-loader'
                ]
            },
            // 它会应用到普通的 `.scss` 文件
            // 以及 `.vue` 文件中的 `<style lang="scss">` 块
            {
                test: /\.scss$/,
                use: [
                    // 'vue-style-loader',
                    MiniCssExtractPlugin.loader, 
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    // 'vue-style-loader',
                    MiniCssExtractPlugin.loader, 
                    'css-loader',
                    'stylus-loader'
                ]
            },
        ]
    },
    plugins: [
    
        new CleanWebpackPlugin(), // 清理目录

        new MiniCssExtractPlugin({ // css包分离，添加css指纹插件 [contenthash]
            // filename:'static/css/[name]_[contenthash:8].css',
            filename:'[name]_[contenthash:8].css'
        }),
        new OptimizeCSSAssetsPlugins({ // css压缩
            assetNameRegExp:/\.css$/g, // 用于匹配需要优化或者压缩的资源名
            cssProcessor:require('cssnano') // 依赖cssnano css处理器
        }),
    ],


    // 分块优化
    // 主要就是根据不同的策略来分割打包出来的bundle。
    optimization: { // 2.分离第三方库
        splitChunks: {
            // chunks: 'all', // 同时分割同步和异步代码，它其实就是下面的配置

            // a.webpack4本身默认配置
            // cacheGroups: {
            //     vendors: { // 第三方
            //       test: /[\\/]node_modules[\\/]/,
            //       priority: -10 // 优先级
            //     },
            //     default: { // default这一项表示默认的缓存组，包括其它共享模块，但大于30k的
            //       minChunks: 2, // 最小引用次数
            //       priority: -20,
            //       reuseExistingChunk: true
            //     }
            //   },

            // b.自定义配置
            minSize: 0, // 为0则只要有引用就打包
            cacheGroups: { // 可以实现对文件模块的细粒度控制
                vendor: { // 第三方库
                    test: /[\\/]node_modules[\\/]/, // node-modules里的第三方库
                    name: 'vendors', // 提取出来，名字叫vendors
                    filename: 'js/[name]_[chunkhash:8].js',
                    chunks: 'all' // 同时分割同步和异步代码
                },
                commons: { // 打包entry入口中的公共模块
                    name: 'commons', // 名字叫commons
                    chunks: 'all',
                    // filename: 'js/[name]_[chunkhash:8].js',
                    minChunks: 2 // 只要引用次数达2次，即分离出来进行打包
                }
            }
        }
    },
});