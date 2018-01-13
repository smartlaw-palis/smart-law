
const SmartLawTrust = artifacts.require('./SmartLawTrust.sol');
const Entity = artifacts.require('./Entity.sol');
const Trust = artifacts.require('./Trust.sol');
const utils = require('./helpers/Utils');

contract('SmartLawTrust', (accounts) => {
    it('verifies the SmartLawTrust after construction', async () => {
        let contract = await SmartLawTrust.new();
        let owner = await contract.owner.call();
        assert.equal(owner, accounts[0]);
        let status = await contract.status.call();
        assert.equal(status, true);
    });

    it('verifies that only owner can deactivate or activate contract', async () => {
        let contract = await SmartLawTrust.new();
        try {
            await contract.updateStatus(true, {from: accounts[8]});
            assert(false, "didn't throw");
        }
        catch (error) {
            return utils.ensureException(error);
        }
    });

    it('verifies contract status after owner deactivate or activate contract', async () => {
        let contract = await SmartLawTrust.new();
        await contract.updateStatus(false);
        let status = await contract.status.call();
        assert.equal(status, false);
        await contract.updateStatus(true);
        status = await contract.status.call();
        assert.equal(status, true);
    });

    it('verifies that an address is not an entity owner', async () => {
        let contract = await SmartLawTrust.new();
        let res = await contract.isEntityOwner(accounts[1]);
        assert.equal(res, false);
    });

    it('verifies that an address is an entity owner', async () => {
        let contract = await SmartLawTrust.new();
        let entity = await contract.newEntity(1, true, {from: accounts[1]});
        let res = await contract.isEntityOwner(accounts[1]);
        assert.equal(res, true);
    });

    it('verifies that an address has empty entity address', async () => {
        let contract = await SmartLawTrust.new();
        let res = await contract.entityAddress(accounts[1]);
        assert.equal(res, utils.zeroAddress);
    });

    it('verifies that an address has an entity address', async () => {
        let contract = await SmartLawTrust.new();
        let entity = await contract.newEntity(1, true, {from: accounts[1]});
        let res = await contract.entityAddress(accounts[1]);
        assert.equal(res, entity.logs[0].args.entity);
    });

    it('verifies that new entity fires an EntityCreated event', async () => {
        let contract = await SmartLawTrust.new();
        let res = await contract.newEntity(1, true, {from: accounts[1]});
        assert(res.logs.length > 0 && res.logs[0].event == 'EntityCreated');
    });

    it('verifies that only active contract can create entity', async () => {
        let contract = await SmartLawTrust.new();
        await contract.updateStatus(false);
        try {
            await contract.newEntity(1, true, {from: accounts[1]});
            assert(false, "didn't throw");
        }
        catch (error) {
            return utils.ensureException(error);
        }
    });

    it('verifies that entity does not duplicate', async () => {
        let contract = await SmartLawTrust.new();
        await contract.newEntity(1, true, {from: accounts[1]});
        try {
            await contract.newEntity(1, true, {from: accounts[1]});
            assert(false, "didn't throw");
        }
        catch (error) {
            return utils.ensureException(error);
        }
    });

    it('should create new entity', async () => {
        let contract = await SmartLawTrust.new();
        let entity = await contract.newEntity(1, true, {from: accounts[1]});
        let entityContract = await Entity.at(entity.logs[0].args.entity);
        let EntityOwner = await entityContract.owner.call();
        assert.equal(EntityOwner, accounts[1]);
        let EntityTrustee = await entityContract.trustee.call();
        assert.equal(EntityTrustee, contract.address);
    });

    it('verifies that ownership transfer is not initiated when entity address is not existing entity', async () => {
        let contract = await SmartLawTrust.new();
        let entity = await contract.newEntity(1, true, {from: accounts[1]});
        try {
            await contract.transferEntityOwnership(accounts[3], accounts[2], {from: accounts[1]});
            assert(false, "didn't throw");
        }
        catch (error) {
            return utils.ensureException(error);
        }
    });

    it('verifies that only active contract can initiate ownership transfer', async () => {
        let contract = await SmartLawTrust.new();
        let entity = await contract.newEntity(1, true, {from: accounts[1]});
        await contract.updateStatus(false);
        try {
            await contract.transferEntityOwnership(entity.logs[0].args.entity, accounts[2], {from: accounts[1]});
            assert(false, "didn't throw");
        }
        catch (error) {
            return utils.ensureException(error);
        }
    });

    it('verifies the new owner after ownership transfer', async () => {
        let contract = await SmartLawTrust.new();
        let entity = await contract.newEntity(1, true, {from: accounts[1]});
        await contract.transferEntityOwnership(entity.logs[0].args.entity, accounts[2], {from: accounts[1]});
        let entityContract = await Entity.at(entity.logs[0].args.entity);
        let EntityNewOwner = await entityContract.newOwner.call();
        assert.equal(EntityNewOwner, accounts[2]);
    });

    it('verifies that ownership acceptance is not initiated when entity address is not existing entity', async () => {
        let contract = await SmartLawTrust.new();
        let entity = await contract.newEntity(1, true, {from: accounts[1]});
        try {
            await contract.transferEntityOwnership(accounts[3], accounts[2], {from: accounts[1]});
            assert(false, "didn't throw");
        }
        catch (error) {
            return utils.ensureException(error);
        }
    });

    it('verifies that only active contract can initiate ownership acceptance', async () => {
        let contract = await SmartLawTrust.new();
        let entity = await contract.newEntity(1, true, {from: accounts[1]});
        await contract.updateStatus(false);
        try {
            await contract.transferEntityOwnership(entity.logs[0].args.entity, accounts[2], {from: accounts[1]});
            assert(false, "didn't throw");
        }
        catch (error) {
            return utils.ensureException(error);
        }
    });

    it('verifies the new owner after ownership acceptance', async () => {
        let contract = await SmartLawTrust.new();
        let entity = await contract.newEntity(1, true, {from: accounts[1]});
        await contract.transferEntityOwnership(entity.logs[0].args.entity, accounts[2], {from: accounts[1]});
        await contract.acceptEntityOwnership(entity.logs[0].args.entity, {from: accounts[2]});
        let entityContract = await Entity.at(entity.logs[0].args.entity);
        let EntityOwner = await entityContract.owner.call();
        assert.equal(EntityOwner, accounts[2]);
        let res = await contract.isEntityOwner(accounts[2]);
        assert.equal(res, true);
        res = await contract.isEntityOwner(accounts[1]);
        assert.equal(res, false);
    });

    it('verifies that trust is not created when beneficiary is not an entity', async () => {
        let contract = await SmartLawTrust.new({from: accounts[0]});
        try {
            await contract.newTrust('Test Trust', 'Test Property', accounts[9], {
              from: accounts[0]
            });
            assert(false, "didn't throw");
        }
        catch (error) {
            return utils.ensureException(error);
        }
    });

    it('verifies that only active contract can create trust', async () => {
        let contract = await SmartLawTrust.new();
        let entity = await contract.newEntity(1, true, {from: accounts[9]});
        await contract.updateStatus(false);
        try {
            await contract.newTrust('Test Trust', 'Test Property', entity.logs[0].args.entity, {
              from: accounts[9]
            });
            assert(false, "didn't throw");
        }
        catch (error) {
            return utils.ensureException(error);
        }
    });

    it('verifies that only smart trust owner can create trust', async () => {
        let contract = await SmartLawTrust.new({from: accounts[0]});
        let entity = await contract.newEntity(1, true, {from: accounts[1]});
        try {
            await contract.newTrust('Test Trust', 'Test Property', entity.logs[0].args.entity, {
              from: accounts[2]
            });
            assert(false, "didn't throw");
        }
        catch (error) {
            return utils.ensureException(error);
        }
    });

    it('should create trust', async () => {
        let contract = await SmartLawTrust.new({from: accounts[0]});
        let entity = await contract.newEntity(1, true, {from: accounts[1]});
        let trust = await contract.newTrust('Test Trust', 'Test Property', entity.logs[0].args.entity, {
            from: accounts[0]
        });
        let trustContract = await Trust.at(trust.logs[0].args.trust);
        let TrustName = await trustContract.name.call();
        assert.equal(TrustName, 'Test Trust');
        let TrustProperty = await trustContract.property.call();
        assert.equal(TrustProperty, 'Test Property');
    });
});
