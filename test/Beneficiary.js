const Beneficiary = artifacts.require('./Beneficiary.sol');
const utils = require('./helpers/Utils');

contract('Beneficiary', (accounts) => {
    it('verifies the beneficiary after construction', async () => {
        let contract = await Beneficiary.new(accounts[1], accounts[2], accounts[0]);
        let trust = await contract.trust.call();
        assert.equal(trust, accounts[1]);
        let entity = await contract.entity.call();
        assert.equal(entity, accounts[2]);
        let signatures = await contract.getSignatures.call();
        assert.equal(signatures.length, 1);
    });

    it('verifies that only a trust can initiate deactivate', async () => {
        let contract = await Beneficiary.new(accounts[1], accounts[2], accounts[0]);
        try {
            await contract.deactivate({ from: accounts[2] });
            assert(false, "didn't throw");
        }
        catch (error) {
            return utils.ensureException(error);
        }
    });

    it('verifies status after deactivate', async () => {
        let contract = await Beneficiary.new(accounts[1], accounts[2], accounts[0]);
        await contract.deactivate({from: accounts[1]});
        let status = await contract.disabled.call();
        assert.equal(status, true);
    });

    it('verifies that once disabled, it cannot initiate sign', async () => {
        let contract = await Beneficiary.new(accounts[1], accounts[2], accounts[0]);
        await contract.deactivate({from: accounts[1]});
        try {
            await contract.sign(accounts[1], { from: accounts[1] });
            assert(false, "didn't throw");
        }
        catch (error) {
            return utils.ensureException(error);
        }
    });

    it('verifies that only a trust can initiate sign', async () => {
        let contract = await Beneficiary.new(accounts[1], accounts[2], accounts[0]);
        try {
            await contract.sign(accounts[1], { from: accounts[2] });
            assert(false, "didn't throw");
        }
        catch (error) {
            return utils.ensureException(error);
        }
    });

    it('verifies that it will not duplicate signature', async () => {
        let contract = await Beneficiary.new(accounts[1], accounts[2], accounts[0]);
        try {
            await contract.sign(accounts[0], { from: accounts[1] });
            assert(false, "didn't throw");
        }
        catch (error) {
            return utils.ensureException(error);
        }
    });

    it('should add signature', async () => {
        let contract = await Beneficiary.new(accounts[1], accounts[2], accounts[0]);
        await contract.sign(accounts[2], { from: accounts[1] });
        let signatures = await contract.getSignatures.call();
        assert.equal(signatures.length, 2);
    });
});
