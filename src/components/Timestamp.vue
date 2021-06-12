<template>
  <it-tag type="black" filled class="card-tag timestamp">
    {{ formattedTimestamp }}
  </it-tag>
</template>

<script>
import { formatDate } from '../utils';

export default {
  name: 'Timestamp',
  props: {
    content: Object,
  },
  computed: {
    formattedTimestamp() {
      return formatDate(parseInt(this.content, 10) * 1000);
    },
  },
};
</script>

<style lang='scss'>
  .timestamp {
    @include make-content-size(0.2rem);
  }
</style>
