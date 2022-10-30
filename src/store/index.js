import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  state: {
    currentUser: {},
    csrf: null,
    signedIn: false,
  },
  mutations: {
    refresh(state, {csrf}){
      state.csrf = csrf
    },
    setCurrentUser(state, {currentUser, csrf}){
      state.currentUser = currentUser
      state.signedIn = true
      state.csrf = csrf
    },
    unsetCurrentUser(state){
      state.currentUser = {}
      state.csrf = null
      state.signedIn = false
    },
  },
  actions: {
  },
  getters: {
    isSignedIn(state){
      return state.signedIn
    }
  },
  plugins: [
    createPersistedState({
      paths: [
        "currentUser",
        "csrf",
        "signedIn",
      ]
    })
  ],
});
