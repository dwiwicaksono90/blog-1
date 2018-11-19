<template>
    <div>
        <div class="card col-md-12 p-3">
    		<div class="row ">
    			<div class="col-md-3">
    				<img class="w-60" :src="article.img" style="height:150px; weight:150px;">
    			</div>
    			<div class="col-md-8">
    				<div class="card-block text-center">
                        <router-link  :user="user" :to="{ path: `/articles/${article._id}`}">
    					    <a href="#"><h5 class="card-title">{{article.title}}</h5></a> 
                        </router-link>					
                        <p class="card-text text-justify" style="font-size: 14px;" v-html="article.text.slice(0, 340)+'...'"></p>
                    </div>
    			</div>
    		</div>
    	</div>
        <br>

    </div>

</template>
<script>
    import axios from 'axios'
    export default {
        name: 'ListArticle',
        props: ['user', 'article'],
        data() {
            return {
               
            }
        },
        methods: {
            
        }
    }
</script>