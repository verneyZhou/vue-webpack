'use strict';

const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const webpack = require('webpack');




console.log('======',path.join(__dirname, '..', 'src'));



module.exports = {
    // entry 指定webpack打包入口文件 ,从入口文件开始，寻找依赖文件，一层层遍历，形成依赖树，最后打包生成文件
    // 起点或是应用程序的起点入口。从这个起点开始，应用程序启动执行。如果传递一个数组，那么数组的每一项都会执行。
    // 动态加载的模块不是入口起点。
    // 简单规则：每个 HTML 页面都有一个入口起点。单页应用(SPA)：一个入口起点，多页应用(MPA)：多个入口起点。
    // 命名：如果传入一个字符串或字符串数组，chunk 会被命名为 main。如果传入一个对象，则每个键(key)会是 chunk 的名称，该值描述了 chunk 的入口起点。
    // entry: './src/index.js', // 单页面入口配置（简写形式）
    // 同上
    // entry: {
    //     main: './src/index.js',
    // },
    ///// ******单页面配置*****
    entry: {
        main: './src/index.js', // 入口文件
        vendors: ['vue','vue-router','vuex','axios'] // 分离第三方库
    },

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

    /////配置模板解析resolve
    resolve: {
        // 在导入语句没带文件后缀时，webpack会自动带上后缀去尝试访问文件是否存在。
        // resolve.extensions用于配置在尝试过程中用到的后缀列表
        extensions: ['.js', '.vue', '.json', '.scss', '.css', '.less'],
        alias: {
            // resolve.alias配置项通过别名来把原来导入路径映射成一个新的导入路径。
            // 例：通过 import Button from '@/components/button' 导入时，被替换成：
            // /Users/admin/my-code/self/byme/vue-webpack-project/src/components/button
            '@': path.join(__dirname, '..', 'src'),
            // $符号来缩小范围只命中以关键字结尾的导入语句
            // 例：通过 import Vue from 'vue' 导入时，被替换成：import Vue from 'vue/dist/vue.esm.js'
            'vue$': 'vue/dist/vue.esm.js'
        },
        // resolve.modules配置webpack去哪些目录下寻找第三方模块。默认是去node_modules目录下寻找。
        modules:['node_modules']
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
        port: 8001, // 端口号 默认8080
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
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: "pre", // 预处理eslint-loader规则

                /////// eslint-loader规则必须要先于babel-loader规则
                /////// 我们使用eslint-loader是为了对编译前的ES6语法进行检查，而不是对使用了babel编译后的语法进行检查。
                //////// 所以在webpack中，eslint-loader规则要优先于babel-loader规则

                exclude: [/node_modules/], // 不包含
                include: [path.resolve(__dirname, 'src')], // 指定检查的目录
                options: { // 配置项参数
                    formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
                    // formatter默认是stylish，如果想用第三方的可以安装该插件，如上方的示例中的 eslint-friendly-formatter 。
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // 它会应用到普通的 `.js` 文件
            // 以及 `.vue` 文件中的 `<script>` 块
            {
                test:/.js$/, // 指定匹配规则
                exclude: /node_modules/, // 不包含哪些文件
                // include: [path.join(__dirname, '..', 'src')], // 包含哪些文件
                use:[ // a.数组引入
                    'babel-loader',
                ]
                // use:{ // b.对象引入。 可在这里添加选项，也可以在根目录新建.babelrc文件写入配置
                //     loader:'babel-loader', // 指定使用的loader名称
                //     options:{ // 选项
                //         presets:['@babel/preset-env']
                //     }
                // },
            },

            // 它会应用到普通的 `.css` 文件
            // 以及 `.vue` 文件中的 `<style>` 块
            {
                test: /\.css$/,
                use: [ // 链式调用 从右到左，先用css-loader解析css,再传递给vue-style-loader
                'vue-style-loader',
                'css-loader'
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
            },

            ////////url-loader
            // 图片解析
            {
                test: /\.(png|jpe?g|gif|bmp|webp|svg)(\?.*)?$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:10240,
                            // 字节数,意味着当图片大小小于10k的话，打包时会进行base64转换
                            name: path.posix.join('static', 'images/[name].[hash:7].[ext]'),
                            // path.posix.join(a,b): a/b  连接多个路径，pasix兼容不同系统
                            // [name]为文件名，[hash:7]为添加图片文件指纹hash值,7位，[ext]为资源后缀名
                            // name所指路径其实是相对于dist文件夹的路径，打包后，会生成dist/static/images/[name]...图片文件，
                            // 但，打包时会把项目中的图片文件路径url替换成上面配置的name内容，即：static/iamges/[name]...

                            // 需要注意的是：
                            // img和font等资源中，使用 chunkhash 会报错,所以还是用hash还添加资源指纹~但：
                            // 此hash非webpack每次项目构建的hash，它是由file-loader根据文件内容计算出来的，不要误认为是webpack构建的hash!!!!!
                            
                        }
                    }
                ]
            },
            //字体解析
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1024,
                        name: path.posix.join('static', 'fonts/[name].[hash:7].[ext]'),
                        // 打包后，会生成dist/static/fonts/[name]...字体文件
                        
                    }
                }
            },
            // 视频、音频解析
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1024,
                        name: path.posix.join('static', 'medias/[name].[hash:7].[ext]'),
                        // 打包后，会生成dist/static/medias/[name]...字体文件
                    }
                }
            },
        ]
    },
    plugins: [
        // 请确保引入这个插件!!!
        new VueLoaderPlugin(),


        new webpack.HotModuleReplacementPlugin(), // 启动webpack自带的热替换模块，简称HMR
        // 如果单独使用devServer，代码改变时会更新打包文件，然后reload刷新页面；HMR则只更新修改部分
        //永远不要在生产环境下启用 HMR!!!!!!
        
        new webpack.NoEmitOnErrorsPlugin(), // 帮助减少不需要的信息展示

        new FriendlyErrorsWebpackPlugin(), // 命令行提示优化

        /////作用：可以在全局调用变量来判断环境，变量为：process.env.NODE_ENV 返回结果为"development" or "production"(双引号不可省略)
        // 也可以自定义一些全局环境变量
        new webpack.DefinePlugin({
            // 'process.env': {
            //     NODE_ENV: JSON.stringify(`${process.env.NODE_ENV}`),
            //     PUBLIC_PATH: JSON.stringify(`${argv.publicPath}`),
            //     PATH_PREFIX: JSON.stringify(`${argv.pathPrefix}`),
            //     RUN_ENV: JSON.stringify(`${process.env.RUN_ENV}`)
            // },
            'process.env': process.env.RUN_ENV === 'mock' ? require('../config/mock.env.js') : require('../config/dev.env.js')
        }),


        //////// ******单页面配置******
        new HtmlWebpackPlugin({
            title: 'vue-webpack-project',  // 设置页面title
            template: 'index.html', // 模板，相对根目录的路径，默认是：src/index.html，如果存在就打包这个模板，无则生成插件默认的html 
            filename:'index.html', // 指定打包出来文件名称
            inject:true, // 为true则自动注入js、css
            chunksSortMode: 'none', // 默认auto； 允许指定的thunk在插入到html文档前进行排序，none则不排序
            // favicon: 'static/images/icon.png',
        })
    ]
};