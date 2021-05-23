import { createApp } from 'vue';
import Vuex from 'vuex';

import store from './store';
import App from './App.vue';
import './index.css';

createApp(App)
.use(store)
.mount('#app');
