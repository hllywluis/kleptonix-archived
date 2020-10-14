<template>
  <div id="post">
    <navbar :on-post="true" :post_klepton="this.$route.params.klepton" :post_title="post.title"></navbar>
    <div v-if="post.created" class="d-flex container-fluid flex-column mx-auto pt-1" id="post-content">
      <div class="card align-self-center col-md-8">
        <div class="card-body">
          <h3 class="col card-title my-auto text-center text-md-left" style="font-family: 'Bungee', cursive">
            {{
              post.title
            }}</h3>
          <hr/>
          <p class="card-text pl-3">{{ post.content }}</p>
          <hr/>
          <h6 class="card-text text-muted text-center" style="font-family: 'Bungee', cursive">{{
              post.author
            }} &#183; {{
              calculated_time(post.created.toDate()) + ' ago'
            }}</h6>
        </div>
      </div>
    </div>
    <h5 class="pt-4 text-center" style="font-family: 'Bungee', cursive">Comments</h5>
    <h6 class="text-center text-muted" style="font-family: 'Bungee', cursive">No comments yet.</h6>
  </div>
</template>

<script>
import navbar from '~/components/navbar'

export default {
  name: 'post_view',
  components: { navbar },
  data () {
    return {
      post: [],
      og_klepton: []
    }
  },
  head() {
    return {
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `See "${this.post.title}" on Kleptonix, the only place where communities shine together.`
        }
      ]
    }
  },
  methods: {
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
    }
  },
  firestore () {
    this.$fireStore.collection('posts').doc(this.$route.params.post_id).get().then((doc) => {
      this.post = doc.data()
    })
  }
}
</script>

<style scoped>

</style>
