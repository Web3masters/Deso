
const Web3 = require("web3");
const HDWalletProvider = require('@truffle/hdwallet-provider');
const url = "https://api.avax-test.network/ext/bc/C/rpc";
const privateKeys = [
  "0x"
];

module.exports = {

  networks: {

    fuji: {
      provider: () => {
        return new HDWalletProvider({
          privateKeys: privateKeys,
          url: url,
        });
      },
      network_id: "43113",
      gas: 3000000,
      gasPrice: 225000000000,
    },
  },

  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.20",      

    }
  },
};
