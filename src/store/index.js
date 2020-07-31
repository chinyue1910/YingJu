import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      username: '',
      userID: '',
      userAccount: ''
    }
  },
  mutations: {
    adduser (state, data) {
      state.user = {
        username: data[0],
        userAccount: data[1],
        userID: data[2]
      }
    },
    logout (state) {
      state.user = {
        username: '',
        userAccount: '',
        userID: ''
      }
    }
  },
  getters: {
    username (state) {
      return state.user.username
    },
    userAccount (state) {
      return state.user.userAccount
    },
    userID (state) {
      return state.user.userID
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState()]
})
