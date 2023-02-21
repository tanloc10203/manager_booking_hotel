import instance from "./axios";

const url = "/auth";

const authAPI = {
  signIn(data) {
    return instance.post(url + "/sign-in", data);
  },

  signUp(data) {
    return instance.post(url + "/sign-up", data);
  },

  signOut() {
    return instance.post(url + "/sign-out");
  },

  refreshToken() {
    return instance.get(url + "/refresh-token");
  },

  getUserSignInWithGoogle() {
    return instance.get(url + "/get/oauth2/google");
  },

  getCurrentUser(accessToken) {
    return instance.get(url + "/sign-in", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
  },
};

export default authAPI;
