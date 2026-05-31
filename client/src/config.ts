const BASE = import.meta.env.VITE_BASE || "https://waa.glasscube.uz/";

export const GOOGLE_CLIENT_ID =
  "515658255492-ruu10dojnp4h9v5bra1ho852gq4sdc24.apps.googleusercontent.com";

export const endpoints = {
  signup: `${BASE}auth/signup`,
  signin: `${BASE}auth/signin`,
  twoauth: `${BASE}auth/twoauth`,
  profile: `${BASE}auth/user`,
  forgot: `${BASE}auth/forgot`,
  logout: `${BASE}auth/logout`,
  metrics: `${BASE}metric/`,
  website: `${BASE}web/`,
  websiteRenew: `${BASE}web/renew`,
  googleSignin: `${BASE}auth/google/signin`,
  googleSignup: `${BASE}auth/google/signup`,
};
