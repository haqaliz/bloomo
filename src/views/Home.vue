<template>
  <template v-if="loading">
    <div class="fluid-container">
      <it-loading
        radius="14"
        stroke="3"
        color="#000"
      />
    </div>
  </template>
  <template v-else>
    <div class="artworks-container flex">
      <div class="artworks-content">
        <Card
          v-for="artwork in artworks"
          :key="`artwork-${artwork.id}`"
          type="bloom"
          :content="artwork"
          :size="cardOptions.bloom.size"
          :exclude="['date', 'power-ups']"
          :limit-offset="0.8"
        />
      </div>
    </div>
  </template>
</template>

<script>
import Card from '../components/Card.vue';
import api from '../api';

import { card as cardOptions } from '../config.json';

export default {
  name: 'Home',
  components: {
    Card,
  },
  data() {
    return {
      artworks: null,
      artworksInitialized: false,
      interval: null,
      loading: false,
      cardOptions,
    };
  },
  unmounted() {
    if (this.interval) clearInterval(this.interval);
  },
  async mounted() {
    await this.loadArtworks();
    this.interval = setInterval(
      () => this.loadArtworks(),
      30000,
    );
  },
  methods: {
    async loadArtworks() {
      if (!this.artworksInitialized) {
        this.$Loading.start();
        this.loading = true;
      }
      this.artworks = await api.artworks('all');
      if (!this.artworksInitialized) {
        this.$Loading.finish();
        this.artworksInitialized = true;
        this.loading = false;
      }
    },
  },
};
</script>

<style lang='scss'>
  .artworks-container {
    display: flex;
    justify-content: center;

    .artworks-content {
      padding: $large-gap $large-gap 0 $large-gap;
      max-width:  $medium-breakpoint + 100px;
      flex: 1;

      .card {
        margin-bottom: $large-gap;
      }
    }
  }
</style>
