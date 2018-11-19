<template>
    <div id="carouselExampleControls" class="carousel slide text-center" data-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <router-link :to="{ path: `/articles/${article1._id}`}">
            <img class="d-block w-100" :src="article1.img">
            <div class="carousel-caption d-none d-md-block" style="background-color: rgba(47,79,79, 0.8)">
              <h5 v-html="article1.title" style="font-size:25px"></h5>
              <!-- <p>by. {{article1.author.name}}</p> -->
            </div>
          </router-link>
        </div>

        <div class="carousel-item" v-for="article in articles.slice(1)">
          <router-link :to="{ path: `/articles/${article._id}`}">
            <img class="d-block w-100" :src="article.img">
            <div class="carousel-caption d-none d-md-block text-center" style="background-color: rgba(47,79,79, 0.8)">
              <h5 v-html="article.title" style="font-size:25px"></h5>
              <!-- <p>by. {{article.author.name}}</p> -->
            </div>
          </router-link>
        </div>

      </div>
      <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
</template>

<script>
  import axios from 'axios'


export default {
    name: 'PopularArticles',
    props: [],
    created() {
      this.getPopularArticles()
      $('.carousel').carousel({
        interval: 2000
      })
    },
    data(){
      return{
        server: `https://blog-server.ndiw.online`,
        article1: {},
        articles: []
      }
    },
    methods: {
      getPopularArticles(){
         axios({
          method: 'GET',
          url: `${this.server}/articles/popular`
        })
        .then((result) => {          
          this.article1 = result.data[0]
          this.articles = result.data.slice(1)          
        }).catch((err) => {
          console.log(err);
        });
      }
    }
}
</script>

<style>
  img {
    max-height: 600px;
  }

</style>
