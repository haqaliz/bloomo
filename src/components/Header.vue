<template>
  <div class="header">
    <it-button
      :class="$store.state.user ? 'profile-container' : 'connect-wallet'"
      :loading="connecting"
      @click="authenticate"
    >
      <template v-if="!$store.state.user && !connecting">
        Connect to MetaMask
      </template>
      <template v-else-if="$store.state.user">
        <it-avatar
          :src="$store.state.user && $store.state.user.profileImageUrl"
          color="#a8a8c0"
          size="40px"
          square
        />
        <div class="profile-content">
          <h3>{{ formattedBalance }}<sub>ETH</sub></h3>
          <span>{{ secureAddress }}</span>
        </div>
      </template>
    </it-button>
  </div>
</template>

<script>
import _ from 'lodash';

const { ethereum } = window;
const isUnlocked = _.get(ethereum, '_metamask.isUnlocked');

export default {
  name: 'Header',
  data() {
    return {
      ethereum,
      connecting: true,
    };
  },
  computed: {
    formattedBalance() {
      const readableBalance = (this.$store.state.balance / 10e17);
      return readableBalance > 0 ? readableBalance.toFixed(4) : 0;
    },
    secureAddress() {
      const addr = this.$store.state.address;
      return `${addr.substr(0, 6)}...${addr.substr(addr.length - 4)}`;
    },
  },
  watch: {
    '$store.state.user': {
      async handler() {
        this.connecting = false;
      },
      deep: true,
    },
  },
  async mounted() {
    if (!await isUnlocked()) this.connecting = false;
  },
  methods: {
    async authenticate() {
      if (ethereum && !ethereum.selectedAddress) {
        this.connecting = true;
        await this.$store.dispatch('connectWallet');
      } else {
        this.$router.push('profile');
      }
    },
  },
};
</script>

<style lang='scss'>
  .header {
    position: fixed;
    padding: $large-gap;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    z-index: 10000;
    background-color: white;
    border-bottom: 1px solid $ebonics;

    .connect-wallet {
      padding: $large-gap;
    }

    .profile-container  {
      padding: $large-gap + 0.8rem $large-gap - 0.4rem;

      .it-btn-text {
        align-items: center;

        .profile-content {
          display: inherit;
          flex-direction: column;
          align-items: flex-start;
          margin-left: $small-gap;

          h3 {
            font-size: $large-gap;

            sub {
              font-size: 14px;
              margin-left: $small-gap - 0.2rem;
            }
          }

          span {
            color: $manga-lavender;
            font-size: 0.7rem;
            margin-top: 0.15rem;
          }
        }
      }
    }
  }
</style>
