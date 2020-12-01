import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBezIrwp2cYDubAHM_0mjcdsDJjPOWAYfk",
  authDomain: "tempo-goals.firebaseapp.com",
  databaseURL: "https://tempo-goals.firebaseio.com",
  projectId: "tempo-goals",
  storageBucket: "tempo-goals.appspot.com",
  messagingSenderId: "134060713442",
  appId: "1:134060713442:web:ce130494c217052961c5bb",
  measurementId: "G-CKBCT5TH0Q"
};


firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
