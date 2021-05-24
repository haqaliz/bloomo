<template>
  <div
    :class="`card ${cardType}`"
    :style="{ backgroundColor: content.raw.palette.Vibrant.color }"
    @click="$router.push(`/artwork/${content.id}`)"
  >
    <template v-if="cardType === 'palm'">
      <h3 class="title">{{ title }}</h3>
      <VueShowdown class="description" :markdown="description" />
      <div class="tags-container">
        <it-tag class="card-tag price">
          <template v-if="appropriatePrice">
            <it-icon
              :name="status.icon"
              :style="{ fontSize: !appropriatePrice ? '22px' : null }"
            /> {{ appropriatePrice }}
            <sub>ETH</sub>
          </template>
          <template v-else>Not listed yet</template>
        </it-tag>
        <it-tag class="card-tag renewed-at">
          {{ formattedRenewedAt }}
        </it-tag>
      </div>
    </template>
    <template v-else-if="cardType === 'bloom'">
      <it-tag
        class="card-tag creator-detail"
        @click="$event.stopPropagation(); $router.push(`/user/${content.raw.creator.username}`)"
      >
        <it-avatar
          :src="content.raw.creator.profileImageUrl"
          class="creator-profile"
          color="#a8a8c0"
          size="35px"
          square
        />
        <h5 class="creator-username">@{{ content.raw.creator.username }}</h5>
      </it-tag>
      <div class="artwork-detail flex">
        <div class="section flex">
          <h3 class="title">{{ title }}</h3>
          <span class="description">{{ strippedDescription }}</span>
        </div>
        <div class="section">
          <it-tooltip :content="status.type" placement="left">
            <it-tag class="card-tag price">
              <template v-if="appropriatePrice">
                <it-icon
                  :name="status.icon"
                  :style="{ fontSize: !appropriatePrice ? '22px' : null }"
                /> {{ appropriatePrice }}
                <sub>ETH</sub>
              </template>
              <template v-else>Not listed yet</template>
            </it-tag>
          </it-tooltip>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { formatDistance } from 'date-fns';

export default {
  name: 'Card',
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
  },
  data() {
    return {};
  },
  computed: {
    cardType() {
      return this.type.toLowerCase();
    },
    title() {
      const limit = 18;
      return this.content.raw.name.length > limit
        ? `${this.content.raw.name.substr(0, (limit - 1))}...`
        : this.content.raw.name;
    },
    strippedDescription() {
      const [limit, strippedDescription] = [
        54, this.content.raw.description.replace(/[*]+/g, ''),
      ];
      return (strippedDescription.length > limit)
        ? `${strippedDescription.substr(0, (limit - 1))}...`
        : strippedDescription;
    },
    description() {
      const limit = 32;
      return (this.content.raw.description.length > limit)
        ? `${this.content.raw.description.substr(0, (limit - 1))}...`
        : this.content.raw.description;
    },
    status() {
      const type = this.content.raw.nftHistory[0].event.toLowerCase();
      return {
        type: {
          transferred: 'Reserved price',
          settled: 'Sold :)',
          listed: 'Listed',
          pricechanged: 'Reserve price changed',
          bid: 'Got it\'s first bid!',
        }[type],
        icon: {
          transferred: 'visibility',
          settled: 'payments',
          listed: 'attach_money',
          pricechanged: 'attach_money',
          bid: 'trending_up',
        }[type],
      };
    },
    appropriatePrice() {
      if (this.content.raw.mostRecentActiveAuction) {
        const readableHighestBid = parseFloat(this.content.raw.mostRecentActiveAuction.highestBid);
        if (!Number.isNaN(readableHighestBid)) return readableHighestBid > 0 ? readableHighestBid.toFixed(2) : 0;
      }
      if (!this.content.raw.mostRecentActiveAuction) return null;
      const readablePrice = parseFloat(this.content.raw.mostRecentActiveAuction.reservePriceInETH);
      return readablePrice > 0 ? readablePrice.toFixed(2) : 0;
    },
    formattedRenewedAt() {
      return formatDistance(new Date(this.content.renewed_at), new Date(), { addSuffix: true });
    },
  },
  methods: {
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
    cursor: pointer;

    &.palm {
      height: 240px;
      flex-direction: column;

      .title {
        font-size: $title-size;
        font-weight: $title-weight;
        line-height: $title-line-height;
        margin-bottom: $small-gap;
      }

      .description {
        font-size: $content-size;
        font-weight: $content-weight;
        line-height: $content-line-height;
      }

      .tags-container {
        display: inherit;
        flex-direction: column;

        .card-tag {
          align-self: flex-start;
          margin-top: $small-gap;

          &.price {
            font-size: $content-size;
            font-weight: $content-weight + 300;
            line-height: $content-line-height;

            .it-icon {
              margin-right: $small-gap - 0.3rem;
            }

            sub {
              font-size: 14px;
              margin-left: $small-gap - 0.2rem;
              align-self: flex-end;
            }
          }

          &.renewed-at {
            font-size: $content-size - 0.4rem;
            font-weight: $content-weight + 300;
            background-color: $manga-lavender;
            color:  black;
            padding: $small-gap + 0.45rem $small-gap + 0.2rem;
          }
        }
      }
    }

    &.bloom {
      flex-direction: row;
      height: 50px;
      align-items: center;

      @media screen and (max-width: $extra-small-breakpoint) {
        height: 20px;
        border-radius: $border-radius - 0.3rem;
        padding: $large-gap - 0.3rem;
        margin-bottom: $small-gap + 0.2rem !important;
      }

      .card-tag {
        align-items: inherit;
        border-radius: $border-radius - 0.2rem;

        @media screen and (max-width: $extra-small-breakpoint) {
          padding: $small-gap - 0.2rem;
          border-radius: $border-radius - 0.8rem;
        }

        &.creator-detail {
          .creator-profile {
            border-radius: $small-gap + 0.3rem;

            @media screen and (max-width: $extra-small-breakpoint) {
              width: 20px !important;
              height: 20px !important;
              border-radius: $small-gap !important;
            }
          }

          .creator-username {
            font-size: $title-size - 0.9rem;
            font-weight: $title-weight - 100;
            line-height: $title-line-height - 1rem;
            margin-left: $small-gap + 0.2rem;

            @media screen and (max-width: $medium-breakpoint) {
              display: none;
            }
          }
        }

        &.price {
          font-size: $title-size - 0.9rem;
          font-weight: $title-weight - 100;
          line-height: $title-line-height - 1rem;
          padding: $small-gap + 0.595 $small-gap + 0.2rem;

          @media screen and (max-width: $extra-small-breakpoint) {
            padding: $small-gap - 0.1rem;
            border-radius: $border-radius - 0.8rem;
            font-size: $title-size - 1.2rem;
            line-height: $title-line-height - 1.3rem;
          }

          .it-icon {
            margin-right: $small-gap - 0.3rem;

            @media screen and (max-width: $extra-small-breakpoint) {
              font-size: 1rem !important;
              line-height: $title-line-height - 1.4rem;
              margin-right: $small-gap - 0.5rem;
            }
          }

          sub {
            font-size: 10px;
            margin-left: $small-gap - 0.2rem;
            align-self: flex-end;
          }
        }
      }

      .artwork-detail {
        display: inherit;
        margin-left: $large-gap;

        @media screen and (max-width: $small-breakpoint) {
          margin-left: $large-gap - 0.3rem;
        }

        .section {
          display: inherit;
          flex-direction: column;
          justify-content: center;
          margin-right: $large-gap;

          &:last-child {
            margin-right: 0;
          }

          .title {
            font-size: $title-size - 0.5rem;
            font-weight: $title-weight;
            line-height: $title-line-height - 0.6rem;

            @media screen and (max-width: $extra-small-breakpoint) {
              font-size: $title-size - 1.3rem;
              line-height: $title-line-height - 1.4rem;
            }
          }

          .description {
            display: inline-block;
            margin-top: $small-gap;

            @media screen and (max-width: $small-breakpoint) {
              display: none;
            }
          }
        }
      }
    }
  }
</style>
