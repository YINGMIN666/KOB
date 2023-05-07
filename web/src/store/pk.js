//把socket存在一个全局变量里，存所有和pk相关的全局变量

export default {
  state: {
    status: "matching", // matching表示匹配界面，playing表示对战界面
    socket: null, //前后端连接
    opponent_username: "",
    opponent_photo: "",
    gamemap: null, //存在全局变量
  },
  getters: {},
  mutations: {
    updateSocket(state, socket) {
      state.socket = socket;
    },
    updateOpponent(state, opponent) {
      state.opponent_username = opponent.username;
      state.opponent_photo = opponent.photo;
    },
    updateStatus(state, status) {
      state.status = status;
    },
    updateGamemap(state, gamemap) {
      state.gamemap = gamemap;
    },
  },
  actions: {},
  modules: {},
};
