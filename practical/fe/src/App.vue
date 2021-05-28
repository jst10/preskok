<template>
  <EnterPage v-if="!user" @authorized="onUserAuthorized"></EnterPage>
  <div v-if="user">
    User: {{ user }}
    <div class="container">
      <div class="row">
        <div class="col-4">
          <div class="row">
            <p class="col-12">Users</p>
            <span class="user-label" v-for="user in users" :key="user.id">
            {{ user.username }}
          </span>
          </div>
        </div>
        <div class="col-8">
          <div class="row">
            <div class="col-12 messages">
              <p class="message"
                 v-for="message in  this.receivedMessages" :key="message"
                 v-bind:class="{ 'my-message': message.user.id===user.id }"
              >

                {{ message.user.username }}: {{ message.payload }}
              </p>
            </div>
            <div class="col-12">
              <div class="row">
                <input class="col-10 " v-model="inputMessage"/>
                <button class="col-2" v-on:click="sendMessage">Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import EnterPage from "@/components/EnterPage";
import {UserService} from "@/services/UserService";

export default {
  name: 'App',
  data() {
    return {
      inputMessage: "",
      receivedMessages: [],
      user: null,
      users: []
    }
  },
  components: {
    EnterPage
  },
  methods: {
    sendMessage: function () {
      console.log(this.connection);
      this.connection.send(this.inputMessage);
      this.inputMessage = "";
    },
    onUserAuthorized(user) {
      this.user = user;
      this.loadUsers();
      this.connectToWs();
    },
    disconnected() {
      this.user = null;
    },
    connectToWs() {
      console.log("Starting connection to WebSocket Server")
      console.log(this.user)
      // const url = "ws://" + this.user.username + ":" + this.user.password + "@localhost:4000";
      const url = `ws://@localhost:4000?username=${this.user.username}&password=${this.user.password}`;
      console.log(url);
      this.connection = new WebSocket(url);
      this.connection.onmessage = (event) => {
        console.log("On message");
        const data = JSON.parse(event.data);
        this.receivedMessages.push(data);
        console.log(event.data);
      }
      this.connection.onerror = function (error) {
        console.log("on error");
        console.log(error);
      }
      this.connection.onopen = function (event) {
        console.log(event)
        console.log("Successfully connected to the echo websocket server...")
      }
    },
    loadUsers() {
      UserService.getUsers().then(users => {
        this.users = users;
      }).catch(error => {
        this.toast.error("Error getting users: " + error);
      })
    },
    loadHistory() {

    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.user-label {
  background: #ececec;
  margin: 2px;
  cursor: pointer;
}

.user-label:hover {
  background: #f1f1f1;
}

.messages {
  background: #e7e7e7;
  height: 400px;
  min-height: 400px;
}

.messages .message {
  margin: 2px;
  text-align: left;
}

.messages .message.my-message {
  text-align: right;
}
</style>
