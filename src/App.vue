<template>
  <Header />
  <div class="container">
    <router-view />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import _ from 'lodash';

const { ethereum } = window;

export default {
  name: 'App',
  components: {
    Header,
  },
  async mounted() {
    const isUnlocked = _.get(ethereum, '_metamask.isUnlocked');
    if (ethereum && !ethereum.selectedAddress && await isUnlocked()) {
      await this.$store.dispatch('connectWallet');
    }
  },
};
</script>

<style lang="scss">
  .container {
    margin-top: 102.4px;
  }
</style>
