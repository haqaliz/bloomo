<template>
  <template v-if="$store.state.authenticated">
    <template v-if="$store.state.user">
      <div class="profile-detail">
        <it-badge class="biography" value="Bio" position="top-right">
          <it-tag>
            {{ $store.state.user.bio }}
          </it-tag>
        </it-badge>
        <a
          v-for="(link, k) in $store.state.user.links"
          :key="k"
          :class="`it-btn it-btn--normal platform ${link.platform}`"
          :href="fullAddress(link)"
        >
          {{ link.platform }}
        </a>
      </div>
    </template>
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
        :exclude="['user', 'type']"
      />
    </masonry>
  </template>
  <div v-else class="fluid-container not-authenticated">
    <it-icon name="fingerprint" />
    <h2>Not Authenticated!</h2>
  </div>
</template>

<script>
import Card from '../components/Card.vue';
import api from '../api';

import { card as cardOptions } from '../config.json';

export default {
  name: 'Profile',
  components: {
    Card,
  },
  data() {
    return {
      artworks: null,
      artworksInitialized: false,
      cardOptions,
      interval: null,
    };
  },
  watch: {
    '$store.state.user': async function profileWatchOnUser() {
      await this.loadArtworks();
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
      if (!this.$store.state.address || !this.$store.state.authenticated) return;
      if (!this.artworksInitialized) this.$Loading.start();
      this.artworks = await api.user.artworks(offset, limit);
      if (!this.artworksInitialized) {
        this.$Loading.finish();
        this.artworksInitialized = true;
      }
    },
    fullAddress(link) {
      return {
        twitter: `https://twitter.com/${link.handle}`,
        discord: `https://discord.com/users/${link.handle}`,
      }[link.platform] ?? link.handle;
    },
  },
};
</script>

<style lang='scss'>
  .profile-detail {
    display: inherit;
    background-color: $ebonics;
    padding: $large-gap $large-gap 0 $large-gap;
    margin: $large-gap $large-gap 0 $large-gap;
    border-radius: $border-radius;
    flex-wrap: wrap;

    .biography {
      margin: 0 $large-gap $large-gap 0;

      .it-tag {
        background-color: black;
        color: white;
      }
    }

    a {
      margin: 0 $large-gap $large-gap 0;

      &:last-child {
        margin-right: 0;
      }

      &.platform {
        min-width: 110px;
        justify-content: center;
        text-transform: capitalize;
        background-color: black;
        color: white;

        &.twitter {
          background-color: #1DA1F2;
        }

        &.tiktok {
          background-color: #ff0050;
          color: black;
        }

        &.twitch {
          background-color: #6441a5;
        }

        &.discord {
          background-color: #7289da;
        }

        &.youtube {
          background-color: #FF0000;
          color: black;
        }

        &.facebook {
          background-color: #4267B2;
        }

        &.snapchat {
          background-color: #FFFC00;
          color: black;
        }

        &.instagram {
          background-color: #fec564;
          color: black;
        }
      }
    }
  }

  .artworks {
    padding: $large-gap;

    .card:last-child {
      margin-bottom: 0;
    }
  }

  .not-authenticated {
    h2 {
      margin-left: $large-gap;
    }
  }
</style>
