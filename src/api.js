import axios from 'axios';
import utils from './utils';

const baseURL = {
  development: process.env.VUE_APP_BACKEND_URL || 'http://localhost:8004',
  staging: 'https://staging.bloomo.app',
  production: 'https://bloomo.app',
}[process.env.NODE_ENV || 'development'];
if (!baseURL) throw new Error('baseURL not set');

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
    artworks: async (offset = 0, limit = 50) => {
      const res = await ax.get('user/artworks', {
        params: { offset, limit },
      });
      return res.data;
    },
    artwork: {
      powerUp: async (id, powerUps) => ax.post(`user/artwork/${id}/power-up`, powerUps),
    },
    assets: {
      put: async (contract, content) => ax.put('user/assets', {
        contract, content,
      }),
    },
    states: async (id) => {
      const res = await ax.get(`user/${id}/states`);
      return res.data;
    },
    analysis: async (options) => {
      const res = await ax.get(`user/analysis/${options.targetType}/${options.targetId}`, {
        params: {
          from: options.from / 1000,
          to: options.to / 1000,
        },
      });
      return res.data;
    },
  },
  analysis: async (options) => ax.post(`analysis/${options.targetType}/${options.targetId}`, {
    duration: options.duration,
    ...(options.targets && {
      targets: options.targets,
    }),
  }),
  artworks: async (id, granularity, offset = 0, limit = 50) => {
    const res = await ax.get(`user/${id}/artworks/${granularity}`, {
      params: { offset, limit },
    });
    return res.data;
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
