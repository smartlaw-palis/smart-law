
const SmartLawTrust = artifacts.require('./SmartLawTrust.sol');
const Entity = artifacts.require('./Entity.sol');
const utils = require('./helpers/Utils');

contract('SmartLawTrust', (accounts) => {
    it('verifies the SmartLawTrust after construction', async () => {
        let contract = await SmartLawTrust.new({from: accounts[9]});
        let owner = await contract.owner.call();
        assert.equal(owner, accounts[9]);
        let status = await contract.status.call();
        assert.equal(status, true);
    });
    it('verifies that only owner can deactivate or activate contract', async () => {
        let contract = await SmartLawTrust.new({from: accounts[9]});
        try {
            await contract.updateStatus(true, {from: accounts[8]});
            assert(false, "didn't throw");
        }
        catch (error) {
            return utils.ensureException(error);
        }
    });
    it('verifies contract status after owner deactivate or activate contract', async () => {
        let contract = await SmartLawTrust.new({from: accounts[9]});
        await contract.updateStatus(false, {from: accounts[9]});
        let status = await contract.status.call();
        assert.equal(status, false);
        await contract.updateStatus(true, {from: accounts[9]});
        status = await contract.status.call();
        assert.equal(status, true);
    });
    it('verifies an address if already an entity', async () => {
        let contract = await SmartLawTrust.new({from: accounts[9]});
        let res = await contract.isEntity(accounts[1]);
        assert.equal(res, false);
    });
    it('verifies that new entity fires an EntityCreated event', async () => {
        let contract = await SmartLawTrust.new({from: accounts[9]});
        let res = await contract.newEntity(1, true, {from: accounts[0]});
        assert(res.logs.length > 0 && res.logs[0].event == 'EntityCreated');
    });
    it('verifies that only active contract can create entity', async () => {
        let contract = await SmartLawTrust.new({from: accounts[9]});
        await contract.updateStatus(false, {from: accounts[9]});
        try {
            await contract.newEntity(1, true, {from: accounts[1]});
            assert(false, "didn't throw");
        }
        catch (error) {
            return utils.ensureException(error);
        }
    });
    it('verifies that entity does not duplicate', async () => {
        let contract = await SmartLawTrust.new({from: accounts[9]});
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
        let contract = await SmartLawTrust.new({from: accounts[9]});
        await contract.newEntity(1, true, {from: accounts[1]});
        let res = await contract.isEntity(accounts[1]);
        assert.equal(res, true);
    });
});
