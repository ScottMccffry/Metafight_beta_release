require("@nomiclabs/hardhat-waffle");

// Go to https://www.alchemyapi.io, sign up, create a new App in its dashboard, and replace "YOUR_API_URL" with its key
// Or you can use Infura or another service that provides Ethereum node connections
const ALCHEMY_API_KEY = "https://goerli.infura.io/v3/f942c5a13e29429a9d86a14e002fc372"
// Replace this private key with your Goerli account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const GOERLI_PRIVATE_KEY = "5e45497b9735369e8092aacb17bf97b9db8add9658112d6bc9740a6f714bc311";

module.exports = {
  solidity: "0.8.20",
  networks: {
    goerli: {
      url: ALCHEMY_API_KEY,
      accounts: [`0x${GOERLI_PRIVATE_KEY}`]
    }
  }
};
