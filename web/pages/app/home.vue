<template>
    <div id="home-app">
        <header class="navbar navbar-inverse navbar-fixed-top">
            <div class="container">
                <div class="navbar-header">
                    <a class="navbar-brand hidden-sm" target="_blank"
                       href="https://github.com/chachaxw/xlsx-koa">xlsx-koa</a>
                </div>
            </div>
        </header>
        <div class="container">
            <div class="text-center page-header">
                <h1 class="mall-app">xlsx-koa</h1>
                <p>vue koa 应用脚手架</p>
            </div>
        </div>
        <back-to-top></back-to-top>
    </div>
</template>
<script>
    import backToTop from '../../components/back-to-top';
    export default {
        data() {
            return {
                list: ''
            }
        },
        methods: {

        },
        mounted() {
            this.$http.post('/api/list').then(response => {
                console.log(response);
                this.list = response.data.list
            }, response => {
                console.log(response);
            });
        },
        components:{
            backToTop
        }
    }
</script>
<style lang="scss" scoped>
    .page-header {
        margin: 80px 0 20px;
    }

    .mall-app {
        font-size: 50px;
        height: 76px;
        line-height: 76px;
    }

    .lang {
        font-size: 30px;
    }
</style>
