<template>
  <Navbar />
  <router-view></router-view>
</template>

<script>
import Navbar from "@/components/NavBar.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
//import $ from "jquery";

export default {
  components: {
    Navbar,
  },
  setup() {
    /*  $.ajax({
      url: "http://127.0.0.1:3000/user/account/token/",
      type: "post",
      data: {
        username: "bb",
        password: "pbb",
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      },
    });

    $.ajax({
      url: "http://127.0.0.1:3000/user/account/info/",
      type: "get",
      headers: {
        //token 密钥随机的，每次改变
        Authorization:
          "Bearer " +
          "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyYjg1MmVhOTYzYzg0NzlmOGNkN2FiNjkwNmY4ZDNjNCIsInN1YiI6IjIiLCJpc3MiOiJzZyIsImlhdCI6MTY4MzIzNjQ1OCwiZXhwIjoxNjg0NDQ2MDU4fQ.fxDeAHQ-FhsU8mMD0QoMC8Dvx_F4ZckBQP477KR41nU",
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      },
    });

    $.ajax({
      url: "http://127.0.0.1:3000/user/account/register/",
      type: "post",
      data: {
        username: "yxc2",
        password: "123",
        confirmedPassword: "123",
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      },
    }); */
  },
};
</script>

<style>
body {
  background-image: url("@/assets/images/background.png");
  background-size: cover;
}
</style>
