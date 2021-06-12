<template>
  <Header />
  <div class="container">
    <router-view />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import api from './api';
import _ from 'lodash';

const { ethereum } = window;

export default {
  name: 'App',
  components: {
    Header,
  },
  async created() {
    this.$store.dispatch('updateEthPrice');
    setInterval(() => this.$store.dispatch('updateEthPrice'), 5000);
    const isUnlocked = _.get(ethereum, '_metamask.isUnlocked');
    if (ethereum && !ethereum.selectedAddress && await isUnlocked()) {
      await this.$store.dispatch('connectWallet');
    }
    await this.$store.dispatch('checkAuthenticated');
    ethereum.on('disconnect', () => this.$store.dispatch('checkAuthenticated'));
    ethereum.on('connect', () => this.$store.dispatch('checkAuthenticated'));
  },
};
</script>

<style lang="scss">
  .container {
    display: inherit;
    flex-direction: column;
    position: fixed;
    top: 102.4px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: scroll;
  }
</style>
