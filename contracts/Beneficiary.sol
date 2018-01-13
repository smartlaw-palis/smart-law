pragma solidity ^0.4.15;
import './UtilsLib.sol';

contract Beneficiary {

    address public trust;
    address public entity;
    address[] signatures;
    bool public disabled;

    function Beneficiary(address _trust, address _entity, address _signature)
        public
    {
        trust = _trust;
        entity = _entity;
        signatures.push(_signature);
        disabled = false;
    }

    modifier trustOnly {
        require(msg.sender == trust);
        _;
    }

    modifier enabledOnly {
        require(disabled == false);
        _;
    }

    function deactivate()
        public
        trustOnly
    {
        disabled = true;
    }

    function sign(address _signature)
        public
        trustOnly
        enabledOnly
    {
        if(UtilsLib.isAddressFound(signatures, _signature))
            revert();
        else
            signatures.push(_signature);
    }

    function getSignatures()
        public
        enabledOnly
        constant returns (address[])
    {
        return signatures;
    }

    function countSignatures()
        public
        enabledOnly
        constant returns (uint)
    {
        return signatures.length;
    }

}
