<template>
  <div id="app" class="container">
    <div id="nav">
      <navbar :user="user" :setUser="setUser"></navbar>
    </div>
    <div>
      <router-view :user='user' @set-user="setUser"></router-view>
    </div>
    <div >
      <!-- <chat :user="user"></chat> -->
      <chitchat :user="user"></chitchat>
      <footerx></footerx>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import navbar from '@/components/Navbar.vue'
import footerx from '@/components/footer.vue'
import chat from '@/components/chat.vue'
import chitchat from '@/components/chitchat.vue'

export default {
  data () {
    return {
      server: `http://localhost:3000`,
      user: null
    }
  },
  components: {
    navbar,
    footerx,
    chat,
    chitchat
  },
  methods: {
    setUser: function () {
      let token = localStorage.getItem('blogToken')
      if (token) {
        axios({
          method: 'GET',
          url: `${this.server}/users`,
          headers: {
            token: token
          }
        })
          .then((result) => {
            this.user = result.data
          })
          .catch((err) => {
            localStorage.removeItem('blogToken')
            this.user = null
            console.log(err.response)
          })
      } else {
        this.user = null
      }
    }
  },
  created () {
    this.setUser()
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
