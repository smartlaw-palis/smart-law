module.exports = {
  networks: {
    ropsten: {
      network_id: 3,
      host: 'localhost',
      port: 8545,
      gasPrice: 22000000000
    },
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gasPrice: 22000000000
    }
  }
};
