
'use strict'
const path = require('path');
const glob = require('glob'); // 引入glob
// glob是webpack安装时依赖的一个第三方模块，还模块允许你使用 *等符号, 例如lib/*.js就是获取lib文件夹下的所有js后缀名的文件
const HtmlWebpackPlugin = require('html-webpack-plugin');


// 设置多页面动态匹配方法
exports.setMPA = function() {
    const entry = {}
    const HtmlWebpackPlugins = []
    const entryFiles = glob.sync(path.join(__dirname,'../src/pages/*/index.js'))
    // 项目目录下面匹配src下面的所有的内容下面的index.js
     
    console.log('=======entryFiles',entryFiles)
    /**
    =======entryFiles [ '/Users/admin/my-code/self/byme/vue-webpack/vue-project-h5/src/pages/account/index.js',
  '/Users/admin/my-code/self/byme/vue-webpack/vue-project-h5/src/pages/homepage/index.js',
  '/Users/admin/my-code/self/byme/vue-webpack/vue-project-h5/src/pages/test/index.js' ]
     */

    Object.keys(entryFiles).map((v,i) => {
        const cur = entryFiles[v]
        const match = cur.match(/src\/pages\/(.*)\/index\.js/) // src开头，末尾是index.js
        console.log('==========match',match);
        /**
         * 例：
         *==========match [ 'src/pages/account/index.js',
        'account',
        index: 58,
        input: '/Users/admin/my-code/self/byme/vue-webpack/vue-project-h5/src/pages/account/index.js' ]
         */

        const pathName = match && match[1]

        entry[pathName] = cur
        HtmlWebpackPlugins.push(
            new HtmlWebpackPlugin({ // 通常一个页面对应一个HtmlWebpackPlugin
                template:path.join(__dirname,`../src/pages/${pathName}/index.html`),
                // 本地模板文件的位置
                filename:`${pathName}.html`,
                // 指定打包出来文件名称,配置的html文件目录是相对于webpackConfig.output.path路径而言的，不是相对于当前项目目录结构的。
                chunks:['vendors','commons',pathName],
                // 指定生成的html使用哪些chunk；不配置此项默认会将entry中所有的thunk注入到模板中。
                inject:true,
                // 为true则自动注入js、css；
                // true或者body：所有JavaScript资源插入到body元素的底部
                // head: 所有JavaScript资源插入到head元素中
                chunksSortMode: 'auto',
                // 默认auto； 允许指定的thunk在插入到html文档前进行排序，none则不排序
                minify:{ // 传递 html-minifier 选项给 minify 输出，false（默认值）就是不使用html压缩
                    html5:true,
                    collapseWhitespace:true,
                    preserveLineBreaks:false,
                    minifyCSS:true,
                    minifyJS:true,
                    removeComments:false
                }
            })
        )

    })
    return {
        entry,
        HtmlWebpackPlugins
    }
}