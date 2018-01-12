pragma solidity ^0.4.15;
import './Owned.sol';
import './Trusteed.sol';

contract Entity is Owned, Trusteed {

    uint funds; // wei

    uint public category;
    bool public isAccreditedInvestor;
    bool public verified;

    function Entity(
        address _owner,
        uint _category,
        bool _investor
      )
        public
        Trusteed(msg.sender)
        Owned(_owner)
    {
        category = _category;
        isAccreditedInvestor = _investor;
        verified = false;
        funds = 0;
    }

    function() payable {
      funds += msg.value;
    }

    function verify()
        public
        trusteeOnly(msg.sender)
    {
        verified = true;
    }

    function withdraw()
        public
        ownerOnly
    {
        var amount = funds;
        funds = 0;
        if(!msg.sender.send(amount))
          funds = amount;
    }

    function deposit()
        public
        payable
    {
        funds += msg.value;
    }

    function balance()
        public
        ownerOnly
        constant returns(uint256)
    {
        return funds;
    }

}
