const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(deployer, network, accounts) {
  // deploy the smart contracts to the blockchain
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  await deployer.deploy(DappToken)
  const dappToken = await DappToken.deployed()

  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed()

  // transfers all tokens to the farm (1 million)
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000');

  // transfers 100 Mock DAI tokens to investor
  await daiToken.transfer(accounts[1], '100000000000000000000');
};