'use strict';

const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清除打包目录
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'); // 命令行提示语优化
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 引入添加css指纹插件
const OptimizeCSSAssetsPlugins = require('optimize-css-assets-webpack-plugin') // 引入css压缩插件
const webpack = require('webpack');
const argv = require('yargs').argv; // node工具：获取命令行参数


console.log('=====process.env',process.env);

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

const prodConfig = {
    //// *******单页面配置******
    entry: {
        main: './src/index.js', // 入口文件
        // vendors: ['vue', 'vue-router'] // 分离第三方库  开发环境可通过splitChunks进行分离
    },
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
    mode: 'production', // 环境
    module: {
        // noParse: [/special-library\.js$/], // 不解析这里的模块
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
                // 'vue-style-loader',
                MiniCssExtractPlugin.loader, 
                // 该插件不能与style-loader一起使用，因前者是把样式提取出来，而后者是把样式插入到header里面，功能互斥
                'css-loader'
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
                        // 打包后，会生成dist/static/fonts/[name]...字体文件，
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
                        // 打包后，会生成dist/static/medias/[name]...字体文件，
                    }
                }
            },
        ]
    },
    plugins: [
        // 请确保引入这个插件!!!
        new VueLoaderPlugin(),

        new CleanWebpackPlugin(), // 清理目录
        new FriendlyErrorsWebpackPlugin(), // 命令行提示优化

        new MiniCssExtractPlugin({ // css包分离，添加css指纹插件 [contenthash]
            // filename:'static/css/[name]_[contenthash:8].css',
            filename:'[name]_[contenthash:8].css',
            // chunkFilename:'[name]_[contenthash:8].css'
        }),
        new OptimizeCSSAssetsPlugins({ // css压缩
            assetNameRegExp:/\.css$/g, // 用于匹配需要优化或者压缩的资源名
            cssProcessor:require('cssnano') // 依赖cssnano css处理器
        }),

        new webpack.DefinePlugin({ // 自定义全局变量
            'process.env': {
                // NODE_ENV: JSON.stringify(`${process.env.NODE_ENV}`),
                // PUBLIC_PATH: JSON.stringify(`${argv.publicPath}`),
                // PATH_PREFIX: JSON.stringify(`${argv.pathPrefix}`),
                // RUN_ENV: JSON.stringify(`${process.env.RUN_ENV}`)
            },
        }),

        //////// 打包后会生成dist/index.html   *******单页面配置******
        new HtmlWebpackPlugin({
            title: 'vue-webpack-project',  // 设置页面title
            template: 'index.html', // 模板，相对根目录的路径，默认是：src/index.html，如果存在就打包这个模板，无则生成插件默认的html 
            filename:'index.html', // 指定打包出来文件名称
            inject:true, // 为true则自动注入js、css
            chunksSortMode: 'auto', // 默认auto； 允许指定的thunk在插入到html文档前进行排序，none则不排序
            // favicon: 'static/images/icon.png',
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
                    minChunks: 2 // 只要引用次数达2次，即分离出来进行打包
                }
            }
        }
    },
};

//////引入打包体积分析
if (process.env.npm_config_report) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    prodConfig.plugins.push(new BundleAnalyzerPlugin())
}
////////

module.exports = prodConfig