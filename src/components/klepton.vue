<template>
  <div id="klepton">
    <div class="align-items-center text-center pb-3">
      <h3 v-if="!kleptonExists" style="font-family: 'Bungee', cursive; color: black">
        {{ title }}
      </h3>
      <h3 v-else>
        <nuxt-link v-if="user.loggedIn"
                   :to="{name: 'Klepton', params: {klepton: stitle, user_subbed: Object.values(subs).includes(id)}}"
                   style="font-family: 'Bungee', cursive; color: black">
          {{ title }}
        </nuxt-link>
        <nuxt-link v-else :to="{name: 'Klepton', params: {klepton: stitle, user_subbed: false}}"
                   style="font-family: 'Bungee', cursive; color: black">
          {{ title }}
        </nuxt-link>
      </h3>
      <h6 v-if="user_count === 1"><span
          style="font-family: 'Bungee', cursive">{{ user_count.toLocaleString() }}</span>
        user subscribed</h6>
      <h6 v-else><span style="font-family: 'Bungee', cursive">{{ user_count.toLocaleString() }}</span> users
        subscribed
      </h6>
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'klepton',
  computed: {
    user () {
      return this.$store.state.user.user
    },
    subs () {
      return this.$store.state.user.user_subscriptions
    }
  },
  props: {
    title: String,
    user_count: Number,
    description: String,
    stitle: String,
    id: String
  },
  data () {
    return {
      kleptonExists: Boolean
    }
  },
  firestore () {
    const kleptref = this.$fireStore.collection('kleptref').doc(this.stitle)
    kleptref.get().then((docSnapshot) => {
      this.kleptonExists = docSnapshot.exists
    })
  }
}
</script>

<style scoped>

</style>
