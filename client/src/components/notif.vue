<template>
    <div>
        <div class="alert alert-warning notif" role="alert" v-if="allertMsg"> {{ allertMsg }} </div>
        <div class="alert alert-success notif" role="alert" v-if="successMsg"> {{ successMsg }} </div>
    </div>
    
</template>

<script>
export default {
    name: 'notif',
    data(){
        return{
            allertMsg: null,
            successMsg: null
        }
    },
    watch: {
        trigerNotif(){
            this.getNotif()
        }
    },
    methods: {
        getNotif(){
            if(type){
                this.successMsg = this.msg
                setTimeout(() => {
                    this.successMsg = null
                },1000)
            } else {
                 this.allertMsg = this.msg
                setTimeout(() => {
                    this.successMsg = null
                },1000)
            }
        }
    }
}
</script>

<style>
    .notif {
        position: fixed;
        top: 0;
        width: 100%;
        left: 0;
    }

</style>
