
'use strict'; // 严格模式


// 基础配置
/**
 * entry入口配置
 * resolve配置
 * eslint-loader：代码规范配置
 * babel-loader：解析js，解析es6
 * vue-loader：解析vue
 * url-loader：图片、字体、音频等静态资源
 * 自定义全局变量
 * 多页面打包、html生成
 * 命令行提示语优化
 */

const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'); // 命令行提示语优化
const webpack = require('webpack');
const argv = require('yargs').argv;

const {setMPA} = require('./utils');


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
    //// *******单页面配置******
    // entry: {
    //     main: './src/index.js', // 入口文件
    //     // vendors: ['vue', 'vue-router'] // 分离第三方库  开发环境可通过splitChunks进行分离
    // },
    ////// ******多页面配置****
    entry: setMPA().entry,


    // /////配置模板解析resolve
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
        new FriendlyErrorsWebpackPlugin(), // 命令行提示优化
        new webpack.NoEmitOnErrorsPlugin(), // 帮助减少不需要的信息展示

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


         //////// 打包后会生成dist/index.html   *******单页面配置******
        // new HtmlWebpackPlugin({
        //     title: 'vue-webpack-project',  // 设置页面title
        //     template: 'index.html', // 模板，相对根目录的路径，默认是：src/index.html，如果存在就打包这个模板，无则生成插件默认的html 
        //     filename:'index.html', // 指定打包出来文件名称
        //     inject:true, // 为true则自动注入js、css
        //     chunksSortMode: 'auto', // 默认auto； 允许指定的thunk在插入到html文档前进行排序，none则不排序
        // })


        //////// *******多页面配置*******
    ].concat(setMPA().HtmlWebpackPlugins) // glob动态引入HtmlWebpackPlugins, // glob动态引入HtmlWebpackPlugins,
};