<template>
  <div
    :class="`card ${cardType}`"
    :style="{
      backgroundColor: content.color,
      height: `${size}px`,
      cursor: clickable ? 'pointer' : 'default',
    }"
    @click="clickable && $router.push(`/artwork/${content.id}`)"
  >
    <Username
      v-if="!exclude.includes('user')"
      :type="type"
      :limit-offset="limitOffset"
      :content="content.creator"
    />
    <div
      class="artwork-detail flex"
    >
      <h1 class="title">{{ title }}</h1>
      <span v-if="cardType === 'bloom'" class="description">{{ strippedDescription }}</span>
      <VueShowdown v-else-if="cardType === 'palm'" class="description" :markdown="description" />
    </div>
    <div class="extra-detail">
      <it-avatar
        v-if="!exclude.includes('artwork') && content.bold"
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
        :content="this.content.renewed_at"
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

export default {
  name: 'Card',
  components: {
    Price,
    Timestamp,
    Username,
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
      return formatStatement(this.content.name, 18 * this.limitOffset);
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
      return formatStatement(this.content.description, 24 * this.limitOffset);
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

    &.bloom {
      align-items: center;

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
          background-color: transparent;
          padding: 0;

          .creator-username {
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

        .artwork-detail {
          margin-left: $large-gap - 1rem;

          .title {
            @include make-content-size(0.2rem, -200);
          }
        }

        .extra-detail {
          margin-left: 0;

          .price {
            display: none;
          }
        }

        .card-tag {
          padding: $large-gap - 0.8rem;
          height: 40px !important;
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
    }
  }
</style>
