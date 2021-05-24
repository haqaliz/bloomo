<template>
  {{ $route.params.artwork_id }}
</template>

<script>
import Card from '../components/Card.vue';
import api from '../api';

import { card as cardOptions } from '../config.json';

export default {
  name: 'Artwork',
  components: {
    Card,
  },
  data() {
    return {
      artwork: null,
      cardOptions,
    };
  },
  async mounted() {
    this.$Loading.start();
    this.artwork = await api.artwork(this.$route.params.artwork_id);
    this.$Loading.finish();
    console.log(this.artwork);
  },
};
</script>

<style lang='scss'>
  .artworks {
    padding: $large-gap;
  }
</style>
