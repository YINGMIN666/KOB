import $ from "jquery";

//定义全局变量
export default {
  state: {
    id: "",
    username: "",
    photo: "",
    token: "",
    is_login: false,
    pulling_info: true, // 是否正在从云端拉取信息
  },
  getters: {},
  //这个模块是用来修改数据的
  mutations: {
    updateUser(state, user) {
      state.id = user.id;
      state.username = user.username;
      state.photo = user.photo;
      state.is_login = user.is_login;
    },
    //定义一个修改token的
    updateToken(state, token) {
      state.token = token;
    },
    logout(state) {
      state.id = "";
      state.username = "";
      state.photo = "";
      state.token = "";
      state.is_login = false;
    },
    updatePullingInfo(state, pulling_info) {
      state.pulling_info = pulling_info;
    },
  },

  //这个模块支持异步操作，用它去调用mutations里面的方法去修改数据
  actions: {
    //context是调用mutations中的方法，data是页面触发传过来的数据
    login(context, data) {
      //调用后端api
      $.ajax({
        url: "http://127.0.0.1:3000/user/account/token/",
        type: "post",
        data: {
          username: data.username,
          password: data.password,
        },
        success(resp) {
          if (resp.error_message === "success") {
            //登陆成功后将token存到localStorage中
            localStorage.setItem("jwt_token", resp.token);
            //这个是actions中无法直接修改state中的数据，commit方法是间接调用，mutations中的方法进行对数据的修改
            context.commit("updateToken", resp.token); //->调用方法就这么写
            //这个屌用完之后再调用data中success
            data.success(resp);
          } else {
            data.error(resp);
          }
        },
        error(resp) {
          data.error(resp);
        },
      });
    },
    getinfo(context, data) {
      $.ajax({
        url: "http://127.0.0.1:3000/user/account/info/",
        type: "get",
        headers: {
          Authorization: "Bearer " + context.state.token,
        },
        success(resp) {
          if (resp.error_message === "success") {
            context.commit("updateUser", {
              ...resp,
              is_login: true,
            });
            data.success(resp);
          } else {
            data.error(resp);
          }
        },
        error(resp) {
          data.error(resp);
        },
      });
    },
    logout(context) {
      //退出时候就清除掉
      localStorage.removeItem("jwt_token");
      context.commit("logout");
    },
  },
  modules: {},
};
