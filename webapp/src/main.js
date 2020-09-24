import Vue from 'vue';

require('dotenv').config();

Vue.config.productionTip = false;
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import App from './App.vue';

Vue.use(VueMaterial);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
