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
      :exclude="['user', 'type', 'artwork']"
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
      cardOptions,
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
  async mounted() {
    this.findUserByUsername();
  },
  methods: {
    async findUserByUsername() {
      if (
        this.$store.state.user
        && this.$store.state.user.username === this.$route.params.username
      ) this.$router.push('/profile');
      this.$Loading.start();
      const searchResult = await api.search(this.$route.params.username, ['users'], 1);
      if (!searchResult.users.length) {
        this.$Loading.finish();
        return;
      }
      const foundUserId = searchResult.users[0].id;
      this.artworks = await api.user.artworks(foundUserId);
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
