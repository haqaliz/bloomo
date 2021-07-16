<template>
  <template v-if="
    $store.state.authenticated
      && $store.state.user
      && $store.state.user.id === reference.creator.id
  "
  >
    <it-button
      type="black"
      class="power-ups-handler"
      icon="trending_up"
      @click="$event.stopPropagation(); modal = true"
    />
    <it-modal v-model="modal" class="power-ups-modal">
      <template #body>
        <it-checkbox
          v-for="(section, k) in assetsOptions.sections"
          :key="k"
          v-model="powerUps[k]"
          type="primary"
          :pulse="section.important"
          :disabled="availablePowerUps(k)"
        >
          <template #default>{{ section.title }}</template>
          <template #sublabel>{{ section.short_description }}</template>
        </it-checkbox>
      </template>
      <template #actions>
        <div class="btn-container">
          <it-button type="black" icon="bolt" @click="savePowerUps">Power Ups</it-button>
        </div>
        <it-alert v-if="modalAlert" iconbox type="danger" title="Payment rejected!" />
      </template>
    </it-modal>
  </template>
</template>

<script>
import _ from 'lodash';
import { assets as assetsOptions } from '../config.json';
import api from '../api';

export default {
  name: 'PowerUps',
  props: {
    reference: Object,
  },
  data() {
    return {
      powerUps: this.availablePowerUps(),
      assetsOptions,
      modal: false,
      Date,
    };
  },
  watch: {
    modal: function powerupsWatchModal() {
      if (!this.modal) this.powerUps = this.availablePowerUps();
    },
    reference: {
      handler() {
        const availablePowerUps = this.availablePowerUps();
        this.powerUps = _.mapValues(this.powerUps, (i, k) => (i || availablePowerUps[k]));
      },
      deep: true,
    },
  },
  methods: {
    availablePowerUps(assetType) {
      if (!this.$store.state.user) return null;
      // Users can renew after asset limit
      const userAssets = this.$store.state.user.assets;
      const powerUps = _.chain(assetsOptions.sections)
        .keyBy('name')
        .mapValues((i, k) => ({
          bold: userAssets[k] > 0 && (this.reference.is_bold || false),
          preferences: userAssets[k] && (Date.now() / 1000 - this.reference.renewed_at < i.limit),
        }[k]))
        .value();
      return assetType ? powerUps[assetType] : powerUps;
    },
    async savePowerUps() {
      this.$Loading.start();
      await api.user.artwork.powerUp(this.reference.id, this.powerUps);
      this.modal = false;
      this.$Loading.finish();
    },
  },
};
</script>

<style lang='scss'>
  .power-ups-modal {
    .it-modal-header {
      padding: $large-gap $large-gap 0 $large-gap;
    }

    .it-modal-footer {
      padding: 0 $large-gap $large-gap $large-gap !important;
    }

    .assets-container {
      display: flex;
      margin-top: $large-gap;

      .it-tag {
        margin-right: $large-gap;
        min-width: 110px;

        &:last-child {
          margin-right: 0;
        }

        .it-icon {
          margin-right: $large-gap;
        }
      }
    }

    .it-checkbox-wrapper {
      margin-bottom: $large-gap;

      &:last-child {
        margin-bottom:  0;
      }
    }
  }
</style>
