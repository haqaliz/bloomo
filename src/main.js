import { createApp } from 'vue';
import Equal from 'equal-vue';
import masonry from 'vue-next-masonry';
import { VueShowdownPlugin } from 'vue-showdown';
import 'equal-vue/dist/style.css';

import router from './router';
import store from './store';
import App from './App.vue';

createApp(App)
  .use(store)
  .use(router)
  .use(Equal)
  .use(masonry)
  .use(VueShowdownPlugin, {
    flavor: 'github',
    options: {
      emoji: false,
    },
  })
  .mount('#app');
