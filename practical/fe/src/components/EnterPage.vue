<template>
  <div>
    <p>Username</p>
    <input id="username"
           v-model="formFieldUsername"
           name="from-details">
    <p>Password</p>
    <input id="password"
           v-model="formFieldPassword"
           name="from-details">
    <br/>
    <br/>
    <button class="btn btn-primary" v-on:click="onSubmitButtonClicked">Enter</button>
  </div>

</template>

<script>
import {UserService} from "@/services/UserService";
import {useToast} from "vue-toastification";

export default {
  name: 'EnterPage',
  emits: ['authorized'],
  data() {
    return {
      toast: useToast(),
      formFieldUsername: "test",
      formFieldPassword: "test",
    }
  },
  props: {
    msg: String
  },
  methods: {
    onSubmitButtonClicked() {
      if (this.formFieldUsername.length && this.formFieldPassword.length) {
        UserService.createUser({username: this.formFieldUsername, password: this.formFieldPassword}).then(user => {
          this.$emit('authorized', user);
          this.toast.success("all ok login: " + user);
        }).catch(error => {
          this.toast.error("Error login: " + error);
        })
      } else {
        this.toast.warning("Username password not provided");
      }
    }
  }
}
</script>

<style scoped>

</style>
