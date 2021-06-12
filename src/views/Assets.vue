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
        class="section"
      >
        <div class="row">
          <template v-if="activatedAsset !== section">
            <it-tag type="black" filled>
              <it-icon
                box box-color="#a8a8c0"
                color="#000"
                name="edit"
                @click="activatedAsset = section"
              />
              <div class="asset-content">
                <h3>{{ $store.state.user.assets[section.name] }} <sub>Qt.</sub></h3>
                <span>{{ section.name }}</span>
              </div>
            </it-tag>
            <span class="description">{{ section.description }}</span>
          </template>
          <template v-else>
            <div class="col">
              <h3>
                {{ section.name }}
                <it-badge
                  :value="preferences.price"
                  class="asset-price"
                  :style="{ visibility: preferences.status }"
                  square
                />
                <it-badge
                  :value="preferences.priceInUSD"
                  class="asset-price"
                  :style="{ visibility: preferences.status }"
                  square
                />
              </h3>
              <it-slider
                v-model="$store.state.shoppingCart.preferences"
                :stepPoints="true"
                :min="0"
                :max="50"
                :step="5"
              />
            </div>
            <it-button
              type="black"
              icon="close"
              @click="$store.state.shoppingCart.preferences = 0; activatedAsset = null"
            />
          </template>
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
import { assets as assetsOptions } from '../config.json';

export default {
  name: 'Assets',
  data() {
    return {
      assetsOptions,
      activatedAsset: null,
    };
  },
  computed: {
    preferences() {
      const context = this.$store.getters.amountInEth(this.$store.state.shoppingCart.preferences);
      return {
        price: `${context.price} ETH`,
        priceInUSD: `$${context.priceInUSD}`,
        status: context.price ? 'visible' : 'hidden',
      };
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

    .section {
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

          .it-tag {
            flex-direction: row;

            .it-icon {
              cursor: pointer;
            }

            .asset-content {
              display: inherit;
              flex-direction: column;
              align-items: flex-start;
              margin-left: $large-gap - 0.5rem;
              min-width: 110px;

              h3 {
                font-size: $large-gap;

                sub {
                  font-size: 14px;
                  margin-left: $large-gap - 0.8rem;
                }
              }

              span {
                color: $manga-lavender;
                text-transform: capitalize;
                font-size: 0.7rem;
                margin-top: 0.15rem;
              }
            }
          }

          .description {
            margin-left: $large-gap;
            line-height: $large-gap;

            @media screen and (max-width: $small-breakpoint) {
              display: none;
            }
          }

          .col {
            flex: 1;
            margin-right: $large-gap;

            h3 {
              display: flex;
              align-items: center;
              text-transform: capitalize;
              margin-bottom: $large-gap;

              .asset-price {
                margin-left: $large-gap;

                .it-badge-body {
                  padding: $large-gap - 0.9rem $large-gap - 0.5rem;
                  font-size: $large-gap - 0.4rem;
                  border-radius: $border-radius - 0.8rem;
                }
              }
            }
          }
        }
      }
  }

  .not-authenticated {
    h2 {
      margin-left: $large-gap;
    }
  }
</style>
