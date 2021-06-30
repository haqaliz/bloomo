<template>
  <template v-if="$store.state.authenticated">
    <masonry
      v-if="$store.state.user"
      class="masonry-container top-padding-removed flex"
      :cols="assetsOptions.cols"
      :gutter="assetsOptions.gutter"
    >
      <div
        v-for="(section, key) of assetsOptions.sections"
        :key="key"
        class="asset-section"
      >
        <div class="row">
          <Asset :content="section" />
        </div>
      </div>
    </masonry>
  </template>
  <div v-else class="fluid-container not-authenticated">
    <it-icon name="fingerprint" />
    <h2>Not Authenticated!</h2>
  </div>
</template>

<script>
import Asset from '../components/Asset.vue';
import { assets as assetsOptions } from '../config.json';

export default {
  name: 'Assets',
  components: {
    Asset,
  },
  data() {
    return {
      assetsOptions,
    };
  },
};
</script>

<style lang='scss'>
  .masonry-container {
    padding: $large-gap;

    &.top-padding-removed {
      padding-top: 0;
    }

    .asset-section {
        display: flex;
        width: 100%;
        background-color: $ebonics;
        border-radius: $border-radius;
        padding: $large-gap;
        margin-top: $large-gap;
        box-sizing: border-box;

        .row {
          display: inherit;
          flex: 1;
          height: $general-size;
          align-items: center;
        }
      }
  }

  .not-authenticated {
    h2 {
      margin-left: $large-gap;
    }
  }
</style>
