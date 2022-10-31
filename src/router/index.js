import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import store from "@/store";

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
})

router.beforeEach((to, from, next) => {
  let signedIn = store.state.signedIn;
  if(to.meta.auth && !signedIn) {
    next("/login");
  }else if (!to.meta.auth && signedIn){
    next(from);
  }else {
    next();
  }
})

export default router
