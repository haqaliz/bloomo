<template>
  <masonry
    v-if="artwork"
    class="masonry-container bottom-padding-removed flex"
    :cols="artworkOptions.cols"
    :gutter="artworkOptions.gutter"
  >
    <template
      v-for="section of artworkOptions.sections"
      :key="section"
    >
      <div
        v-if="section === 'context'"
        class="artwork-section artwork-context"
        :style="{
          backgroundImage: section === 'context' ? `url(${artwork.preview})` : 'none',
        }"
      >
        <it-button
          type="black"
          :icon="artwork.type === 'video' ? 'play_arrow' : 'search'"
          @click="modal = true"
        />
      </div>
      <Card
        v-else-if="section === 'description'"
        :content="artwork"
        :size="400"
        :limit-offset="10"
        :clickable="false"
        :exclude="['type', 'artwork']"
      />
    </template>
  </masonry>
  <masonry
    v-if="artwork && artworkOptions.sections.includes('auctions')"
    class="masonry-container top-padding-removed flex"
    :cols="artworkOptions.auctions.cols"
    :gutter="artworkOptions.auctions.gutter"
  >
    <div
      v-for="(auction, key) of auctions"
      :key="key"
      class="auction"
      :style="{ backgroundColor: artwork.color }"
    >
      <Username
        :limit-offset="0.8"
        :content="auction.actor"
      />
      <div class="section">
        <Timestamp :content="auction.date" />
        <Price :content="auction" />
      </div>
    </div>
  </masonry>
  <it-modal v-if="artwork" v-model="modal" class="artwork-modal">
    <template #body>
      <video
        v-if="artwork.type === 'video'"
        class="artwork-context"
        :src="artwork.url"
        :poster="artwork.preview"
        loop autoplay muted playsinline
      />
      <div
        v-else
        :src="artwork.url"
        class="img"
        :style="{
          backgroundImage: `url(${artwork.preview})`,
        }"
      />
    </template>
  </it-modal>
</template>

<script>
import Price from '../components/Price.vue';
import Timestamp from '../components/Timestamp.vue';
import Username from '../components/Username.vue';
import Card from '../components/Card.vue';
import api from '../api';
import { formatStatement, formatDate } from '../utils';
import { artwork as artworkOptions } from '../config.json';

export default {
  name: 'Artwork',
  components: {
    Price,
    Timestamp,
    Username,
    Card,
  },
  data() {
    return {
      artwork: null,
      modal: false,
      artworkOptions,
    };
  },
  computed: {
    title() {
      return formatStatement(this.artwork.name, 18);
    },
    auctions() {
      return this.artwork.history.filter(
        (i) => i.type.toLowerCase() !== 'settled',
      );
    },
  },
  async mounted() {
    this.$Loading.start();
    this.artwork = await api.artwork(this.$route.params.artwork_id);
    const actors = await Promise.all(
      this.artwork.history.map((i) => api.user.get(i.actor, false)),
    );
    this.artwork = {
      ...this.artwork,
      history: this.artwork.history.map((i, k) => ({
        ...i,
        actor: actors[k],
      })),
    };
    this.$Loading.finish();
  },
};
</script>

<style lang='scss'>
  .masonry-container {
    padding: $large-gap;

    &.top-padding-removed {
      padding-top: 0;
    }

    &.bottom-padding-removed {
      padding-bottom: 0;
    }

    .artwork-section {
      display: flex;
      position: relative;
      justify-content: flex-start;
      border-radius: $border-radius;
      padding: $large-gap;
      margin-bottom: $large-gap;
      height: 400px;
      overflow: hidden;

      &.artwork-context {
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        border: 1px solid $ebonics;
        align-items: flex-end;
        justify-content: flex-start;
      }
    }

    .auction {
      display: flex;
      flex-wrap: wrap;
      border-radius: $border-radius;
      padding: $large-gap;
      margin-bottom: $large-gap;
      max-height: 150px;

      .creator-detail {
        margin-right: $large-gap;
      }

      &> .section {
        display: inherit;
        width: 100%;
        margin-top: $large-gap;

        &> * {
          margin-right: $large-gap;

          &.timestamp {
            @media screen and (max-width: $extra-small-breakpoint) {
              display: none;
            }
          }
        }
      }
    }
  }

  .artwork-modal {
    .it-modal-content {
      padding: 0;
      height: $small-breakpoint;
      overflow:hidden;

      video {
        height: 100%;
      }

      .img {
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
