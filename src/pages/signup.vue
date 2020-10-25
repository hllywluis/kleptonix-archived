<template>
  <div id="sign_up">
    <navbar :on-sign-up="true"></navbar>
    <h1 class="mt-auto pt-3 text-center" style="color: black; font-family: 'Bungee', cursive">Sign Up</h1>
    <h5 class="pt-3 pb-1 text-center">Create your new <span style="font-family: 'Bungee', cursive; color: black">KLEPTONIX</span>
      account.</h5>
    <div class="d-flex w-100 justify-content-center container mx-auto">
      <form class="justify-content-center pt-2 w-100 mx-auto">
        <div class="form-group col-md-8 mx-auto pt-3">
          <label for="user_name" style="font-family: 'Bungee', cursive; color: black">Username</label>
          <input aria-describedby="User Name" class="form-control" id="user_name" placeholder="hllywluis"
                 name="username" required type="text" v-model="username" v-on:keyup.enter="sign_up">
          <small class="form-text text-muted" id="name_policy">Enter your display name or username
            here.</small>
        </div>
        <div class="form-group col-md-8 mx-auto pt-3">
          <label for="user_email" style="font-family: 'Bungee', cursive; color: black">Email</label>
          <input aria-describedby="User Email" class="form-control" id="user_email"
                 placeholder="awesomeness@klepton.ix"
                 name="email" required type="email" v-model="email" v-on:keyup.enter="sign_up">
          <small class="form-text text-muted" id="email_policy">Enter a valid email address for your
            account.</small>
        </div>
        <div class="form-group col-md-8 pt-3 mx-auto">
          <label for="user_password" style="font-family: 'Bungee', cursive">Password</label>
          <input class="form-control" id="user_password" name="password" placeholder="Password"
                 required type="password" v-model="password" v-on:keyup.enter="sign_up">
          <small class="form-text text-muted" id="password_policy">Make sure it's secure. We salt for
            security.</small>
        </div>
        <div class="form-group col-md-8 pt-3 mx-auto">
          <label for="user_password_confirm" style="font-family: 'Bungee', cursive">Confirm Password</label>
          <input class="form-control" id="user_password_confirm" name="password_confirmation"
                 placeholder="Password again" type="password" v-model="password_confirmation"
                 required v-on:keyup.enter="sign_up">
          <small class="form-text text-muted" id="password_confirm">Enter your password again to confirm
            it.</small>
        </div>
        <button @click="sign_up" class="btn mx-auto col-md-12 pt-3 pb-3 pl-4"
                style="font-family: 'Bungee', cursive; color: black; text-align: center" type="button">
          <span v-if="!signing_up">Sign Up</span>
          <span class="spinner-border" role="status" v-if="signing_up"></span>
        </button>
      </form>
    </div>
    <h6 class="pt-1 pb-3 text-center">Already have an account? Awesome.
      <nuxt-link style="font-family: 'Bungee', cursive" to="/sign_in"><span style="color: black">SIGN IN</span>
      </nuxt-link>
    </h6>
  </div>
</template>

<script>
import navbar from '~/components/navbar';

export default {
  name: "sign_up",
  components: {navbar},
  head: {
    title: 'Kleptonix | Sign Up'
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      error: null,
      signing_up: false
    }
  },
  methods: {
    sign_up: function () {
      this.signing_up = true
      if (this.password !== this.password_confirmation) {
        alert("The passwords don't match.")
        this.signing_up = false
      } else if (this.username === '') {
        alert("Please enter a username for your account.")
        this.signing_up = false
      } else {
        this.$fireAuth.createUserWithEmailAndPassword(this.email, this.password).then(user => {
            const userdataRef = this.$fireStore.collection('userdata').doc(user.user.uid)
            user.user.updateProfile({displayName: this.username}).then(() => {
                this.$fireAuth.signInWithEmailAndPassword(this.email, this.password).then(() => {
                  userdataRef.set({
                    dname: this.username,
                    hidename: false,
                    subs: []
                  }).then(() => {
                    this.$router.replace({name: 'Feed'})
                  }).catch(err => {
                    this.signing_up = false
                    console.error(err.message)
                  })
                })
              }
            )
          }
        ).catch(err => {
            this.signing_up = false
            alert(err.message)
          }
        )
      }
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
