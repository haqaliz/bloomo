<template>
  <div
    :class="`card no-select ${cardType}`"
    :style="{
      backgroundColor: content.color,
      minHeight: `${size}px`,
      cursor: clickable ? 'pointer' : 'default',
    }"
    @click="clickable && $router.push(`/artwork/${content.id}`)"
  >
    <Username
      v-if="!exclude.includes('user')"
      :type="type"
      :limit-offset="limitOffset"
      :content="content.creator"
      :hide="!content.is_bold"
    />
    <div
      :class="{
        'artwork-detail': true,
        flex: true,
        'regular-parent': !content.is_bold,
      }"
    >
      <h1
        :class="{
          title: true,
          'regular-parent': !content.is_bold,
        }"
      >
        {{ title }}
      </h1>
      <span v-if="cardType === 'bloom'" class="description">{{ strippedDescription }}</span>
      <VueShowdown v-else-if="cardType === 'palm'" class="description" :markdown="description" />
    </div>
    <div :class="{
      'extra-detail': true,
      authenticated: $store.state.authenticated
        && $store.state.user
        && (
          $route.name.toLowerCase() === 'profile'
          || $store.state.user.username === $route.params.username
        ),
      bolded: !exclude.includes('artwork') && content.is_bold
    }"
    >
      <PowerUps
        v-if="$store.state.authenticated && $store.state.user && !exclude.includes('power-ups')"
        :reference="content"
      />
      <it-avatar
        v-if="!exclude.includes('artwork') && content.is_bold"
        :src="content.preview"
        class="artwork"
        square
        size="64px"
      />
      <it-tag
        v-if="!exclude.includes('type')"
        type="black"
        class="content-type"
        filled
      >
        <it-icon :name="contentType" />
      </it-tag>
      <Price :content="(content.lastActivity && content.lastActivity) ?? content.history[0]" />
      <Timestamp
        v-if="!exclude.includes('date')"
        :content="content.renewed_at"
      />
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { formatStatement } from '../utils';
import Price from './Price.vue';
import Timestamp from './Timestamp.vue';
import Username from './Username.vue';
import PowerUps from './PowerUps.vue';

export default {
  name: 'Card',
  components: {
    Price,
    Timestamp,
    Username,
    PowerUps,
  },
  props: {
    type: {
      type: String,
      default: 'palm',
    },
    content: Object,
    size: {
      type: Number,
      default: 220,
    },
    exclude: {
      type: Array,
      default: () => [],
    },
    limitOffset: {
      type: Number,
      default: 1,
    },
    clickable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    cardType() {
      return this.type.toLowerCase();
    },
    title() {
      return formatStatement(this.content.name, 6 * this.limitOffset);
    },
    contentType() {
      return {
        image: 'image',
        video: 'play_arrow',
      }[this.content.type];
    },
    strippedDescription() {
      return formatStatement(
        this.content.description.replace(/[*]+/g, ''),
        54 * this.limitOffset,
      );
    },
    description() {
      return formatStatement(this.content.description, 13 * this.limitOffset);
    },
  },
};
</script>

<style lang='scss'>
  .card {
    display: flex;
    overflow: hidden;
    border-radius: $border-radius + 0.5rem;
    padding: $large-gap;
    margin-bottom: $large-gap;
    -webkit-transition: transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out;
    -moz-transition: transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out;
    transition: transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out;

    &.bloom {
      align-items: center;

      &:hover {
        -webkit-box-shadow: 0 0 1rem 0 rgba($black, 0.3);
        -moz-box-shadow: 0 0 1rem 0 rgba($black, 0.3);
        box-shadow: 0 0 1rem 0 rgba($black, 0.3);
      }

      &:active {
        -webkit-transform: scale(1.1);
        -moz-transform: scale(1.1);
        transform: scale(1.1);
        -webkit-box-shadow: 0 0 2rem 0 rgba($black, 0.5);
        -moz-box-shadow: 0 0 2rem 0 rgba($black, 0.5);
        box-shadow: 0 0 2rem 0 rgba($black, 0.5);
      }

      .creator-detail {
        margin-bottom: 0;
      }

      .artwork-detail,
      .extra-detail {
        margin-left: $large-gap;
      }

      .extra-detail {
        .artwork {
          border-radius: $border-radius;
          margin-right: $large-gap;
        }
      }

      @media screen and (max-width: $medium-breakpoint) {
        .creator-detail {
          .creator-profile {
            margin-right: 0;
          }

          .creator-profile {
            display: none;
          }
        }

        .extra-detail{
          .content-type {
            display: none;
          }
        }
      }

      @media screen and (max-width: $small-breakpoint) {
        .title {
          @include make-content-size(-0.2rem, -200);
        }

        .description,
        .artwork {
          display: none;
        }
      }

      @media screen and (max-width: $extra-small-breakpoint) {
        height: 40px !important;
        border-radius: $border-radius - 0.2rem;
        padding: $large-gap - 0.5rem $large-gap - 1rem;

        .regular-parent {
          margin-left: $large-gap;
        }

        .creator-detail {
          align-self: center;
          margin-left: $large-gap;
          padding: $large-gap - 0.5rem;
          height: 40px;
          border-radius: $border-radius - 0.5rem;

          .creator-username {
            font-size: 11px;
          }
        }

        .artwork-detail {
          .title {
            @include make-content-size(0.2rem, -200);

            &.regular-parent {
              margin-left: $large-gap;
            }
          }

          &.regular-parent {
            margin-left: 0;
          }
        }

        .extra-detail {
          .price {
            display: none;
          }
        }
      }
    }

    &.palm {
      flex-direction: column;

      .artwork-detail {
        padding: $large-gap;
        border-radius: $border-radius - 0.3rem;
        background-color: rgba(white, 0.3);
      }

      .description,
      .extra-detail {
        margin-top: $large-gap;
      }

      .extra-detail {
        .artwork {
          margin-right: $large-gap;
          border-radius: $border-radius;
        }

        @media screen and (max-width: $large-breakpoint) {
          &.authenticated {
            .timestamp {
              display: none;
            }
          }
        }

        @media screen and (max-width: $extra-small-breakpoint) {
          flex-wrap: wrap;

          &.bolded {
            .price-section {
              margin-top: $large-gap;
            }
          }
        }
      }
    }

    .creator-detail {
      margin-bottom: $large-gap;
    }

    .artwork-detail {
      .description {
        @include make-content-size;
      }
    }

    .extra-detail {
      display: inherit;

      .content-type {
        display: inherit;
        justify-content: center;
        margin-right: $large-gap;
        width: $general-size;
      }

      .timestamp {
        margin-left: $large-gap;
      }

      .power-ups-handler {
         margin-right: $large-gap;
      }
    }
  }
</style>
