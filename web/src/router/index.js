import { createRouter, createWebHistory } from "vue-router";
import PkIndexView from "../views/pk/PkIndexView";
import MatchesIndexView from "../views/matches/MatchesIndexView";
import StandingsIndexView from "../views/standings/StandingsIndexView";
import UserBotIndexView from "../views/user/bots/UserBotIndexView";
import NotFound from "../views/error/NotFound";
import UserAccountLoginView from "../views/user/account/UserAccountLoginView";
import UserAccountRegisterView from "../views/user/account/UserAccountRegisterView";
import store from "../store/index";

const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/pk/",
    meta: {
      requestAuth: true,
    },
  },
  {
    path: "/pk/",
    name: "pk_index",
    component: PkIndexView,
    meta: {
      requestAuth: true,
    },
  },
  {
    path: "/matches/",
    name: "matches_index",
    component: MatchesIndexView,
    meta: {
      requestAuth: true,
    },
  },
  {
    path: "/standings/",
    name: "standings_index",
    component: StandingsIndexView,
    meta: {
      requestAuth: true,
    },
  },
  {
    path: "/user/bots/",
    name: "user_bot_index",
    component: UserBotIndexView,
    meta: {
      requestAuth: true,
    },
  },

  {
    path: "/user/account/login/",
    name: "user_account_login",
    component: UserAccountLoginView,
    meta: {
      requestAuth: false,
    },
  },
  {
    path: "/user/account/register/",
    name: "user_account_register",
    component: UserAccountRegisterView,
    meta: {
      requestAuth: false,
    },
  },

  {
    path: "/404/",
    name: "404",
    component: NotFound,
    meta: {
      requestAuth: false,
    },
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

//在router进入某个页面之前调用这个函数,这是router api
//to表示跳转到页面，from表示从哪个页面跳转过去，next表示要不要执行下一步操作
router.beforeEach((to, from, next) => {
  //如果页面需要授权，并且全局变量中没有登录的情况，一律跳到登陆页面
  if (to.meta.requestAuth && !store.state.user.is_login) {
    next({ name: "user_account_login" });
  } else {
    //否则就正常跳转
    next();
  }
});

export default router;
