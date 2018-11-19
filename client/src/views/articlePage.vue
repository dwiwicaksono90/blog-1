<template>
  <div>
    <div class="container">
      <nav class="navbar navbar-light bg-light">
        <div class="nav-item">
          <a href="#" class="btn" @click="showAllArticles">Semua Artikel</a>
        </div>
        <div class="nav-item">
          <a href="#" class="btn" v-if="user" @click="getMyArticles">Artikel Saya</a>
        </div>
        <div class="nav-item">
          <a href="#" class="btn" data-toggle="modal" data-target="#create-article" v-if="user">Tulis Artikel Baru</a>
        </div>
        <div class="nav-item">
          <a href="#" class="btn" v-if="!user">Login Untuk Menulis Artikel</a>
        </div>
        <div class="form-inline">
          <input class="form-control mr-sm-3" type="search" placeholder="Cari Artikel" aria-label="Search" @keyup.enter="search" v-model="inputSearch">
          <button class="btn btn-outline-dark my-0 my-sm-0"  @click="search">Cari</button>
        </div>
      </nav>
      <div class="row ">
        <div class="col-sm-12" style="min-height: 780px; ">
          <div v-if="$route.name == 'articles'">
            <list :user="user" v-for="(article,index) in articles" :key="index" :article="article"></list>
          </div>
          <router-view @set-user="setUser" :user="user" @get-all-articles="getAllArticles"></router-view>
        </div>
      </div>
    </div>

    <!-- modal create article -->
    <div id="create-article" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" style="padding: 5% 10%;">
          <!-- form  -->
          <div class="form-group">
            <div class="alert alert-warning" role="alert" v-if="notifFail">{{ notifFail }}</div>
            <label for="exampleInputEmail1">Title</label>
            <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Judul"
              v-model="inputTitle">
          </div>
          <div class="form-group">
            <label for="exampleInputEmail1">Category</label>
            <select class="form-control">
              <option value="tips">Tips</option>
              <option value="berita">Berita</option>
              <option value="ulasan">Ulasan</option>
              <option value="cafe&resto">Cafe & Resto</option>
              <option value="kegiatan">Kegiatan</option>
              <option value="lain">Lain - Lain</option>
            </select>
            <!-- <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Judul"
              v-model="inputCategory"> -->
          </div>
          <div class="form-group">
            <label for="exampleInputEmail1">Url Image</label>
            <input type="url" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="url img"
              v-model="inputImg">
          </div>
          <div class="form-group">
            <label for="exampleFormControlTextarea1">Text</label>
            <!-- <textarea class="form-control" id="exampleFormControlTextarea1" rows="25" v-model="inputText"></textarea> -->
            <vue-editor v-model="inputText"></vue-editor>
          </div>
          <button class="btn btn-dark" @click="addArticle">Submit</button>
          <!--  -->
        </div>
      </div>
    </div>
    <!-- akhir modal -->




  </div>
</template>

<script>
  import list from '@/components/ListArticles.vue'
  import axios from 'axios';
  import { VueEditor } from 'vue2-editor'

  export default {
    name: 'ArticlePage',
    props: ['user'],
    components: {
      list,
      VueEditor
    },
    data() {
      return {
        server: `https://blog-server.ndiw.online`,
        inputText: '',
        inputTitle: '',
        inputImg: '',
        inputSearch: '',
        articles: [],
        notifFail: ''
      }
    },
    created() {
      this.getAllArticles()
    },
    methods: {
      setUser(){
        this.$emit('set-user')
      },
      showAllArticles(){
        this.getAllArticles()
        this.$router.push({path: '/articles'})
      },
      getAllArticles() {
        axios({
            method: 'GET',
            url: `${this.server}/articles`
          })
          .then((result) => {
            this.articles = result.data
          }).catch((err) => {
            console.log(err);
          });
      },
      getMyArticles() {
        axios({
            method: 'GET',
            url: `${this.server}/articles/my`,
            headers: {
              token: localStorage.getItem('blogToken')
            }
          })
          .then((result) => {
            // console.log(result.data);
            this.articles = result.data
            this.$router.push({path: '/articles'})
          }).catch((err) => {
            console.log(err);
          });
      },
      search() {
        if(this.inputSearch === ''){
          this.showAllArticles()
        } else {
          axios({
            method: 'GET',
            url: `${this.server}/articles/search/${this.inputSearch}`
          })
          .then((result) => {
            this.articles = result.data.result
            this.$router.push({path: '/articles'})
          }).catch((err) => {
            console.log(err);
          });
        }
        
      },
      addArticle() {
        let token = localStorage.getItem('blogToken')
        axios({
            method: 'POST',
            url: `${this.server}/articles`,
            headers: {
              token: token
            },
            data: {
              title: this.inputTitle,
              text: this.inputText,
              img: this.inputImg
            }
          })
          .then((result) => {
            console.log(result);
            this.inputTitle = ''
            this.inputText = ''
            this.inputImg = ''
            this.notifFail = ''
            $('#create-article').modal('hide')
            this.$router.push({path: `/articles/${result.data.result._id}`})
            // this.getAllArticles()
          }).catch((err) => {
            console.log(err.response.data);
            
            this.notifFail = err.response.data.message
          });
      },
      
    }
  }
</script>