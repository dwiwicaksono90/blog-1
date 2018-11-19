<template>
    <div class="card container" style="max-width: 60rem; height: 500px; margin-buttom:20px;">
        <div class="card-header">chat</div>
        <div class="card-body text-primary">

            <p class="text-right" v-for="(chat, index) in listChat" :key="index"><span class="font-weight-bold">{{ chat.name }}:</span> {{ chat.chat }}</p>

        </div>
        <div>
            <input v-model="inputChat" v-bind="{readOnly: !user}" @keyup.enter="sendChat" class="form-control mr-sm-2" type="search" placeholder="type chat and enter here" aria-label="Search">
            <!-- <button class="btn btn-outline-success my-2 my-sm-0" @keyup.enter="sendChat">Chat</button> -->
        </div>
    </div>
</template>

<script>
    import db from "@/assets/config.js"
    export default {
        name: 'chat',
        props: ['user'],
        data () {
            return {
                listChat: [],
                listRemove: [],
                inputChat: ''
            }
        },
        created() {
            this.getChatData()
        },
        methods: {
            sendChat(){
                db.ref('chatglobal/').push({
                    chat: this.inputChat,
                    name: this.user.name
                });
                this.inputChat = ''
                this.getChatData()
            },
            getChatData(){
                var starCountRef = db.ref('chatglobal/' );
                starCountRef.on('value', snapshot =>  {
                    // console.log(snapshot.val());
                    if(snapshot.val()){
                        this.listChat = Object.values(snapshot.val())
                        .reverse()
                        .slice(0, 9)
                        .reverse()
                        // console.log(this.listChat);
                        this.listRemove = Object.keys(snapshot.val())
                        .reverse()
                        .slice(9)
                        // console.log('list remove' ,this.listRemove);
    
                        this.deleteChat()
                    }
                });
            },
            deleteChat(){
                this.listRemove.forEach(list => {
                    db.ref(`chatglobal/${list}`).remove();
                });
                this.listRemove = ''
            }
        }
    } 
</script>

<style>

</style>