<template>
    <div class="container my-5">
        <h3 class="text-center">Artikel Terbaru</h3>
        <div class="card-deck">
            <div class="card" v-for="article in newArticles">
                <router-link :to="{ path: `/articles/${article._id}`}">
                    <img class="card-img-top" :src="article.img" alt="Card image cap" style="height:100px; wide:200px;">
                    <div class="card-body">
                        <h5 class="card-title" style="font-size: 16px;">{{article.title}}</h5>
                        <!-- <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p> -->
                    </div>
                </router-link>
                <p class="card-text" v-html="article.text.slice(0,100)" style="font-size:12px; padding:0 10px"></p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'newerarticles',
        props: ['newArticles']
    }
</script>

<style>

</style>