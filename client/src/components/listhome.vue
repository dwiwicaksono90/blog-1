<template>
    <div id="list" class="col-md-6 mx-auto">
        <div class="card" style="width: 34rem;">
          <img id="listhome" class="card-img-top mx-auto" :src=article.img alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title">{{article.title}}</h5>
            <p class="card-text">{{article.text.slice(0,150)}}...</p>
            <router-link :to="{ path: `/articles/${article._id}`}">
              <div class="btn btn-dark">Baca Artikel</div>
            </router-link>
          </div>
        </div>
      </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'listhome',
    props: ['article', 'user']
}
</script>

<style>
  #list {
    padding: 10px;
    max-height: 700px;
  }

  #listhome {
    height: 400px;
    width: 500px;
  }
</style>
