const Trust = artifacts.require('./Trust.sol');
const SmartLawTrust = artifacts.require('./SmartLawTrust.sol');
const Beneficiary = artifacts.require('./Beneficiary.sol');
const utils = require('../helpers/Utils');

contract('Trust', (accounts) => {
    describe('agreeToAddBeneficiary()', () => {

      it('verifies that only existing trust beneficiary can sign to add new beneficiary', async () => {
          let contract = await SmartLawTrust.new();

          let entity = await contract.newEntity(1, true, {from: accounts[1]});
          let trust = await contract.newTrust('Test Trust', 'Test Property', entity.logs[0].args.entity, {
              from: accounts[0]
          });
          let trustContract = await Trust.at(trust.logs[0].args.trust);
          let entity2 = await contract.newEntity(1, true, {from: accounts[2]});
          let entity3 = await contract.newEntity(1, true, {from: accounts[3]});

          await trustContract.newBeneficiary(entity.logs[0].args.entity, entity2.logs[0].args.entity);
          let newBeneficiaryRes = await trustContract.newBeneficiary(entity.logs[0].args.entity, entity3.logs[0].args.entity);
          try {
              await trustContract.agreeToAddBeneficiary(accounts[9], newBeneficiaryRes.logs[0].args.beneficiary);
              assert(false, "didn't throw");
          }
          catch (error) {
              return utils.ensureException(error);
          }
      });

      it('should add new signature to pending beneficiary', async () => {
          let contract = await SmartLawTrust.new();

          let entity = await contract.newEntity(1, true, {from: accounts[1]});
          let trust = await contract.newTrust('Test Trust', 'Test Property', entity.logs[0].args.entity, {
              from: accounts[0]
          });
          let trustContract = await Trust.at(trust.logs[0].args.trust);
          let entity2 = await contract.newEntity(1, true, {from: accounts[2]});
          let entity3 = await contract.newEntity(1, true, {from: accounts[3]});
          let entity4 = await contract.newEntity(1, true, {from: accounts[4]});

          await trustContract.newBeneficiary(entity.logs[0].args.entity, entity2.logs[0].args.entity);
          let newBeneficiaryRes = await trustContract.newBeneficiary(entity.logs[0].args.entity, entity3.logs[0].args.entity);
          let newBeneficiaryRes2 = await trustContract.newBeneficiary(entity.logs[0].args.entity, entity4.logs[0].args.entity);
          await trustContract.agreeToAddBeneficiary(entity2.logs[0].args.entity, newBeneficiaryRes.logs[0].args.beneficiary);

          let beneficiaryContract = await Beneficiary.at(newBeneficiaryRes2.logs[0].args.beneficiary);
          let signaturesCount = await beneficiaryContract.countSignatures.call();
          assert.equal(signaturesCount, 1);
          await trustContract.agreeToAddBeneficiary(entity2.logs[0].args.entity, newBeneficiaryRes2.logs[0].args.beneficiary);
          signaturesCount = await beneficiaryContract.countSignatures.call();
          assert.equal(signaturesCount, 2);
      });

      it('should add new beneficiary', async () => {
          let contract = await SmartLawTrust.new();

          let entity = await contract.newEntity(1, true, {from: accounts[1]});
          let trust = await contract.newTrust('Test Trust', 'Test Property', entity.logs[0].args.entity, {
              from: accounts[0]
          });
          let trustContract = await Trust.at(trust.logs[0].args.trust);
          let beneficiaries = await trustContract.beneficiariesSignatures.call();
          assert.equal(beneficiaries.length, 1);
          let entity2 = await contract.newEntity(1, true, {from: accounts[2]});
          let entity3 = await contract.newEntity(1, true, {from: accounts[3]});

          await trustContract.newBeneficiary(entity.logs[0].args.entity, entity2.logs[0].args.entity);
          beneficiaries = await trustContract.beneficiariesSignatures.call();
          assert.equal(beneficiaries.length, 2);
          let newBeneficiaryRes = await trustContract.newBeneficiary(entity.logs[0].args.entity, entity3.logs[0].args.entity);

          let beneficiaryContract = await Beneficiary.at(newBeneficiaryRes.logs[0].args.beneficiary);
          let signaturesCount = await beneficiaryContract.countSignatures.call();
          await trustContract.agreeToAddBeneficiary(entity2.logs[0].args.entity, newBeneficiaryRes.logs[0].args.beneficiary);
          beneficiaries = await trustContract.beneficiariesSignatures.call();
          assert.equal(beneficiaries.length, 3);
          let isBeneficiary = await trustContract.isBeneficiary.call(entity3.logs[0].args.entity);
          assert.equal(isBeneficiary, true);
      });
    });
});
