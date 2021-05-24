<template>
  <div class="artworks-container">
    <div class="artworks-content">
      <Card
        v-for="artwork in artworks"
        :key="`artwork-${artwork.id}`"
        :content="artwork"
        type="bloom"
      />
    </div>
  </div>
</template>

<script>
import Card from '../components/Card.vue';
import api from '../api';

export default {
  name: 'Home',
  components: {
    Card,
  },
  data() {
    return {
      artworks: null,
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
      max-width: 1000px;
      flex: 1;

      .card {
        margin-bottom: $large-gap;
      }
    }
  }
</style>
