<template>
  <div class="header">
    <div class="menu-bar">
      <it-button type="black" icon="home" @click="$router.push('/')" />
      <Username
        v-if="
          $route.params.username
          && (
            !$store.state.user
            || ($store.state.user
            && $store.state.user.username !== $route.params.username)
          )
        "
        :limit-offset="0.8"
        :content="user"
        :disabled="true"
      />
    </div>
    <template v-if="$store.state.authenticated && $store.state.user">
      <it-badge
        v-if="$store.getters.shopping"
        type="danger"
        class="profile-menu-item force"
        point
      >
        <it-button
          type="black"
          icon="shopping_cart"
          @click="modal = true"
        />
      </it-badge>
      <it-button
        type="black"
        class="profile-menu-item"
        icon="account_balance_wallet"
        @click="$router.push('/profile/assets')"
      />
    </template>
    <it-button
      type="black"
      :class="`main-navigation-btn ${($store.state.user ? 'profile-summary' : 'connect-wallet')}`"
      :loading="connecting"
      @click="authenticate"
    >
      <template v-if="!$store.state.user && !connecting">
        Connect to MetaMask
      </template>
      <template v-else-if="$store.state.user">
        <it-avatar
          :src="$store.state.user && $store.state.user.profile"
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
  <it-modal v-if="$store.getters.shopping" v-model="modal" class="checkout-modal">
    <template #body>
      <table class="flex">
        <thead>
          <th>Asset Type</th>
          <th>Qt.</th>
        </thead>
        <tbody>
          <tr
            v-for="(item, k) in $store.getters.checkoutItems"
            :key="k"
          >
            <td>{{ k }}</td>
            <td>{{ item }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </it-modal>
</template>

<script>
import Username from './Username.vue';
import api from '../api';
import _ from 'lodash';

const { ethereum } = window;

export default {
  name: 'Header',
  components: {
    Username,
  },
  data() {
    return {
      ethereum,
      connecting: true,
      user: null,
      modal: true,
    };
  },
  computed: {
    formattedBalance() {
      const readableBalance = (this.$store.state.balance / 10e17);
      return parseFloat(readableBalance.toFixed(4), 10) > 0 ? readableBalance.toFixed(4) : 0;
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
    '$route.params': {
      async handler() {
        this.user = null;
        if (!this.$route.params.username) return;
        this.$Loading.start();
        const searchResult = await api.search(this.$route.params.username, ['users'], 1);
        if (!searchResult.users.length) {
          this.$Loading.finish();
          return;
        }
        this.user = await api.user.get(searchResult.users[0].id, false);
        this.$Loading.finish();
      },
      deep: true,
    },
  },
  async mounted() {
    const isUnlocked = _.get(ethereum, '_metamask.isUnlocked');
    if (!await isUnlocked()) this.connecting = false;
  },
  methods: {
    async authenticate() {
      if (ethereum && !ethereum.selectedAddress) {
        this.connecting = true;
        await this.$store.dispatch('connectWallet');
      } else {
        this.$router.push('/profile');
      }
    },
  },
};
</script>

<style lang='scss'>
  .header {
    display: inherit;
    position: fixed;
    padding: $large-gap;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    z-index: 10000;
    background-color: white;
    border-bottom: 1px solid $ebonics;

    .menu-bar {
      display: inherit;
      flex-direction: row;
      flex: 1;
      margin-right: $large-gap;

      &> * {
        margin-right: $large-gap;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .profile-menu-item {
      margin-right: $large-gap;
    }

    @media screen and (max-width: $extra-small-breakpoint) {
      .profile-menu-item:not(.force) {
        margin-right: 0;
      }
    }

    .main-navigation-btn {
      @media screen and (max-width: $extra-small-breakpoint) {
        display: none;
      }

      &.connect-wallet {
        padding: $large-gap;
      }

      &.profile-summary  {
        .it-btn-text {
          align-items: center;

          .profile-content {
            display: inherit;
            flex-direction: column;
            align-items: flex-start;
            margin-left: $large-gap - 0.5rem;

            h3 {
              font-size: $large-gap;

              sub {
                font-size: 14px;
                margin-left: $large-gap - 0.8rem;
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
  }

  .checkout-modal {
    .it-modal-content {
      display: flex;

      table {
        border-radius: $border-radius;
        overflow: hidden;
        margin: $large-gap - 0.8rem 0;

        thead {
          background-color: black;
          color: white;
        }

        tbody {
          tr {
            &:nth-child(odd) {
              background-color: $ebonics;
            }
          }
        }

        th,
        td {
          text-align: left;
          padding: $large-gap;
        }
      }
    }
  }
</style>
