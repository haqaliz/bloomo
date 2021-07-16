<template>
  <template v-if="loading">
    <div class="fluid-container loading">
      <it-loading
        radius="14"
        stroke="3"
        color="#000"
      />
      <h4>It may take a few seconds<br>for the first time&hellip;</h4>
    </div>
  </template>
  <template v-else>
    <div
      v-if="user
        && (
          user.bio
          || (user.links && user.links.length)
        )"
      class="profile-detail"
    >
      <it-badge class="biography" value="Bio" position="top-right">
        <it-tag>{{ user.bio }}</it-tag>
      </it-badge>
      <a
        v-for="(link, k) in user.links"
        :key="k"
        :class="`it-btn it-btn--normal platform ${link.platform}`"
        :href="fullAddress(link)"
      >
        {{ link.platform }}
      </a>
    </div>
    <masonry
      v-if="$route.name === 'Profile'
        ? $store.state.authenticated : true"
      class="artworks flex"
      :cols="cardOptions.palm.cols"
      :gutter="cardOptions.palm.gutter"
    >
      <Card
        v-for="artwork in artworks"
        :key="`artwork-${artwork.id}`"
        :content="artwork"
        :size="cardOptions.palm.size"
        :exclude="$store.state.authenticated
          ? ['user', 'type']
          : ['user', 'type', 'power-ups']"
      />
    </masonry>
    <div
      v-if="$route.name === 'Profile' && !$store.state.authenticated"
      class="fluid-container not-authenticated"
    >
      <it-icon name="fingerprint" />
      <h2>Not Authenticated!</h2>
    </div>
  </template>
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
      artworksInitialized: false,
      loading: false,
      cardOptions,
      foundUser: null,
      interval: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.user || this.foundUser;
    },
  },
  watch: {
    '$store.state.user': {
      async handler() {
        await this.loadArtworks();
      },
      deep: true,
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
      if (!this.artworksInitialized) {
        this.$Loading.start();
        this.loading = true;
      }
      this.artworks = await {
        Profile: () => {
          if (!this.$store.state.address || !this.$store.state.authenticated) return null;
          if (!this.artworksInitialized) this.$Loading.start();
          return api.user.artworks(offset, limit);
        },
        User: async () => {
          if (
            this.$store.state.user
            && this.$store.state.user.username === this.$route.params.username
          ) this.$router.push('/profile');
          if (!this.foundUserAddress) {
            const searchResult = await api.search(this.$route.params.username, ['users'], 1);
            if (!searchResult.users.length) {
              this.$Loading.finish();
              return null;
            }
            this.foundUser = searchResult.users[0];
          }
          return api.artworks(this.foundUser.id, offset, limit);
        },
      }[this.$route.name]();
      if (!this.artworksInitialized) {
        this.$Loading.finish();
        this.artworksInitialized = true;
        this.loading = false;
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

  .not-authenticated,
  .loading {
    h2,
    h4 {
      margin-left: $large-gap;
    }
  }
</style>
