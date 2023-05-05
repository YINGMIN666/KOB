<template>
  <ContentField v-if="!$store.state.user.pulling_info">
    <div class="row justify-content-md-center">
      <div class="col-3">
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="username" class="form-label">username</label>
            <input
              v-model="username"
              type="text"
              class="form-control"
              id="username"
              placeholder="Please enter your username"
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">password</label>
            <input
              v-model="password"
              type="password"
              class="form-control"
              id="password"
              placeholder="Please enter your password"
            />
          </div>
          <div class="error-message">{{ error_message }}</div>
          <button type="submit" class="btn btn-primary">submit</button>
        </form>
      </div>
    </div>
  </ContentField>
</template>

<script>
import ContentField from "../../../components/ContentField.vue";
import { useStore } from "vuex";
import { ref } from "vue";
import router from "../../../router/index";

export default {
  components: {
    ContentField,
  },
  setup() {
    const store = useStore();
    let username = ref("");
    let password = ref("");
    let error_message = ref("");

    const jwt_token = localStorage.getItem("jwt_token");

    //如果token存在本地
    if (jwt_token) {
      store.commit("updateToken", jwt_token); //存下，调用mutation函数用commit
      //验证token是否合法，验证就是从云端获取用户信息
      store.dispatch("getinfo", {
        success() {
          router.push({ name: "home" }); //跳到首页

          //mutations里函数用commit，action里面函数用dispatch
          store.commit("updatePullingInfo", false);
        },
        error() {
          //如果没有登录成功，就false，登陆界面正常显示
          store.commit("updatePullingInfo", false);
        },
      });
    } else {
      //如果没有登录成功，就false，登陆界面正常显示
      store.commit("updatePullingInfo", false);
    }

    const login = () => {
      error_message.value = "";
      store.dispatch("login", {
        username: username.value,
        password: password.value,
        success() {
          store.dispatch("getinfo", {
            success() {
              router.push({ name: "home" });
            },
          });
        },
        error() {
          error_message.value = "incorrect username or password";
        },
      });
    };

    return {
      username,
      password,
      error_message,
      login,
    };
  },
};
</script>

<style scoped>
button {
  width: 100%;
}
div.error-message {
  color: red;
}
</style>
