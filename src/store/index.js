import Vue from 'vue'
import Vuex from 'vuex'
import PersistedState from 'vuex-persistedstate';
import router from '../router/index'
import VueConfetti from 'vue-confetti'


Vue.use(Vuex)

// for confetti
Vue.use(VueConfetti)

export default new Vuex.Store({
  state: {
    sToken: '',
    loggedIn: false
  },
  mutations: {
    setToken(state, value) {
      state.sToken = value
    },
    setLoggedIn(state, value) {
      state.loggedIn = value
    }
  },
  actions: {
    logout() {
      this.commit('setToken', '');
      this.commit('setLoggedIn', false);
      router.push('/login')
    }
  },
  modules: {
  },
  plugins: [PersistedState()]
})
