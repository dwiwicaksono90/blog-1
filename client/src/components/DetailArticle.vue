<template>
<div>
    <div class="container">
            <div class="float-md-right small text-muted">{{time.slice(0, 10)}}</div>
            <h2>{{title}}</h2>
            <div>
                <p>by. {{author}}</p>
                <div class="btn btn-danger" v-if="user && user._id !== authorId && !statusSubscribe" @click="subscribe(authorId)" >Subscribe {{author}}</div>
                <div class="btn btn-danger" v-if="user && user._id !== authorId && statusSubscribe" @click="unSubscribe(authorId)" >UnSubscribe {{author}}</div>
            </div>
            <div>
                share:
            <h5>
                <a class="twitter-share-button fab fa-twitter fa-stack-1x" :href="`https://twitter.com/intent/tweet?text=${title} http:localhost:3000/articles/` + articleId  "  data-size="large"></a>
            </h5> <br>
            </div>
            
            <img :src="img">
            <br><br>
        <p v-html="text" style="padding:10px 40px; font-family: Helvetica Neue,Helvetica,Roboto,Arial,sans-serif"></p>
        
        <iframe v-for="video in videos" id="ytplayer" type="text/html" width="640" height="360"
            :src="`https://www.youtube.com/embed/${video.id.videoId}?autoplay=1&origin=http://example.com`"
            frameborder="0">
        </iframe>
        
        <!-- button edit/delete -->
        <div v-if="user && authorId === user._id">
            <button class="btn btn-dark" data-toggle="modal" data-target="#modal-edit" @click="getArticle(articleId)">Edit</button>  
            <button class="btn btn-dark" @click="deleteArticle" style="margin-left: 10px;">Hapus</button>

            <!-- modal Edit article -->
            <div id="modal-edit" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content" style="padding: 5% 10%;">
                        <!-- form  -->
                        <div class="form-group">
                            <label for="exampleInputEmail1">Title</label>
                            <input type="text" class="form-control" id="exampleInputEmsacasail1" aria-describedby="emailHelp"
                                placeholder="Judul" v-model="editTitle">
                        </div>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Url Image</label>
                            <input type="url" class="form-control" id="exampleInputEm" aria-describedby="emailHelp" placeholder="Url img" v-model="editImg">
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1">Text</label>
                            <vue-editor v-model="editText"></vue-editor>
                            <!-- <textarea class="form-control" id="exampleFormControlsacTextarea1" rows="20" v-model="editText"></textarea> -->
                        </div>
                        <button class="btn btn-dark" data-dismiss="modal" @click="editArticle">Submit</button>
                        <!--  -->
                    </div>
                </div>
            </div>
            <!-- akhir modal -->
        </div>
        <div class="row">
            <add-comment v-if="user" :user="user" :articleId="articleId" @get-article="getArticle(articleId)"></add-comment>
            <comment :user="user" v-for="(comment, index) in comments" :key="index" :coment="comment" :articleId="articleId" @get-article="getArticle(articleId)" ></comment>
        </div>

    </div>
    

</div>
</template>
<script>
    import axios from 'axios'
    import comment from '@/components/comment.vue'
    import addComment from '@/components/addcomment.vue'
    import { VueEditor } from 'vue2-editor'

    export default {
        name: 'detailArticle' ,
        props: ['user'],
        components: {
            comment,
            addComment,
            VueEditor
        },
        data(){
            return {
                server: `http://localhost:3000`,
                title: '',
                author: '',
                text: '',
                img: '',
                time: '',
                articleId: '',
                authorId: '',
                editTitle: '',
                editText: '',
                editImg: '',
                comments: '',
                statusSubscribe: '',
                videos: []
            }
        },
        methods: {
            getArticle(id){                                                
                axios({
                    method: 'GET',
                    url: `${this.server}/articles/${id}`,
                    headers: {
                        token : localStorage.getItem('blogToken')
                    }
                })
                .then((result) => {
                    console.log(result.data);
                    this.articleId = result.data._id
                    this.text = result.data.text
                    this.title = result.data.title
                    this.author = result.data.author.name
                    this.authorId = result.data.author._id
                    this.img = result.data.img
                    this.time = result.data.createdAt
                    this.editText = result.data.text
                    this.editTitle = result.data.title
                    this.editImg = result.data.img
                    this.comments = result.data.comments
                    this.getVideos()
                    this.getStatusSubsc()
                }).catch((err) => {
                    console.log(err);
                });
            },
            getVideos(){
                axios({
                    method: 'GET',
                    url: `https://www.googleapis.com/youtube/v3/search?key=AIzaSyAKZh5ILDv4kmQdx1krX2-KoPHeotsLS2k&maxResults=3&part=snippet&order=relevance&type=video&q=${this.title}`
                })
                .then((result) => {
                    console.log(result);
                    this.videos = result.data.items
                }).catch((err) => {
                    console.log(err);
                });
            },
            editArticle(){ 
                axios({
                    method: 'PUT',
                    url: `${this.server}/articles/${this.articleId}`,
                    headers: {
                        token : localStorage.getItem('blogToken')
                    },
                    data: {
                        title: this.editTitle,
                        text: this.editText,
                        img: this.editImg
                    }
                })
                .then((result) => {     
                    this.getArticle(this.articleId)
                    this.$emit('get-all-articles')
                }).catch((err) => {
                   console.log(err);
                });
            },
            deleteArticle(){
                axios({
                    method: 'DELETE',
                    url: `${this.server}/articles/${this.articleId}`,
                    headers: {
                        token : localStorage.getItem('blogToken')
                    }
                })
                .then((result) => {
                    console.log('hapus sukses', result);
                    this.$emit('get-all-articles')
                    this.$router.push({path: '/articles'})
                }).catch((err) => {
                   console.log(err);
                });
            },
            subscribe(idAuthor){ 
                axios({
                    method: 'POST',
                    url: `${this.$server}/users/subscribe`,
                    headers: {
                        token: localStorage.getItem('blogToken')
                    },
                    data: {
                        idAuthor: idAuthor
                    }
                })
                .then((result) => {
                    this.$emit('set-user')
                    console.log(result.data.msg);
                    this.statusSubscribe = true
                }).catch((err) => {
                    console.log(err);
                });
            },
            unSubscribe(idAuthor){   
                console.log('masuk uns');
                 
                axios({
                    method: 'POST',
                    url: `${this.$server}/users/unSubscribe`,
                    headers: {
                        token: localStorage.getItem('blogToken')
                    },
                    data: {
                        idAuthor: idAuthor
                    }
                })
                .then((result) => {
                    this.$emit('set-user')
                    console.log(result.data.msg);
                    this.statusSubscribe = false
                }).catch((err) => {
                    console.log(err);
                });
            },
            getStatusSubsc(){
                this.user.subscribe.forEach(data => {
                    if(data === this.authorId){
                        this.statusSubscribe = true
                    }
                });
            }
        },
        created() {            
            this.getArticle(this.$route.params.id)
        },
        computed: {
            getParamsId: function() {
                return this.$route.params.id
            }
        },
        watch:{
            getParamsId: function(val){
                this.getArticle(val)
            }
        }
    }
</script>
<style>
    img{
        max-width: 80%;
    }
</style>
