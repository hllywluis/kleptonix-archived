<template>
  <div id="feed">
    <navbar :on-feed="true"/>
    <div v-if="ready && (user.loggedIn && user_subs.length === 0)">
      <h1 class="mt-auto kleptonix-logo" style="font-family: 'Bungee', cursive; color: black; text-align: center">
        {{ user.data.displayName }}'s FEED
      </h1>
      <h4 v-show="ready" class="text-center text-muted" style="font-family: 'Bungee', cursive">
        No subscriptions. Yet.
      </h4>
    </div>
    <div v-else-if="!user.loggedIn" class="pb-2">
      <h1 class="mt-auto kleptonix-logo" style="font-family: 'Bungee', cursive; color: black; text-align: center">
        THE FEED
      </h1>
      <h6 class="mt-auto kleptonix-logo text-muted text-center" style="font-family: 'Bungee', cursive">
        Recent posts first
      </h6>
    </div>
    <div v-if="posts.length > 0" class="d-flex flex-column align-items-center mx-auto">
      <div v-for="(post, idx) of posts" :key="idx" class="container-fluid align-self-center">
        <div class="card my-auto col-lg-8 mx-auto w-100 align-items-center">
          <div class="card-body w-100 text-center mx-auto my-auto text-sm-left">
            <h6 class="col card-title w-100" style="font-family: 'Bungee', cursive; color: black">
              <nuxt-link v-if="kleptons.length > 0" :to="{name: 'Post', params: { klepton: kleptons[idx], post_id: post_ids[idx] }}"
                         style="color: black">
                {{ post.title }}
              </nuxt-link>
              <span class="text-muted float-sm-right row mx-auto justify-content-center d-none d-md-block"><nuxt-link
                  v-if="kleptons.length > 0" :to="{name: 'Klepton', params: { klepton: kleptons[idx], user_subbed: false }}" class="text-muted">
                {{ kleptons[idx] }} </nuxt-link> &#183; {{
                  post_authors[idx]
                }} &#183; {{ calculated_time(post.created.toDate()) + ' ago' }}</span>
              <span class="text-muted float-sm-right row mx-auto justify-content-center d-md-none d-sm-none"><nuxt-link
                  v-if="kleptons.length > 0" :to="{name: 'Klepton', params: { klepton: kleptons[idx], user_subbed: false }}"
                  class="pr-1 text-muted">
                {{ kleptons[idx] }}</nuxt-link> &#183; {{ post_authors[idx] }}</span>
              <span class="text-muted float-sm-right row mx-auto justify-content-center d-none d-sm-block d-md-none"><nuxt-link
                  v-if="kleptons.length > 0" :to="{name: 'Klepton', params: { klepton: kleptons[idx], user_subbed: false }}"
                  class="text-muted">
                {{ kleptons[idx] }}</nuxt-link> &#183; {{ post_authors[idx] }}</span>
              <span class="text-muted float-sm-right mx-auto justify-content-center d-md-none d-sm-none">{{
                  calculated_time(post.created.toDate()) + ' ago'
                }}</span>
            </h6>
            <hr>
            <p class="col card-text" style="text-align: left !important;">
              {{ post.content }}
            </p>
          </div>
        </div>
        <div class="mb-3"/>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar'

export default {
  name: 'feed',
  components: { navbar },
  data () {
    return {
      user_subs: [],
      user_sub_ids: [],
      posts: [],
      post_authors: [],
      kleptons: [],
      post_ids: [],
      ready: false
    }
  },
  computed: {
    user () {
      return this.$store.state.user.user
    },
    subs () {
      return this.$store.state.user.user_subscriptions
    }
  },
  methods: {
    calculated_time: (date) => {
      const seconds = Math.floor((new Date() - date) / 1000)
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
    }
  },
  firestore () {
    if (this.user.loggedIn) {
      const userdataRef = this.$fireStore.collection('userdata').doc(this.user.data.uid)
      userdataRef.get().then((docSnapshot) => {
        if (docSnapshot.exists) {
          if (!docSnapshot.get('dname')) {
            userdataRef.update({
              dname: this.user.data.displayName
            })
          }
          userdataRef.onSnapshot((doc) => {
            if (this.user_sub_ids.length > doc.get('subs').length) {
              for (const sub of this.user_sub_ids) {
                if (!doc.get('subs').includes(sub)) {
                  this.user_subs.splice(this.user_sub_ids.indexOf(sub))
                  this.user_sub_ids.splice(this.user_sub_ids.indexOf(sub))
                }
              }
            } else {
              for (const sub of doc.get('subs')) {
                const subRef = this.$fireStore.collection('kleptons').doc(sub)
                subRef.onSnapshot((doc) => {
                  if (!this.user_sub_ids.some(id => id === doc.id)) {
                    this.user_sub_ids.push(doc.id)
                    this.user_subs.push(doc.data())
                    const postRef = this.$fireStore.collection('posts').orderBy('created')
                    for (const post of doc.get('posts')) {
                      postRef.get().then((doc) => {
                        for (const individualPost of doc.docs) {
                          if (individualPost.id === post) {
                            this.kleptons.unshift(individualPost.get('klepton'))
                            this.post_authors.unshift(individualPost.get('author'))
                            this.posts.unshift(individualPost.data())
                            this.post_ids.unshift(individualPost.id)
                            for (let i = this.posts.length - 1; i > 0; i--) {
                              if (individualPost.get('created') < this.posts[i].created) {
                                const tmp = this.posts[i]
                                const tmpKlepton = this.kleptons[i]
                                const tmpAuthor = this.post_authors[i]
                                const tmpID = this.post_ids[i]
                                this.posts.splice(i, 1, individualPost.data())
                                this.kleptons.splice(i, 1, individualPost.get('klepton'))
                                this.post_authors.splice(i, 1, individualPost.get('author'))
                                this.post_ids.splice(i, 1, individualPost.id)
                                this.posts.splice(i, 0, tmp)
                                this.kleptons.splice(i, 0, tmpKlepton)
                                this.post_authors.splice(i, 0, tmpAuthor)
                                this.post_ids.splice(i, 0, tmpID)
                                this.posts.shift()
                                this.kleptons.shift()
                                this.post_authors.shift()
                                this.post_ids.shift()
                                break
                              }
                            }
                          }
                        }
                      })
                    }
                  }
                })
              }
            }
            this.$store.dispatch('set_user_subs', JSON.parse(JSON.stringify(this.user_sub_ids)))
            this.ready = true
          })
        } else {
          userdataRef.set({
            dname: this.user.data.displayName,
            hidename: false,
            subs: []
          }).then(() => {
            this.ready = true
          })
        }
      })
    } else {
      const postData = this.$fireStore.collection('posts').orderBy('created', 'desc')
      postData.get().then((doc) => {
        for (const post of doc.docs) {
          this.kleptons.push(post.get('klepton'))
          this.post_authors.push(post.get('author'))
          this.post_ids.push(post.id)
        }
      })
      return {
        posts: postData
      }
    }
  }
}
</script>

<style scoped>

</style>
