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
    const remainedAnalysis = localStorage.getItem('analysis');
    if (remainedAnalysis) {
      await api.analysis(JSON.parse(remainedAnalysis));
      localStorage.removeItem('analysis');
    }
    this.$store.dispatch('updateEthPrice');
    const isUnlocked = _.get(ethereum, '_metamask.isUnlocked');
    if (ethereum && !ethereum.selectedAddress && await isUnlocked()) {
      await this.$store.dispatch('connectWallet');
    }
    await this.$store.dispatch('checkAuthenticated');
    setInterval(() => Promise.all([
      this.$store.dispatch('checkAuthenticated'),
      this.$store.dispatch('updateEthPrice'),
    ]), 5000);
    ethereum.on('disconnect', () => {
      this.$store.dispatch('checkAuthenticated');
      this.$router.go(this.$router.currentRoute);
    });
    ethereum.on('connect', () => {
      this.$store.dispatch('checkAuthenticated');
      this.$router.go(this.$router.currentRoute);
    });
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
