export const state = () => ({
  user: {
    loggedIn: false,
    data: null
  },
  user_subscriptions: []
})

export const getters = {
  user (state) {
    return state.user
  },
  user_subscriptions (state) {
    return state.user_subscriptions
  }
}

export const mutations = {
  SET_LOGGED_IN (state, value) {
    state.user.loggedIn = value
  },
  SET_USER (state, data) {
    state.user.data = data
  },
  SET_USER_SUBS (state, subs) {
    state.user_subscriptions = subs
  },
  REMOVE_USER_SUB (state, sub) {
    this.user_subscriptions.splice(state.user_subscriptions.indexOf(sub), 1)
  },
  ADD_USER_SUB (state, sub) {
    this.user_subscriptions.push(sub)
  }
}

export const actions = {
  fetchUser ({ commit }, user) {
    commit('SET_LOGGED_IN', user !== null)
    if (user) {
      commit('SET_USER', {
        displayName: user.displayName,
        uid: user.uid,
        email: user.email
      })
    } else {
      commit('SET_USER', null)
    }
  },
  set_user_subs ({ commit }, subs) {
    commit('SET_USER_SUBS', subs !== null)
    if (subs) {
      commit('SET_USER_SUBS', {
        user_subscriptions: subs
      })
    }
  },
  remove_user_sub ({ commit }, sub) {
    commit('REMOVE_USER_SUB', sub !== null)
    if (sub) {
      commit('REMOVE_USER_SUB', {
        sub: sub
      })
    }
  },
  add_user_sub ({ commit }, sub) {
    commit('ADD_USER_SUB', sub !== null)
    if (sub) {
      commit('ADD_USER_SUB', {
        sub: sub
      })
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
