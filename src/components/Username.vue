<template>
  <it-button
    type="black"
    class="card-tag creator-detail"
    :loading="!content || !content.username"
    @click="$event.stopPropagation(); (!disabled && content && $router.push(`/user/${creator.raw}`))"
  >
    <template v-if="content && content.username">
      <it-avatar
        :src="content.profile"
        class="creator-profile"
        color="#a8a8c0"
        size="40px"
        square
      />
      <h5
        v-if="creator.raw === creator.formatted"
        class="creator-username"
      >
        @{{ creator.formatted }}
      </h5>
      <it-tooltip v-else :content="creator.raw" placement="top">
        <h5 class="creator-username">@{{ creator.formatted }}</h5>
      </it-tooltip>
    </template>
  </it-button>
</template>

<script>
import { formatStatement, formatDate } from '../utils';

export default {
  name: 'Username',
  props: {
    type: {
      type: String,
      default: 'palm',
    },
    limitOffset: {
      type: Number,
      default: 1,
    },
    content: Object,
    disabled: Boolean,
  },
  computed: {
    creator() {
      if (!this.content || !this.content.username) return null;
      const username = this.content.username;
      return {
        raw: username,
        formatted: {
          bloom: formatStatement(username, 12 * this.limitOffset),
        }[this.type] ?? (this.limitOffset > 1
          ? formatStatement(username, 12 * this.limitOffset)
          : username
        ),
      };
    },
  },
};
</script>

<style lang='scss'>
  .creator-detail {
    align-self: flex-start;
    cursor: pointer;

    .it-btn-text {
      align-items: center;
    }

    .creator-profile {
      border-radius: $border-radius - 0.7rem;
    }

    .creator-username {
      @include make-content-size(0.1rem, -200);
      margin-left: $large-gap - 0.5rem;
    }
  }
</style>
