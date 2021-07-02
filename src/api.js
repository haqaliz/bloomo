import axios from 'axios';
import utils from './utils';

const baseURL = 'http://localhost:8004';
const ax = axios.create({
  baseURL,
  withCredentials: true,
});

const api = {
  user: {
    authenticated: async () => {
      try {
        const res = await ax.get('user/current');
        return res.data;
      } catch (e) {
        utils.log.info('Unauthorized!');
        return false;
      }
    },
    get: async (id, self = true) => {
      let res;
      if (!self) {
        res = await ax.get(`user/${id}/detail`);
        return res.data;
      }
      await ax.post('auth', { id });
      return api.user.authenticated();
    },
    logout: async () => ax.post('auth/logout'),
    artworks: async (id, offset = 0, limit = 48) => {
      const res = await ax.get(`user/${id}/artworks`, {
        params: { offset, limit },
      });
      return res.data;
    },
    assets: {
      put: async (contract, content) => ax.put('user/assets', {
        contract, content,
      }),
    },
  },
  artwork: async (id) => {
    const res = await ax.get(`artworks/${id}`);
    return res.data;
  },
  search: async (q, indexes = ['users', 'artworks'], limit = 3) => {
    const res = await ax.get('search', {
      params: {
        q, indexes: indexes.toString(), limit,
      },
    });
    return res.data;
  },
  price: async (currency = 'usd') => {
    const res = await ax.get('price', {
      params: { currency },
    });
    return res.data;
  },
};

export default api;
