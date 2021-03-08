module.exports = {
  env: {
    NEXT_PUBLIC_API: process.env.API || "https://servia.herokuapp.com"
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: "secret",
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
  },
  images: {
    domains: ['http://localhost:1337','https://servia.herokuapp.com'],
  },
};
