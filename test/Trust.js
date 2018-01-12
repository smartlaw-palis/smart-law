const Trust = artifacts.require('./Trust.sol');
const utils = require('./helpers/Utils');

contract('Trust', (accounts) => {
    it('verifies the trust after construction', async () => {
        let contract = await Trust.new('Test Trust', 'Test Property', accounts[1]);
        let trustee = await contract.trustee.call();
        assert.equal(trustee, accounts[0]);
        let name = await contract.name.call();
        assert.equal(name, 'Test Trust');
        let property = await contract.property.call();
        assert.equal(property, 'Test Property');
    });
});
