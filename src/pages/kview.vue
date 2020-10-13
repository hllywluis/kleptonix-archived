<template>
  <div id="klepton-view">
    <navbar :klepton="klepton" :on-klepton="true"/>
    <h6 v-if="check_refresh" v-show="user.loggedIn" class="text-center text-muted" @click="unsubscribe">
      <a v-if="!mouseover" class="unsub-link text-muted" style="font-family: 'Bungee', cursive"
         @mouseenter="mouseover = !mouseover">
        Subscribed
      </a>
      <a v-if="mouseover" class="unsub-link" style="font-family: 'Bungee', cursive; color: red;"
         @mouseleave="mouseover = !mouseover">
        Unsubscribe?
      </a>
    </h6>
    <h6 v-else-if="!check_refresh" v-show="user.loggedIn" class="text-center" @click="subscribe">
      <a class="unsub-link text-muted" style="font-family: 'Bungee', cursive">
        Subscribe
      </a>
    </h6>
    <h1 class="text-center" style="font-family: 'Bungee', cursive; color: black">
      {{ klepton.title }}
    </h1>
    <h5 v-if="check_refresh" v-show="user.loggedIn && (!klepton.owner_only || user.data.uid === klepton.owner )"
        class="mt-auto kleptonix-logo text-muted text-center" style="font-family: 'Bungee', cursive">
      <nuxt-link v-if="klepton.stitle" :to="{name: 'NewPost', params: { klepton: klepton.stitle, p_klepton: klepton }}" style="color: #29d">
        New Post
      </nuxt-link>
    </h5>
    <div v-if="posts.length > 0" class="d-flex flex-column align-items-center mx-auto pt-2">
      <div v-for="(post, idx) of posts" :key="idx" class="container-fluid align-self-center">
        <div class="card my-auto col-lg-8 mx-auto w-100 align-items-center">
          <div class="card-body w-100 text-center mx-auto my-auto text-sm-left">
            <h6 v-if="post.created" class="col card-title w-100" style="font-family: 'Bungee', cursive; color: black">
              <nuxt-link :to="{name: 'Post', params: { klepton: klepton.stitle, post_id: post_ids[idx] }}"
                         style="color: black">
                {{ post.title }}
              </nuxt-link>
              <span class="text-muted float-sm-right row mx-auto justify-content-center">{{ post_authors[idx] }} &#183; {{
                  calculated_time(post.created.toDate()) + ' ago'
                }}</span>
            </h6>
            <hr/>
            <p class="col card-text" style="text-align: left !important;">{{ post.content }}</p>
          </div>
        </div>
        <div class="mb-3"></div>
      </div>
    </div>
    <h4 class="mx-auto text-center text-muted" style="font-family: 'Bungee', cursive; color: black"
        v-show="ready && posts.length === 0">
      No posts yet.</h4>
  </div>
</template>

<script>
import navbar from '~/components/navbar'

export default {
  name: 'KView',
  components: { navbar },
  computed: {
    user () {
      return this.$store.state.user.user
    },
    subs () {
      return this.$store.state.user.user_subscriptions
    }
  },
  props: {
    user_subbed: Boolean
  },
  watch: {
    '$route' (to, from) {
      if (from.path !== '/kleptons' || from.path !== '/') {
        this.posts = []
        this.post_ids = []
        this.owner = []
        this.ready = false
        this.owner_ready = false
        this.update_view()
      }
    }
  },
  data () {
    return {
      klepton: [],
      posts: [],
      post_ids: [],
      post_authors: [],
      ready: false,
      mouseover: false,
      check_refresh: this.user_subbed,
      kleptonID: String,
      owner: String,
      owner_ready: false
    }
  },
  methods: {
    subscribe: function () {
      if (this.user.loggedIn) {
        this.$fireStore.collection('userdata').doc(this.user.data.uid).update({
          subs: this.$fireStoreObj.FieldValue.arrayUnion(this.kleptonID)
        })
        this.$fireStore.collection('kleptons').doc(this.kleptonID.toString()).get().then((doc) => {
          let user_count = doc.get('user_count')
          this.$fireStore.collection('kleptons').doc(this.kleptonID.toString()).update({
            user_count: user_count + 1
          })
        })
        this.check_refresh = true
      }
    },
    unsubscribe: function () {
      if (this.user.loggedIn) {
        this.$fireStore.collection('userdata').doc(this.user.data.uid).update({
          subs: this.$fireStoreObj.FieldValue.arrayRemove(this.kleptonID)
        })
        this.$fireStore.collection('kleptons').doc(this.kleptonID.toString()).get().then((doc) => {
          let user_count = doc.get('user_count')
          this.$fireStore.collection('kleptons').doc(this.kleptonID.toString()).update({
            user_count: user_count - 1
          })
        })
        this.check_refresh = false
      }
    },
    calculated_time: function (date) {
      let seconds = Math.floor((new Date() - date) / 1000)
      let interval = Math.floor(seconds / 31536000)

      if (interval > 1) {
        return interval + ' yrs'
      }
      interval = Math.floor(seconds / 2592000)
      if (interval > 1) {
        return interval + ' mo'
      }
      interval = Math.floor(seconds / 86400)
      if (interval > 1) {
        return interval + ' days'
      }
      interval = Math.floor(seconds / 3600)
      if (interval > 1) {
        return interval + ' hrs'
      }
      interval = Math.floor(seconds / 60)
      if (interval > 1) {
        return interval + ' min'
      }
      return Math.floor(seconds) + ' s'
    },
    update_view: function () {
      const kleptref = this.$fireStore.collection('kleptref').doc(this.$route.params.klepton)
      kleptref.get().then((docSnapshot) => {
        docSnapshot.exists ? kleptref.onSnapshot((doc) => {
          this.$fireStore.collection('kleptons').doc(doc.get('kid')).get().then((doc) => {
            this.kleptonID = doc.id
            this.$fireStore.collection('userdata').doc(doc.get('owner')).get().then((doc) => {
              this.owner = doc.get('dname')
              this.owner_ready = true
            })
            if (this.user.loggedIn) {
              this.$fireStore.collection('userdata').doc(this.user.data.uid).get().then((doc) => {
                this.check_refresh = doc.get('subs').includes(this.kleptonID)
              })
            }
            this.klepton = doc.data()
            if (doc.get('posts')) {
              if (doc.get('posts').length > 0) {
                for (let post of doc.get('posts')) {
                  const postRef = this.$fireStore.collection('posts').doc(post)
                  postRef.onSnapshot((doc) => {
                    if (doc.exists) {
                      if (!this.post_ids.includes(doc.id)) {
                        this.post_authors.unshift(doc.get('author'))
                        this.post_ids.unshift(doc.id)
                        this.posts.unshift(doc.data())
                      } else {
                        this.posts.splice(this.post_ids.indexOf(doc.id), 1, doc.data())
                      }
                      this.ready = true
                    }
                  })
                }
              } else {
                this.ready = true
              }
            } else {
              this.ready = true
            }
          })
        }) : this.$router.replace({ name: 'Browse' })
      })
    }
  },
  firestore () {
    this.update_view()
  }
}
</script>

<style scoped>
.unsub-link {
  cursor: pointer;
}
</style>
