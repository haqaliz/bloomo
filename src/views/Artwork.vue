<template>
  <template v-if="loading">
    <div class="fluid-container loading">
      <it-loading
        radius="14"
        stroke="3"
        color="#000"
      />
    </div>
  </template>
  <template v-else>
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
          @mouseenter="addAnalysisTarget('content')"
        >
          <it-button
            type="black"
            :icon="artwork.type === 'video' ? 'play_arrow' : 'search'"
            @click="modal = true"
          />
          <PowerUps
            :reference="artwork"
          />
        </div>
        <div
          v-if="section === 'analysis'"
          class="artwork-section area-plot-container"
          :style="{ backgroundColor: artwork.color }"
        >
          <div v-if="!analysis.fetched" class="fluid-container loading">
            <it-loading
              radius="14"
              stroke="3"
              color="#000"
            />
          </div>
          <template v-else>
            <div class="plot-info">
              <h2>Views: 7 days</h2>
              <it-tag type="black" filled>{{ totalViewCount }}</it-tag>
            </div>
            <AreaPlot :data="analysis.fetched" />
          </template>
        </div>
      </template>
    </masonry>
    <Card
      v-if="artwork && artworkOptions.sections.includes('description')"
      class="artwork-description"
      :content="artwork"
      :size="400"
      :limit-offset="10"
      :clickable="false"
      :exclude="['type', 'artwork', 'power-ups']"
      @mouseenter="addAnalysisTarget('description')"
    />
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
        @mouseenter="addAnalysisTarget('auctions')"
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
          @mouseenter="addAnalysisTarget('zoomed-in-content')"
        />
        <div
          v-else
          :src="artwork.url"
          class="img"
          :style="{
            backgroundImage: `url(${artwork.preview})`,
          }"
          @mouseenter="addAnalysisTarget('zoomed-in-content')"
        />
      </template>
    </it-modal>
  </template>
</template>

<script>
import Price from '../components/Price.vue';
import Timestamp from '../components/Timestamp.vue';
import Username from '../components/Username.vue';
import PowerUps from '../components/PowerUps.vue';
import Card from '../components/Card.vue';
import AreaPlot from '../components/AreaPlot.vue';
import _ from 'lodash';
import api from '../api';
import { formatStatement } from '../utils';
import { artwork as artworkOptions } from '../config.json';

export default {
  name: 'Artwork',
  components: {
    Price,
    Timestamp,
    Username,
    PowerUps,
    Card,
    AreaPlot,
  },
  data() {
    return {
      artwork: null,
      artworkInitialized: false,
      loading: false,
      modal: false,
      artworkOptions,
      interval: null,
      analysis: {
        beginAt: null,
        targets: [],
        interval: null,
        fetched: null,
      },
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
    totalViewCount() {
      if (!this.analysis.fetched) return 0;
      return _.reduce(
        this.analysis.fetched,
        (a, i) => (a += i.count), // eslint-disable-line no-return-assign
        0,
      );
    },
  },
  async mounted() {
    await this.fetchArtworkDetail();
    this.interval = setInterval(() => this.fetchArtworkDetail(), 30000);
    this.startAnalysis();
  },
  async unmounted() {
    if (this.interval) clearInterval(this.interval);
    this.endAnalysis();
  },
  methods: {
    async fetchArtworkDetail() {
      let artworkHistory = (this.artwork && this.artwork.history) || [];
      if (!this.artworkInitialized) {
        this.$Loading.start();
        this.loading = true;
      }
      this.artwork = await api.artwork(this.$route.params.artwork_id);
      if (
        (!this.artworkInitialized && !artworkHistory.length)
        || (
          this.artworkInitialized
          && artworkHistory.length
          && artworkHistory.length !== this.artwork.history.length
        )
      ) {
        const actors = await Promise.all(
          this.artwork.history.map((i) => api.user.get(i.actor, false)),
        );
        artworkHistory = this.artwork.history.map((i, k) => ({
          ...i,
          actor: actors[k],
        }));
      }
      this.artwork = {
        ...this.artwork,
        history: artworkHistory,
      };
      this.analysis.fetched = await api.user.analysis({
        targetType: 'artworks',
        targetId: this.artwork.id,
        from: Date.now() - 7 * 60 * 60 * 24 * 1000,
        to: Date.now(),
      });
      if (!this.artworkInitialized) {
        this.$Loading.finish();
        this.artworkInitialized = true;
        this.loading = false;
      }
    },
    addAnalysisTarget(name) {
      if (!this.analysis.targets.includes(name)) this.analysis.targets.push(name);
      this.getUpdateAnalysis();
    },
    startAnalysis() {
      this.analysis.beginAt = Date.now();
      this.analysis.interval = setInterval(this.getUpdateAnalysis, 5000);
    },
    async endAnalysis() {
      await api.analysis(JSON.parse(this.getUpdateAnalysis()));
      localStorage.removeItem('analysis');
      if (this.analysis.interval) clearInterval(this.analysis.interval);
    },
    getUpdateAnalysis() {
      localStorage.setItem('analysis', JSON.stringify({
        targetType: 'artworks',
        targetId: this.artwork.id,
        duration: (Date.now() - this.analysis.beginAt) / 1000,
        targets: this.analysis.targets,
      }));
      return localStorage.getItem('analysis');
    },
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
        background-size: 150%;
        border: 1px solid $ebonics;
        align-items: flex-end;
        justify-content: flex-start;

        .it-btn {
          margin-right: $large-gap;

          &:last-child {
            margin-right: 0;
          }
        }
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

    .area-plot-container {
      display: flex;
      flex-direction: column;
      flex: 1;
      margin-bottom: $large-gap;
      border-radius: $border-radius;
      overflow: hidden;
      padding: 0;
      display: flex;
      align-items: flex-start;
      height: 438px;

      .plot-info {
        display: flex;
        flex: 1;
        align-items: center;
        padding: $large-gap;

        .it-tag {
          font-size: $large-gap;
          margin-left: $large-gap;
          min-width: $general-size;
          justify-content: center;
        }
      }

      .area-plot-content {
        max-height: 75%;
      }
    }
  }

  .artwork-description {
    margin: 0 $large-gap $large-gap $large-gap;
  }

  .artwork-modal {
    .it-modal-body {
      background-color: transparent;

      .it-modal-content {
        padding: 0 !important;
        max-height: 100%;
        overflow:hidden;

        video {
          width: 100%;
          height: 100%;
        }

        .img {
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          width: 100%;
          height: 100%;
          min-height: 400px;
        }
      }
    }
  }
</style>
