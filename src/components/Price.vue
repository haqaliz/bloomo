<template>
  <it-tooltip
    v-if="content"
    :content="status.price ? status.name : 'Not listed :('"
    placement="top"
    class="section"
  >
    <it-tag
      type="black"
      filled
      :class="`card-tag price${ !status.price ? ' not-listed' : '' }`"
    >
      <template v-if="status.price && status.price !== 'NaN'">
        <it-icon
          :name="status.icon"
          :style="{ fontSize: !status.price ? '22px' : null }"
        /> {{ status.price }}
        <sub>ETH</sub>
      </template>
      <template v-else>
        <it-icon
          v-if="status.icon"
          :name="status.icon"
          :style="{ fontSize: '22px' }"
        />
        {{ status.name || 'Minted' }}
      </template>
    </it-tag>
  </it-tooltip>
</template>

<script>
import _ from 'lodash';
import { statuses } from '../config.json';

export default {
  name: 'Price',
  props: {
    content: Object,
  },
  computed: {
    status() {
      if (!this.content) return null;
      const type = this.content.type.toLowerCase();
      return {
        type,
        name: _.mapValues(statuses, (i) => i.name)[type],
        icon: _.mapValues(statuses, (i) => i.icon)[type],
        price: parseFloat(this.content.amount, 10).toFixed(2),
      };
    },
  },
};
</script>

<style lang='scss'>
  .price {
    @include make-content-size(-0.2rem, -200);

    &.not-listed {
      @include make-content-size(0.1rem, -100);
    }

    .it-icon {
      @include make-content-size(-0.3rem, -200);
    }

    sub {
      @include make-content-size(0.5rem, -200);
      margin: 7px 0 0 5px;
    }
  }
</style>
