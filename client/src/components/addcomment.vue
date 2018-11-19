<template>
    <div class="container" >
        <hr>
        <h5 class="mb-2">Komentar</h5>
        <div class="form-group">
            <vue-editor v-model="text"></vue-editor>
            <!-- <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="text"></textarea> -->
            <button class="btn btn-sm btn-dark" @click="comment">comment</button>
        </div> <hr>
    </div>
</template>

<script>
import axios from 'axios'
import { VueEditor } from 'vue2-editor'

export default {
    name: 'addComment',
    components: {
        VueEditor
    },
    props: ['user', 'articleId'],
    data(){
        return {
            server: `http://localhost:3000`,
            text: ''
        }
    },
    methods: {
        comment(){            
            axios({
                method: 'POST',
                url: `${this.server}/comments`,
                headers: {
                    token: localStorage.getItem('blogToken')
                },
                data: {
                    comment: this.text,
                    articleId: this.articleId
                }
            })
            .then((result) => {
                this.text = ''
                console.log('comment sukses', result);                
                this.$emit('get-article')
            }).catch((err) => {
                console.log(err);
                
            });
            
        }
    }
}
</script>
<style>

</style>
