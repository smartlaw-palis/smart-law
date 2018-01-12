

const Entity = artifacts.require('./Entity.sol');
const utils = require('./helpers/Utils');

contract('Entity', (accounts) => {
    it('verifies the Entity after construction', async () => {
        let contract = await Entity.new(accounts[1], 1, true);
        let EntityOwner = await contract.owner.call();
        assert.equal(EntityOwner, accounts[1]);
        let EntityTrustee = await contract.trustee.call();
        assert.equal(EntityTrustee, accounts[0]);
    });

    it('verifies that only trustee can verify entity', async () => {
        let contract = await Entity.new(accounts[1], 1, true);
        try {
            await contract.verify({ from: accounts[2] });
            assert(false, "didn't throw");
        }
        catch (error) {
            return utils.ensureException(error);
        }
    });

    it('verifies entity status after verify entity action', async () => {
        let contract = await Entity.new(accounts[1], 1, true);
        await contract.verify();
        let status = await contract.isVerified.call();
        assert.equal(status, true);
    });

    it('verifies that it has zero funds on new entity', async () => {
        let contract = await Entity.new(accounts[1], 1, true);
        let balance = await contract.balance.call({from: accounts[1]});
        assert.equal(Number(balance), 0);
    });

    it('verifies that only owner can withdraw funds from entity', async () => {
        let contract = await Entity.new(accounts[3], 1, true);
        try {
            await contract.withdraw({ from: accounts[2] });
            assert(false, "didn't throw");
        }
        catch (error) {
            return utils.ensureException(error);
        }
    });

    // it('verifies funds amount after withdraw funds from entity', async () => {
    //
    //     let contract = await Entity.new(accounts[2], 1, true);
    //     await contract.deposit(1000000000000000000);
    //     let balance = await contract.balance.call({from: accounts[2]});
    //     assert.equal(Number(balance), 1000000000000000000);
    //     try {
    //       await contract.withdraw({ from: accounts[2] });
    //     }
    //     catch(err) {
    //       console.log('here')
    //       console.log(err)
    //     }
    //     balance = await contract.balance.call({from: accounts[2]});
    //     assert.equal(Number(balance), 0);
    // });
});
