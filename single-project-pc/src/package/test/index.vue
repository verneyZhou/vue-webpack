<template>
<div class='test'>
    <p>{{text}}</p>
    <div>
         <img :src="Icon" alt="" style="width:100px;height:100px;"/>
         <img :src="LittIcon" alt="" style="width:20px;height:20px;"/>
    </div>
    <hr>
    <div class="icon"></div>
    <hr>
    <div class="little-icon"></div>
    <p>sdfgsf第三方电饭gvfh锅电饭锅士大夫dfds</p>
    <button @click="onClick(1)">点击引入test.js</button>
    <button @click="onClick(2)">点击引入test2.js</button>
    <button @click="addClick">加法</button>
    <hr>
    themify字体：
    <p class="font-themify">一二三四五 12345 abcde ABCDE</p>
    intelOne字体：
    <p class="font-intelOne">一二三四五 1234523423423rrr333 abcde ABCDE</p>
</div>
</template>

<script>
import Icon from '@/assets/images/test/icon.png';
import LittIcon from '@/assets/images/test/5k.png';
import addFn from '@/utils/addFn.js';
export default {
    components: {},
    data () {
        return {
            text: 'hello vue+webapck',
            Icon,
            LittIcon
        };
    },
    computed: {},
    watch: {},
    created () {
        console.log('=======created');
        console.log('=======process.env', process.env);
    },
    mounted () {
        console.log('======mounted');
        this.clickFn();
    },
    methods: {
        clickFn () {
            [1, 2, 3].forEach(v => {
                console.log('======v', v);
            });
            const obj = Object.assign({ a: 1, b: 2 }, { a: 11, c: 3 });
            console.log('======obj', obj);
        },
        testFn () {
            return new Promise();
        },
        onClick (val) {
            if (val === 1) {
                const test = () => import(/* webpackChunkName: 'test-1' */ './test.js');
                test();
            } else {
                const test2 = () => import(/* webpackChunkName: 'test-2' */ './test2.js');
                test2();
            }
            
        },
        addClick() {
            let a = addFn(1,10);
            console.log('======a',a);
        }
    }
};
</script>
<style lang="less">
    @import '~@/styles/test/index.less';
    img {
        display: block;
        width: 100px;
        height: 100px;
    }
    .icon {
        width: 200px;
        height: 200px;
        border:1px solid #ff0;
        background: url('~@/assets/images/test/icon.png') no-repeat center;
        background-size: 100%;
        display: flex;
    }
    .little-icon {
        width: 20px;
        height: 20px;
        border:1px solid #f00;
        background: url('~@/assets/images/test/5k.png') no-repeat center;
        background-size: 100%;
    }
</style>
