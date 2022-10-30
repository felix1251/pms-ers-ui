import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "/",
      redirect: "/request"
    },
    ...setupLayouts(routes),
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  console.log(to)
  next();
  // let signedIn = store.state.signedIn;
  // let goTo = store.state.goTo;
  // let pageAccess = store.state.access;
  // if (to.meta.auth && !signedIn) {
  //   next({name: "Sign In"});
  // }else if (signedIn && to.meta.page && !pageAccess.includes(to.meta.page)){
  //   next(goTo);
  // }else if (!to.meta.auth && signedIn){
  //   next(goTo);
  // }else {
  //   next();
  // }
})

export default router
