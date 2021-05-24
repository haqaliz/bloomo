import axios from 'axios';

const baseURL = 'http://localhost:8004';
const ax = axios.create({
  baseURL,
});

const api = {
  user: {
    get: async (id) => {
      const res = await ax.get(`user/${id}`);
      return res.data;
    },
    artworks: async (id, offset = 0, limit = 48) => {
      const res = await ax.get(`user/${id}/artworks`, {
        params: { offset, limit },
      });
      return res.data;
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
};

export default api;
