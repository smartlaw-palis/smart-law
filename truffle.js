module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    ropsten: {
      network_id: 3,
      host: 'localhost',
      port: 8545,
      gas: 4000000,
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
