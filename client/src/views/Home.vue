<template>
  <div class="container">
    <popular-articles></popular-articles>
    <newerarticles :newArticles="newArticles"></newerarticles>
  </div>
</template>

<script>
  import listhome from '@/components/listhome.vue'
  import newerarticles from '@/components/newerarticles.vue'
  import PopularArticles from '@/components/PopularArticles.vue'
  import axios from 'axios'

  export default {
    name: 'Home',
    props: ['user'],
    components: {
      listhome,
      newerarticles,
      PopularArticles
    },
    created() {
      this.getNewArticles()
    },
    data() {
      return {
        server: `http://localhost:3000`,
        newArticles: [],
        popularArticles: []
      }
    },
    methods: {
      getNewArticles() {
        axios({
          method: 'GET',
          url: `${this.server}/articles`
        })
        .then((result) => {
          this.newArticles = result.data.slice(0, 4)
        }).catch((err) => {
          console.log(err);
        });
      },
      
    }
  }
</script>

<style>
  
</style>