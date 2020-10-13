<template>
  <div id="sign_in">
    <navbar :on-sign-in="true"></navbar>
    <h1 class="mt-auto pt-3 text-center" style="color: black; font-family: 'Bungee', cursive">Sign In</h1>
    <h5 class="pt-3 pb-1 text-center">Sign in with your <span style="font-family: 'Bungee', cursive; color: black">KLEPTONIX</span>
      account.
    </h5>
    <div class="d-flex w-100 justify-content-center container mx-auto">
      <form class="justify-content-center pt-2 w-100 mx-auto">
        <div class="form-group col-md-8 mx-auto pt-3">
          <label for="user_email" style="font-family: 'Bungee', cursive; color: black">Email</label>
          <input aria-describedby="User Email" class="form-control" id="user_email"
                 placeholder="awesomesauce@klepton.ix"
                 name="email" required type="email" v-model="email" v-on:keyup.enter="login">
          <small class="form-text text-muted" id="email_policy">Enter the email address for your
            account.</small>
        </div>
        <div class="form-group col-md-8 pt-3 mx-auto">
          <label for="user_password" style="font-family: 'Bungee', cursive">Password</label>
          <input class="form-control" id="user_password" name="password" placeholder="Password"
                 required type="password" v-model="password" v-on:keyup.enter="login">
          <small class="form-text text-muted" id="password_policy">If you forgot your password, click
            here.</small>
        </div>
        <button @click="login" class="btn mx-auto col-md-12 pt-3 pb-3 pl-4"
                style="font-family: 'Bungee', cursive; color: black" type="button">
          <span v-if="!logging_in">Sign In</span>
          <span class="spinner-border" role="status" v-if="logging_in"></span>
        </button>
      </form>
    </div>
    <h6 class="pt-1 pb-3 text-center">Don't have an account?
      <nuxt-link style="font-family: 'Bungee', cursive; color: black" to="/sign_up">Sign Up</nuxt-link>
    </h6>
  </div>
</template>

<script>
import navbar from '@/components/navbar';

export default {
  name: "sign_in",
  components: {navbar},
  data() {
    return {
      email: '',
      password: '',
      logging_in: false
    }
  },
  methods: {
    login: function () {
      this.logging_in = true
      this.$fireAuth.signInWithEmailAndPassword(this.email, this.password).then(() => {
          this.logging_in = false
          this.$router.replace({name: 'Feed'})
        }
      ).catch(err => {
        this.logging_in = false
        alert(err.message)
      })
    }
  }
}
</script>

<style scoped>
button,
button:focus,
button:active {
  border-color: rgba(0, 0, 0, 0) !important;
  outline: 0;
  box-shadow: none;
}

.form-control:focus {
  border-color: lawngreen;
  box-shadow: 0 0 8px lawngreen;
}
</style>
