<template>
  <div id="profile" v-if="user.loggedIn">
    <navbar :on-profile="true"></navbar>
    <h1 class="mt-auto p-3 text-center" style="font-family: 'Bungee', cursive" v-if="userPreferences.hidename">
      My Profile</h1>
    <h1 class="mt-auto p-3 text-center" style="font-family: 'Bungee', cursive" v-else>{{ user.data.displayName }}'s
      Profile</h1>
  </div>
</template>

<script>
import navbar from '@/components/navbar'

export default {
  name: 'profile',
  components: { navbar },
  computed: {
    user () {
      return this.$store.state.user.user
    }
  },
  data () {
    return {
      userPreferences: []
    }
  },
  middleware ({ store, redirect }) {
    if (!store.state.user.user.loggedIn) {
      return redirect('/')
    }
  },
  firestore () {
    if (this.$store.state.user.user !== undefined) {
      const userdataRef = this.$fireStore.collection('userdata').doc(this.user.data.uid)
      userdataRef.get().then((docSnapshot) => {
        if (docSnapshot.exists) {
          userdataRef.onSnapshot((doc) => {
            return {
              userPreferences: doc
            }
          })
        } else {
          userdataRef.set({
            hidename: false,
            subs: []
          }).then(() => {
            return {
              userPreferences: userdataRef
            }
          }).catch(err => {
            console.error(err.message)
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
