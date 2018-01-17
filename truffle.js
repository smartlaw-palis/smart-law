module.exports = {
  networks: {
    ropsten: {
      network_id: 3,
      host: 'localhost',
      port: 8545,
      gas: 4000000,
      from: 0x30a259900656F599EDEEBF1eB7E1fBf948072Ba3
    },
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gasPrice: 22000000000
    }
  }
};
