'use strict';

/**
 * output配置
 * 热更新 devServer  devtool
 * 样式解析
 */

const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.js');
const merge = require('webpack-merge');



module.exports = merge(baseConfig,{

    // output 告诉webpack如何将编译后的文件输出到磁盘
    // 没有单多页面的区别，通过占位符确保文件名称唯一
    output: { // 输出文件
        path: path.join(__dirname, '../dist'), // 所有输出文件的目标路径，绝对路径
        publicPath: '/', // 输出解析文件的目录，url 相对于 HTML 页面
        // path是webpack所有文件的输出的路径，必须是绝对路径，比如：output输出的js,url-loader解析的图片，HtmlWebpackPlugin生成的html文件，都会存放在以path为基础的目录下
        // publicPath 并不会对生成文件的路径造成影响，主要是对你的页面里面引入的资源的路径做对应的补全，常见的就是css文件里面引入的图片
        // “path”仅仅告诉Webpack结果存储在哪里，
        // publicPath设置成相对路径后，相对路径是相对于build之后的index.html的。


        filename: 'js/[name]_[hash:8].js',
        // 对应于 entry 里面的输入文件，经过webpack 打包后输出文件的文件名。
        // 
        chunkFilename: 'js/[name]_[hash:8].js',
        // 指未被列在 entry 中，却又需要被打包出来的 chunk 文件的名称，一般是异步加载的文件。
        // 主要是通过 import()、require.ensure()异步导入的模块;
        // 如果没有配置chunkFilename，就会把 [name] 替换为 chunk 文件的 id 号，打包后会生成例如：1.bundle.js这种文件~
        //////// 开发环境chunkhash不能和热更新一起用，所以不用chunkhash

        // libraryTarget: 'umd',
        // 将你的 library 暴露为所有的模块定义下都可运行的方式。它将在 CommonJS, AMD 环境下运行，或将模块导出到 global 下的变量。
        // umdNamedDefine: true 
        // 当使用了 libraryTarget: "umd",会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define。
    },

    /**
     * webpack4中提出的新概念，指定当前构建环境：production、development、none，默认production
     * 设置mode可以使用webpack内置的函数
     * development:process.env.NODE_ENV = development,开启热更新等等。。。
     * production:process.env.NODE_ENV = production,默认开启代码压缩等等。。。
     */

    mode: 'development', // dev环境
    devServer: {
        contentBase: path.join(__dirname, "dist"), // 基础目录,告诉服务器从哪里提供内容,只有在你想要提供静态文件时才需要。
        compress: true, // 一切服务都启用gzip 压缩
        hot:true, // 开启热更新,启用 webpack 的模块热替换特性
        // hotOnly: true, 
        ////hot 和 hotOnly 的区别是在某些模块不支持热更新的情况下，前者会自动刷新页面，后者不会刷新页面，而是在控制台输出热更新失败
        stats: 'errors-only', // 只在发生错误时输出
        host: '127.0.0.1', // 指定一个host，默认是localhost;
        // 如果希望别人通过ip访问，可设置host:'0.0.0.0'
        port: 8000, // 端口号 默认8080
        historyApiFallback: true, // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html,通常设置为true
        // https: true, // 默认情况下，dev-server 通过 HTTP 提供服务。也可以选择带有 HTTPS 的 HTTP/2 提供服务：
        inline: true, // 默认情况下，应用程序启用内联模式(inline mode)。这意味着一段处理实时重载的脚本被插入到你的包(bundle)中，并且构建消息将会出现在浏览器控制台。
        open: true, // 自动打开浏览器
        proxy: [ // 配置多个数组格式，单个则可以是对象格式
            { // 如果你有单独的后端开发服务器 API，并且希望在同域名下发送 API 请求，可跨域代理
                context: ['/api'],
                target: 'https://www.baidu.com/', // 如 /api/user/ 可代理到：https://www.baidu.com/api/user
                secure: false, // 默认情况下，不接受运行在 HTTPS 上，且使用了无效证书的后端服务器。如果你想要接受，设为true
                changeOrigin: true,
                pathRewrite: { '^/api': '' } // 如果不想要/api，则可重写路径：https://www.baidu.com/user
            }
        ],
        publicPath: '/', // 此路径下的打包文件可在浏览器中访问。
        // 假设服务器运行在 http://localhost:8080 并且 output.filename 被设置为 bundle.js。默认 publicPath 是 "/"，所以你的包(bundle)可以通过 http://localhost:8080/bundle.js 访问。
        // quiet: true, // 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
        // stats: 'errors-only', // 只在发生错误时输出
    },


    devtool: 'source-map',
    // devtool: 'cheap-module-eval-source-map',
    // 这是 "cheap(低开销)" 的 source map，因为它没有生成列映射(column mapping)，只是映射行数。



    module: {
        rules: [

            // 它会应用到普通的 `.css` 文件
            // 以及 `.vue` 文件中的 `<style>` 块
            {
                test: /\.css$/,
                use: [ // 链式调用 从右到左，先用css-loader解析css,再传递给vue-style-loader
                'vue-style-loader',
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
                  'vue-style-loader',
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
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'stylus-loader'
                ]
            }
        ]
    },
    plugins: [


        new webpack.HotModuleReplacementPlugin(), // 启动webpack自带的热替换模块，简称HMR
        // 如果单独使用devServer，代码改变时会更新打包文件，然后reload刷新页面；HMR则只更新修改部分
        //永远不要在生产环境下启用 HMR!!!!!!

    ]
});