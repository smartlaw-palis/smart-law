pragma solidity ^0.4.15;

import './Owned.sol';
import './Trusteed.sol';

contract Trust is Trusteed {

  string public name;
  string public property;
  address[] beneficiaries;
  address[] dissolve;
  bool public forSale;
  uint public forSaleAmount;
  uint safetyDelay;

  function Trust(
      string _name,
      string _property,
      address _beneficiary
    )
      public
      Trusteed(msg.sender)
  {
      name = _name;
      property = _property;
      beneficiaries.push(_beneficiary);
  }

}
