import { createStore } from 'vuex';
import api from '../api';
import _ from 'lodash';
import {
  assets as assetsOptions,
  filters as filterOptions,
} from '../config.json';

const { ethereum } = window;

export default createStore({
  state: {
    authenticated: document.cookie.includes('x-auth'),
    address: null,
    balance: null,
    user: null,
    shoppingCart: _.chain(assetsOptions.sections)
      .keyBy('name')
      .mapValues(() => 0)
      .value(),
    ethPrice: null,
    filters: {
      home: {
        current: filterOptions.home[0],
        options: filterOptions.home,
      },
    },
  },
  getters: {
    shopping: (state) => (_.reduce(state.shoppingCart, (a, i) => (a += i), 0) > 0), // eslint-disable-line
    checkoutItems: (state, getters) => {
      const items = {};
      for (const key in state.shoppingCart) {
        if (state.shoppingCart[key]) {
          const prices = getters.amountInEth(state.shoppingCart[key], key);
          items[key] = {
            quantity: state.shoppingCart[key],
            ...prices,
          };
        }
      }
      return items;
    },
    amountInEth: (state) => (amount, type) => {
      const calculated = {
        price: 0,
        priceInUSD: 0,
      };
      if (!amount || !state.ethPrice) {
        return calculated;
      }
      const amountCoeff = (1 / state.ethPrice) * assetsOptions.sections[type].coeff;
      calculated.priceRaw = (amount * amountCoeff);
      calculated.price = calculated.priceRaw.toFixed(5);
      calculated.priceInUSDRaw = (calculated.price * state.ethPrice);
      calculated.priceInUSD = calculated.priceInUSDRaw.toFixed(2);
      return calculated;
    },
  },
  mutations: {
    setAddress: (state, address) => {
      state.address = address;
    },
    setBalance: (state, balance) => {
      state.balance = balance;
    },
    authenticate: (state, user) => {
      state.authenticated = true;
      state.user = user;
    },
    deauthenticate: (state) => {
      state.authenticated = false;
      state.user = null;
    },
    setEthPrice: (state, price) => {
      state.ethPrice = parseFloat(price.amount, 10);
    },
    resetShoppingCart: (state) => {
      state.shoppingCart = _.mapValues(state.shoppingCart, () => 0);
    },
  },
  actions: {
    checkAuthenticated: async (context) => {
      if (ethereum && !ethereum.selectedAddress) return;
      const user = await api.user.authenticated();
      if (user && ethereum.selectedAddress) {
        context.commit('authenticate', user);
      } else {
        if (ethereum.selectedAddress) {
          context.commit(
            'authenticate',
            await api.user.get(ethereum.selectedAddress),
          );
          return;
        }
        context.commit('deauthenticate');
        await api.user.logout();
      }
      if (!context.state.address && !context.state.balance) {
        await Promise.all([
          context.commit('setAddress', ethereum.selectedAddress),
          context.dispatch('updateBalance', ethereum.selectedAddress),
        ]);
      }
    },
    updateBalance: async (context, address) => {
      const balance = await ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      context.commit('setBalance', balance);
    },
    connectWallet: async (context) => {
      if (ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        await Promise.all([
          context.commit('setAddress', accounts[0]),
          context.dispatch('updateBalance', accounts[0]),
          context.dispatch('checkAuthenticated'),
        ]);
      }
    },
    updateEthPrice: async (context) => {
      context.commit('setEthPrice', await api.price());
    },
  },
});
