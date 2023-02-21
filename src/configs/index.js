const config = {
  server: {
    url: import.meta.env.VITE_END_POINT,
  },
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    urlRedirect: import.meta.env.VITE_END_POINT + "/api/v1/auth/oauth2/google",
  },
  localStorage: {
    signInWithGoole: "signInWithGoole",
  },
};

export default config;
