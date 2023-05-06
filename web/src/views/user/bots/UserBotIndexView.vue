<template>
  <ContentField> MY BOT </ContentField>
</template>

<script>
import ContentField from "../../../components/ContentField.vue";
import $ from "jquery";
import { useStore } from "vuex";

export default {
  components: {
    ContentField,
  },
  setup() {
    const store = useStore();

    // $.ajax({
    //   url: "http://127.0.0.1:3000/user/bot/add/",
    //   type: "POST",
    //   data: {
    //     title: "Title of Bot",
    //     description: "The description of Bot",
    //     content: "Code of Bot",
    //   },
    //   headers: {
    //     Authorization: "Bearer " + store.state.user.token,
    //   },
    //   success(resp) {
    //     console.log(resp);
    //   },
    //   error(resp) {
    //     console.log(resp);
    //   },
    // });

    /* $.ajax({
      url: "http://127.0.0.1:3000/user/bot/remove/",
      type: "POST",
      data: {
        bot_id: 4,
      },
      headers: {
        Authorization: "Bearer " + store.state.user.token,
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      },
    }); */

    // $.ajax({
    //   url: "http://127.0.0.1:3000/user/bot/update/",
    //   type: "POST",
    //   data: {
    //     bot_id: 8,
    //     title: "Title of Bot is 5",
    //     description: "The description of Bot is 5",
    //     content: "Code of Bot is 5",
    //   },
    //   headers: {
    //     Authorization: "Bearer " + store.state.user.token,
    //   },
    //   success(resp) {
    //     console.log(resp);
    //   },
    //   error(resp) {
    //     console.log(resp);
    //   },
    // });

    $.ajax({
      url: "http://127.0.0.1:3000/user/bot/getlist/",
      type: "get",
      headers: {
        Authorization: "Bearer " + store.state.user.token,
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      },
    });
  },
};
</script>
<style scoped></style>
