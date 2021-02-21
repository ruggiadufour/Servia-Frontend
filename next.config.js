module.exports = {
  env: {
    NEXT_PUBLIC_API: "http://localhost:1337"
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: "secret",
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    API: "https://prueba-3.herokuapp.com",
  },
  images: {
    domains: ['http://localhost:1337'],
  },
};
