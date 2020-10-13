<template>
  <client-only>
    <nav class="navbar navbar-expand-md navbar-light bg-white p-2 mb-2 kleptonix-logo">
      <div class="container-fluid">
        <!-- Navbar Links -->
        <div class="collapse navbar-collapse w-100 order-1 order-md-0 dual-collapse2">
          <ul class="navbar-nav">
            <li v-show="onFeed" class="nav-item active text-center">
              <nuxt-link class="nav-link" to="/">
                Feed
              </nuxt-link>
            </li>
            <li v-show="!onFeed" class="nav-item text-center">
              <nuxt-link class="nav-link" to="/">
                Feed
              </nuxt-link>
            </li>
            <li v-show="onKleptons" class="nav-item active text-center">
              <nuxt-link class="nav-link" to="/kleptons">
                Browse
              </nuxt-link>
            </li>
            <li v-show="!onKleptons" class="nav-item text-center">
              <nuxt-link class="nav-link" to="/kleptons">
                Browse
              </nuxt-link>
            </li>
            <li v-show="onKlepton || onNewPost || onPost" class="nav-item active text-center">
              <nuxt-link :to="'/k/' + $route.params.klepton" class="nav-link">
                {{ this.$route.params.klepton }}
              </nuxt-link>
            </li>
          </ul>
          <ul v-if="user_subs.length > 0" class="navbar-nav mr-auto d-none d-lg-flex">
            <li v-for="(sub, idx) of user_subs.slice(0, 5)" :key="idx" class="nav-item text-center">
              <nuxt-link v-show="sub !== $route.params.klepton"
                         :to="{ name: 'Klepton', params: { klepton: sub, user_subbed: true } }" class="nav-link">
                {{ sub }}
              </nuxt-link>
            </li>
          </ul>
        </div>
        <div class="mx-auto justify-content-center order-0">
          <!-- Navbar Brand (Kleptonix Logo) -->
          <nuxt-link style="background: linear-gradient(141deg, lawngreen, #29d);
                -webkit-background-clip: text; -webkit-text-fill-color: transparent"
                     class="navbar-brand d-none d-md-block pl-3 kleptonix-logo" to="/">
            Kleptonix
          </nuxt-link>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2"
                  aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <a style="background: linear-gradient(141deg, lawngreen, #29d);
                -webkit-background-clip: text; -webkit-text-fill-color: transparent"
               class="navbar-brand pl-3 kleptonix-logo">
              Kleptonix
            </a>
          </button>
        </div>
        <div class="collapse navbar-collapse w-100 order-3 dual-collapse2">
          <ul class="navbar-nav ml-auto">
            <li v-if="!user.loggedIn" v-show="onSignIn || onSignUp" class="nav-item active text-center">
              <nuxt-link v-show="!onSignUp" class="nav-link" to="/sign_in">
                Sign In
              </nuxt-link>
              <nuxt-link v-show="onSignUp" class="nav-link" to="/sign_up">
                Sign Up
              </nuxt-link>
            </li>
            <li v-if="!user.loggedIn" v-show="!onSignIn && !onSignUp" class="nav-item text-center">
              <nuxt-link class="nav-link" to="/sign_in">
                Sign In
              </nuxt-link>
            </li>
            <li v-if="user.loggedIn" v-show="onProfile" class="nav-item active text-center">
              <nuxt-link class="nav-link" to="/profile">
                {{ user.data.displayName }}
              </nuxt-link>
            </li>
            <li v-if="user.loggedIn" v-show="!onProfile" class="nav-item text-center">
              <nuxt-link class="nav-link" to="/profile">
                {{ user.data.displayName }}
              </nuxt-link>
            </li>
            <li v-if="user.loggedIn" class="nav-item text-center">
              <a class="nav-link" style="cursor: pointer" @click="sign_out">Sign Out</a>
            </li>
          </ul>
        </div>
      </div>
      <vue-headful v-if="onFeed" title="Kleptonix | Feed"></vue-headful>
      <vue-headful title="Kleptonix | Browse" v-else-if="onKleptons"></vue-headful>
      <vue-headful v-else-if="onSignIn" title="Kleptonix | Sign In"></vue-headful>
      <vue-headful v-else-if="onSignUp" title="Kleptonix | Sign Up"></vue-headful>
      <vue-headful title="Kleptonix | Profile" v-else-if="onProfile"></vue-headful>
      <vue-headful :title="klepton.title" v-else-if="onKlepton"></vue-headful>
      <vue-headful :title="klepton.title + ' | ' + 'New Post'" v-if="onNewPost && ready"></vue-headful>
      <vue-headful :title="post_title + ' | ' + post_klepton.toUpperCase()" v-if="onPost"></vue-headful>
    </nav>
  </client-only>
</template>

<script>
export default {
  name: 'navbar',
  props: {
    onFeed: Boolean,
    onKleptons: Boolean,
    onSignIn: Boolean,
    onSignUp: Boolean,
    onProfile: Boolean,
    onKlepton: Boolean,
    onNewPost: Boolean,
    onPost: Boolean,
    ready: Boolean,
    klepton: [Array, Object],
    post_title: String,
    post_klepton: String
  },
  computed: {
    user () {
      return this.$store.state.user.user
    }
  },
  data () {
    return {
      user_subs: []
    }
  },
  firestore () {
    if (this.user.loggedIn) {
      this.$fireStore.collection('userdata').doc(this.user.data.uid).get().then((doc) => {
        for (const sub of doc.get('subs')) {
          this.$fireStore.collection('kleptons').doc(sub).get().then((doc) => {
            this.user_subs.unshift(doc.get('stitle'))
          })
        }
      })
    }
  },
  methods: {
    sign_out () {
      if (this.$fireAuth.currentUser) {
        this.$fireAuth.signOut().then(() => {
          localStorage.clear()
          this.$router.go(0)
        })
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bungee&display=swap');

.navbar-toggler,
.navbar-toggler:focus,
.navbar-toggler:active {
  border-color: rgba(0, 0, 0, 0) !important;
  outline: 0;
  box-shadow: none;
}

.kleptonix-logo {
  font-family: 'Bungee', cursive;
  user-select: none;
}
</style>
