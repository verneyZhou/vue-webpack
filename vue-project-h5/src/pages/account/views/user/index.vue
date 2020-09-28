<template>
<div class=''>
    <div>我的名字叫：<span>{{userName}}</span></div>
</div>
</template>

<script>
import addFn from '@/utils/addFn';
import {_login} from '@/services/account';
export default {
components: {},
data() {
return {
    userName: this.$store.state.userName
};
},
computed: {},
watch: {},
//方法集合
methods: {

},
created() {
    console.log('======',addFn(11,444));
     _login({name: '拾叁',pwd: '123456'}).then(res => {

    }).catch(error => {

    })
},
mounted() {

},
}
</script>
<style lang='less' scoped>

</style>