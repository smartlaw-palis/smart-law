pragma solidity ^0.4.15;

import { Entity } from './Entity.sol';
import { Trust } from './Trust.sol';
import './Owned.sol';

contract SmartLawTrust is Owned {
  bool public status; // disable or enable contract

  address[] public entities;
  mapping (address => bool) addressesOfEntities;
  mapping (address => address) ownersEntity; // user address => entity address
  mapping (address => address) entityOwners; // entity address => user address

  address[] public trusts;

  event EntityCreated(address entity);
  event TrustCreated(address trust);

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

  modifier notEntityOwner(address _address) {
      require(ownersEntity[_address] == 0x0);
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

  function isEntityOwner(address _address)
      public
      constant returns (bool)
  {
      return ownersEntity[_address] != 0x0;
  }

  function entityAddress(address _owner)
      public
      constant returns (address)
  {
      return ownersEntity[_owner];
  }

  function newEntity(uint _category, bool _investor)
      public
      lawActive
      notEntityOwner(msg.sender)
  {
      Entity entity = new Entity(msg.sender, _category, _investor);
      entities.push(entity);
      addressesOfEntities[entity] = true;
      ownersEntity[msg.sender] = entity;
      entityOwners[entity] = msg.sender;
      EntityCreated(entity);
  }

  function transferEntityOwnership(address _entity, address _newOwner)
      public
      lawActive
      entityExist(_entity)
  {
      Entity entity = Entity(_entity);
      entity.transferOwnership(msg.sender, _newOwner);
  }

  function acceptEntityOwnership(address _entity)
      public
      lawActive
      entityExist(_entity)
  {
      Entity entity = Entity(_entity);
      entity.acceptOwnership(msg.sender);
      ownersEntity[msg.sender] = entity;
      delete ownersEntity[entityOwners[entity]];
      entityOwners[entity] = msg.sender;
  }

  function newTrust(string _name, string _property, address _beneficiary)
      public
      lawActive
      ownerOnly
      entityExist(_beneficiary)
  {
      Trust trust = new Trust(_name, _property, _beneficiary);
      trusts.push(trust);
      TrustCreated(trust);
  }

}
