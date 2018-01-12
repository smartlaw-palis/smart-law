const Owned = artifacts.require("./Owned.sol");
const Trusteed = artifacts.require("./Trusteed.sol");
const Entity = artifacts.require("./Entity.sol");
const SmartLawTrust = artifacts.require("./SmartLawTrust.sol");

module.exports = async (deployer) => {
  deployer.deploy(Owned);
  deployer.deploy(Trusteed);
  deployer.deploy(Entity);
  deployer.deploy(SmartLawTrust);
};
