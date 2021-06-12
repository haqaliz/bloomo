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
    /* const { ethereum } = window;
    const test = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: '0x9d282d7616Ca36c88bAad094D1C8D5f0720d5E61',
          to: '0x9352fD6885E5B96e9a92A84D49AbDbEeA9DF8d2E',
          gas: '0x76c0', // 30400
          gasPrice: '0x9184e72a000', // 10000000000000
          value: '0x9184e72a', // 2441406250
        },
      ],
    });
    console.log(test); */
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
