// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App';
import router from './router/router';
import './styles/index.scss';
import 'element-ui/lib/theme-default/index.css';
import ElementUI from 'element-ui';

Vue.use(VueResource);
Vue.use(ElementUI);
// Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
