// const withPWA = require('next-pwa')
// const runtimeCaching = require('next-pwa/cache')

module.exports = {
  env: {
    NEXT_PUBLIC_API: process.env.API || "http://localhost:1337" //"https://servia.herokuapp.com"
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
  // withPWA({
  //   pwa: {
  //     dest: 'public',
  //     runtimeCaching,
  //   },
  // })
};

// module.exports = withPWA({
//   pwa: {
//     dest: "public",
//     runtimeCaching,
//   },
//   env: {
//     NEXT_PUBLIC_API: process.env.API || "http://localhost:1337", //"https://servia.herokuapp.com"
//   },
//   serverRuntimeConfig: {
//     // Will only be available on the server side
//     mySecret: "secret",
//   },
//   publicRuntimeConfig: {
//     // Will be available on both server and client
//   },
//   images: {
//     domains: ["http://localhost:1337", "https://servia.herokuapp.com"],
//   },
// });


