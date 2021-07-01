<template>
  <div class="artworks-container flex">
    <div class="artworks-content">
      <Card
        v-for="artwork in artworks"
        :key="`artwork-${artwork.id}`"
        type="bloom"
        :content="artwork"
        :size="cardOptions.bloom.size"
        :exclude="['date']"
        :limit-offset="0.8"
      />
    </div>
  </div>
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
      cardOptions,
    };
  },
  async mounted() {
    this.artworks = await api.user.artworks('all');
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
