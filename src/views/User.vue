<template>
  <masonry
    class="artworks flex"
    :cols="cardOptions.palm.cols"
    :gutter="cardOptions.palm.gutter"
  >
    <Card
      v-for="artwork in artworks"
      :key="`artwork-${artwork.id}`"
      :content="artwork"
      :size="cardOptions.palm.size"
      :exclude="['user', 'type', 'power-ups']"
    />
  </masonry>
</template>

<script>
import Card from '../components/Card.vue';
import api from '../api';

import { card as cardOptions } from '../config.json';

export default {
  name: 'User',
  components: {
    Card,
  },
  data() {
    return {
      artworks: null,
      artworksInitialized: false,
      cardOptions,
      foundUserAddress: null,
      interval: null,
    };
  },
  watch: {
    '$store.state.user': {
      async handler() {
        await this.findUserByUsername();
      },
      deep: true,
    },
  },
  unmounted() {
    if (this.interval) clearInterval(this.interval);
  },
  async mounted() {
    await this.loadArtworks();
    this.interval = setInterval(
      () => this.loadArtworks(0, (this.artworks && this.artworks.length)),
      5000,
    );
  },
  methods: {
    async loadArtworks(offset = 0, limit = 48) {
      if (
        this.$store.state.user
        && this.$store.state.user.username === this.$route.params.username
      ) this.$router.push('/profile');
      if (!this.artworksInitialized) this.$Loading.start();
      if (!this.foundUserAddress) {
        const searchResult = await api.search(this.$route.params.username, ['users'], 1);
        if (!searchResult.users.length) {
          this.$Loading.finish();
          return;
        }
        this.foundUserAddress = searchResult.users[0].id;
      }
      this.artworks = await api.artworks(this.foundUserAddress, offset, limit);
      if (!this.artworksInitialized) {
        this.$Loading.finish();
        this.artworksInitialized = true;
      }
    },
  },
};
</script>

<style lang='scss'>
  .artworks {
    padding: $large-gap;

    .card:last-child {
      margin-bottom: 0;
    }
  }
</style>
