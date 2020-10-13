export default ({ store, app }) => {
  app.router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.noAuth)) {
      if (store.state.user.user.loggedIn) {
        next({name: 'Feed'})
      } else {
        next()
      }
    } else if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!store.state.user.user.loggedIn) {
        next({name: 'Feed'})
      } else {
        next()
      }
    } else {
      next()
    }
  })
}
