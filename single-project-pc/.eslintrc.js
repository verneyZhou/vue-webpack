module.exports = {
    root: true, // 限定使用范围，当你想对一个项目的不同部分的使用不同配置，或当你希望别人能够直接使用 ESLint
    parserOptions: { // 设置解析器选项
        parser: 'babel-eslint', // 指定解析器，babel-eslint将不能被常规linter解析的代码转换为能被常规解析的代码
        ecmaVersion: 7, // 默认设置为 3，5（默认）， 你可以使用 6、7、8、9 或 10 来指定你想要使用的 ECMAScript 版本。
        sourceType: 'module' // 设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)。
    },
    env: { // 指定代码运行的宿主环境
        browser: true, // 浏览器环境中的全局变量。
        node: true, //
        commonjs: true, // CommonJS 全局变量和 CommonJS 作用域 (用于 Browserify/WebPack 打包的只在浏览器中运行的代码)。
        es6: true // 启用除了 modules 以外的所有 ECMAScript 6 特性（该选项会自动设置 ecmaVersion 解析器选项为 6）。
    },
    extends: [ // 指定eslint规范,我们可以使用eslint官方推荐的，也可以使用一些大公司提供的的，如：aribnb, google, standard。
        'plugin:vue/essential', // 导入eslint-plugin-vue的规范
        'standard' // 引入standard规范
    ],

    // 引用第三方的插件
    // 在配置文件里配置插件时，可以使用 plugins 关键字来存放插件名字的列表。插件名称可以省略 eslint-plugin- 前缀
    plugins: [
        'vue'
    ],
    // 定义一些比较个性化的规则
    // 添加默认或第三库中没有的、覆盖默认或第三库的
    rules: {
        "indent": ["warn", 4, { "SwitchCase": 1 }], // 强制使用一致的缩进:warn警告； 4个空格缩进；强制 switch 语句中的 case 子句1个缩进
        
        // 强制使用一致的反勾号、双引号或单引号：error警告；要求尽可能地使用单引号；允许字符串使用反勾号``
        "quotes": ["error", "single", { "allowTemplateLiterals": true }],

        // 要求或禁止使用分号代替 ASI (semi)：warn警告； 要求在语句末尾使用分号（默认）
        "semi": ["warn", "always"],

        // 禁用debugger：生产环境error警告，开发环境保留
        "no-debugger": process.env.NODE_ENV === 'production' ? 'error' : 'off',

        // vue中自闭合标签：warn警告
        "vue/html-self-closing": ["warn", {
            "html": {
                "void": "any",
                "normal": "any",
                "component": "any"
            }
        }],

        // vue中script缩进：error警告；4个空格缩进；强制 switch 语句中的 case 子句1个缩进
        "vue/script-indent": ["error", 4, { "baseIndent": 0, "switchCase": 1}]
    }
}