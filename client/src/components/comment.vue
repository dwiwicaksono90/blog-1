<template>
    <div class="comments col-md-12" id="comments">
            <div class="small text-right">{{coment.updatedAt.slice(0, 10)}}</div>
        <div class="comment mb-2 row" >
            <div class="comment-avatar col-md-1 col-sm-2 text-center pr-1">
                <h6 >{{coment.user.name}}</h6>
                <a><img class="mx-auto rounded-circle img-fluid" src="http://www.fao.org/fileadmin/templates/experts-feed-safety/images/profile-img03.jpg" alt="avatar"></a>
            </div>
            <div class="comment-content col-md-11 col-sm-10">
                <div class="comment-body">
                    <br>
                    <p v-html="coment.comment">
            
                    </p>
                </div>
                
                <div class="text-right" v-if="user && coment.user._id === user._id">
                    <i type="button" class="fas fa-trash text-right" @click="deleteComment"></i>
                </div>
                    
            </div> 
        </div>
        <hr>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'comment',
    props: ['coment', 'user', 'articleId'],
    data(){
        return{
            server: `http://localhost:3000`
        }
    },
    methods: {
        deleteComment(){
            axios({
                method: 'DELETE',
                url: `${this.server}/comments`,
                headers: {
                    token: localStorage.getItem('blogToken')
                },
                data: {
                    idComent: this.coment._id,
                    idArticle: this.articleId
                }
            })
            .then((result) => {
                console.log('Komen telah di hapus');
                this.$emit('get-article')
            }).catch((err) => {
                console.log(err.response);
            });
        }
    }
}
</script>

<style>

</style>
