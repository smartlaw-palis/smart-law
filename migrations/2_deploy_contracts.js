const UtilsLib = artifacts.require("./UtilsLib.sol");
const Owned = artifacts.require("./Owned.sol");
const Trusteed = artifacts.require("./Trusteed.sol");
const Beneficiary = artifacts.require("./Beneficiary.sol");
const Entity = artifacts.require("./Entity.sol");
const Trust = artifacts.require("./Trust.sol");
const SmartLawTrust = artifacts.require("./SmartLawTrust.sol");

module.exports = async (deployer) => {
  deployer.deploy(UtilsLib);
  deployer.link(UtilsLib, Beneficiary);
  deployer.link(UtilsLib, Trust);
  deployer.link(UtilsLib, SmartLawTrust);
  deployer.deploy(Trusteed);
  deployer.deploy(Owned);
  deployer.deploy(Beneficiary);
  deployer.deploy(Entity);
  deployer.deploy(Trust);
  deployer.deploy(SmartLawTrust);
};
