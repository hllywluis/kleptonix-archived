<template>
  <div id="new_post">
    <navbar :klepton="posting_klepton" :on-new-post="true" :ready="ready"></navbar>
    <h4 class="mt-auto pt-3 text-center text-muted" style="color: black; font-family: 'Bungee', cursive"
        v-show="ready">Posting In</h4>
    <h1 class="mt-auto text-center" style="color: black; font-family: 'Bungee', cursive" v-show="ready">{{
        posting_klepton.title }}</h1>
    <h6 class="mt-auto text-center text-muted" style="font-family: 'Bungee', cursive" v-show="ready">Posting As: {{
        user.data.displayName }}</h6>
    <div class="d-flex flex-column w-100 justify-content-center mx-auto" v-if="ready">
      <form class="justify-content-center pt-2 w-100 mx-auto">
        <div class="form-group col-md-8 mx-auto pt-3">
          <label for="post_title" style="font-family: 'Bungee', cursive; color: black">Title</label>
          <input aria-describedby="Post Title" class="form-control" id="post_title"
                 placeholder="Interesting titles go here." v-model="post_title" v-on:keyup.enter="post">
        </div>
        <div class="form-group col-md-8 mx-auto pt-3">
          <label for="post_content" style="font-family: 'Bungee', cursive; color: black">Content</label>
          <textarea class="form-control" id="post_content" placeholder="Add a little flair, why don'tcha?"
                    style="resize: none" v-model="post_content"></textarea>
          <small class="form-text text-muted" id="disclaimer_small">Reminder: don't post anything that goes
            against k/{{ this.$route.params.klepton }}'s rules.</small>
        </div>
        <button @click="post" class="btn mx-auto col-md-12 pt-3 pb-3 pl-4"
                style="font-family: 'Bungee', cursive; color: black" type="button">
          <span v-if="!submitting">Post</span>
          <span class="spinner-border" role="status" v-if="submitting"></span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import navbar from "~/components/navbar";

export default {
  name: "new_post",
  components: {navbar},
  computed: {
    user() {
      return this.$store.state.user.user
    }
  },
  data() {
    return {
      post_title: '',
      post_content: '',
      post_author: '',
      posting_klepton: [],
      posting_klepton_id: '',
      ready: false,
      submitting: false
    }
  },
  methods: {
    post: function () {
      if (this.user.loggedIn) {
        if (!this.post_title) {
          alert('Your post needs a title.')
        } else if (!this.post_content) {
          alert('Your post needs some content.')
        } else {
          this.submitting = true
          let newPost = this.$fireStore.collection('posts').doc()
          newPost.set({
            author: this.user.data.displayName,
            content: this.post_content,
            created: firebase.firestore.FieldValue.serverTimestamp(),
            klepton: this.$route.params.klepton.toString(),
            title: this.post_title
          })
          this.$fireStore.collection('kleptons').doc(this.posting_klepton_id.toString()).update({
            posts: firebase.firestore.FieldValue.arrayUnion(newPost.id)
          })
          this.submitting = false
          this.$router.go(-1)
        }
      }
    }
  },
  firestore() {
    const kleptRef = this.$fireStore.collection('kleptref').doc(this.$route.params.klepton)
    kleptRef.get().then((doc) => {
      this.posting_klepton_id = doc.get('kid')
      this.$fireStore.collection('kleptons').doc(doc.get('kid')).get().then((doc) => {
        this.posting_klepton = doc.data()
        this.ready = true
      })
    })
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
