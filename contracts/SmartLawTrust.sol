pragma solidity ^0.4.15;

import { Entity } from './Entity.sol';
import './Owned.sol';

contract SmartLawTrust is Owned {
  bool public status; // disable or enable contract

  address[] public entities;
  mapping (address => bool) addressesOfEntities;

  event EntityCreated(address _entity);

  function SmartLawTrust()
      public
      Owned(msg.sender)
  {
      status = true;
  }

  modifier lawActive() {
      require(status);
      _;
  }

  modifier entityExist(address _address) {
      require(addressesOfEntities[_address]);
      _;
  }

  modifier entityNotExist(address _address) {
      require(!addressesOfEntities[_address]);
      _;
  }

  function updateStatus(bool _disable)
      public
      ownerOnly
  {
      status = _disable;
  }

  function isEntity(address _address)
      public
      constant returns (bool)
  {
      return addressesOfEntities[_address];
  }

  function newEntity(
      uint _category,
      bool _investor
  )
      public
      lawActive
      entityNotExist(msg.sender)
  {
      Entity entity = new Entity(msg.sender, _category, _investor);
      entities.push(entity);
      addressesOfEntities[msg.sender] = true;
      EntityCreated(entity);
  }

}
