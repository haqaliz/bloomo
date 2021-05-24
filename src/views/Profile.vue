<template>
  <masonry
    class="artworks"
    :cols="cardOptions.palm.cols"
    :gutter="cardOptions.palm.gutter"
  >
    <Card
      v-for="artwork in artworks"
      :key="`artwork-${artwork.id}`"
      :content="artwork"
    />
  </masonry>
</template>

<script>
import Card from '../components/Card.vue';
import api from '../api';

import { card as cardOptions } from '../config.json';

export default {
  name: 'Profile',
  components: {
    Card,
  },
  data() {
    return {
      artworks: null,
      cardOptions,
    };
  },
  watch: {
    '$store.state.user': async function profileWatchOnUser() {
      await this.loadArtworks();
    },
  },
  async mounted() {
    await this.loadArtworks();
  },
  methods: {
    async loadArtworks() {
      if (!this.$store.state.address) return;
      this.$Loading.start();
      this.artworks = await api.user.artworks(this.$store.state.address);
      this.$Loading.finish();
    },
  },
};
</script>

<style lang='scss'>
  .artworks {
    padding: $large-gap;
  }
</style>
