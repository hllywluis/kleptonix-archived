<template>
  <div id="kleptons">
    <navbar :on-kleptons="true"/>
    <div v-for="(klepton, idx) in kleptons" :key="idx"
         class="d-flex flex-column justify-content-center container mx-auto pt-2">
      <klepton :id="klepton.id" :description="klepton.description" :stitle="klepton.stitle" :title="klepton.title"
               :user_count="klepton.user_count"/>
    </div>
  </div>
</template>

<script>
import navbar from '~/components/navbar'
import klepton from '~/components/klepton'

export default {
  name: 'kleptons',
  components: {
    klepton,
    navbar
  },
  data () {
    return {
      kleptons: []
    }
  },
  firestore () {
    const kleptonData = this.$fireStore.collection('kleptons').orderBy('created', 'desc')
    return {
      kleptons: kleptonData
    }
  }
}
</script>

<style scoped>

</style>
