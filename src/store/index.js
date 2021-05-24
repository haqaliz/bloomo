import { createStore } from 'vuex';
import api from '../api';

const { ethereum } = window;

export default createStore({
  state: {
    address: null,
    balance: null,
    user: null,
  },
  getters: {
  },
  mutations: {
    setAddress(state, address) {
      state.address = address;
    },
    setBalance(state, balance) {
      state.balance = balance;
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    async updateBalance(context, address) {
      const balance = await ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      context.commit('setBalance', balance);
    },
    async connectWallet(context) {
      if (ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        await Promise.all([
          context.commit('setAddress', accounts[0]),
          context.dispatch('updateBalance', accounts[0]),
          context.commit('setUser', await api.user.get(accounts[0])),
        ]);
      }
    },
  },
});
