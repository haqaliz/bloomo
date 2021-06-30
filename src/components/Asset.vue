<template>
  <template v-if="!buying">
    <it-tag type="black" filled>
      <it-icon
        box box-color="#a8a8c0"
        color="#000"
        name="edit"
        @click="buying = true"
      />
      <div class="asset-content">
        <h3>{{ $store.state.user.assets[content.name] }} <sub>Qt.</sub></h3>
        <span>{{ content.name }}</span>
      </div>
    </it-tag>
    <span class="description">{{ content.description }}</span>
  </template>
  <template v-else>
    <div class="col">
      <h3>
        {{ content.name }}
        <it-badge
          :value="asset.price"
          class="asset-price"
          :style="{ visibility: asset.status }"
          square
        />
        <it-badge
          :value="asset.priceInUSD"
          class="asset-price"
          :style="{ visibility: asset.status }"
          square
        />
      </h3>
      <it-slider
        v-model="$store.state.shoppingCart[content.name]"
        :step-points="true"
        :min="0"
        :max="50"
        :step="5"
      />
    </div>
    <it-button
      type="black"
      icon="close"
      @click="$store.state.shoppingCart[content.name] = 0; buying = false"
    />
  </template>
</template>

<script>
export default {
  name: 'Asset',
  props: {
    modelValue: String,
    content: Object,
  },
  data() {
    return {
      buying: false,
    };
  },
  computed: {
    asset() {
      const context = this.$store.getters.amountInEth(
        this.$store.state.shoppingCart[this.content.name],
        this.content.name,
      );
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
</style>
