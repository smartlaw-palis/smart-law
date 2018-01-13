pragma solidity ^0.4.15;
import './Trusteed.sol';

contract Entity is Trusteed {
    address public owner;
    address public newOwner;

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
    {
        owner = _owner;
        category = _category;
        isAccreditedInvestor = _investor;
        verified = false;
        funds = 0;
    }

    modifier ownerOnly(address _address) {
        require(_address == owner);
        _;
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

    function transferOwnership(address _sender, address _newOwner)
        public
        ownerOnly(_sender)
        trusteeOnly(msg.sender)
    {
        require(_newOwner != owner);
        newOwner = _newOwner;
    }

    function acceptOwnership(address _sender)
        public
        trusteeOnly(msg.sender)
    {
        require(_sender == newOwner);
        owner = newOwner;
        newOwner = 0x0;
    }

    function withdraw()
        public
        ownerOnly(msg.sender)
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
        ownerOnly(msg.sender)
        constant returns(uint256)
    {
        return funds;
    }

}
