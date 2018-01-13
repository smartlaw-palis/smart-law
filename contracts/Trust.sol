pragma solidity ^0.4.15;

import './UtilsLib.sol';
import './Owned.sol';
import './Trusteed.sol';
import { Beneficiary } from './Beneficiary.sol';
import { SmartLawTrust } from './SmartLawTrust.sol';

contract Trust is Trusteed {

  string public name;
  string public property;
  address[] beneficiaries;
  address[] pendingBeneficiaries;
  address[] sales;
  address[] dissolve;
  bool public forSale;
  uint public forSaleAmount;
  uint safetyDelay;
  bool public deleted;

  event PendingBeneficiaryAdded(address beneficiary);
  event BeneficiaryAdded(address entity);

  function Trust(string _name, string _property, address _beneficiary)
      public
      Trusteed(msg.sender)
  {
      name = _name;
      property = _property;
      beneficiaries.push(_beneficiary);
      forSaleAmount = 0;
      forSale = false;
      deleted = false;
  }

  modifier notDissolved() {
      require(deleted == false);
      _;
  }

  modifier beneficiary(address _address) {
      require(isBeneficiary(_address));
      _;
  }

  function isBeneficiary(address _address)
      public
      notDissolved
      constant returns (bool)
  {
      return UtilsLib.isAddressFound(beneficiaries, _address);
  }

  function beneficiariesSignatures()
      public
      notDissolved
      constant returns (address[])
  {
      return beneficiaries;
  }

  function getPendingBeneficiaries()
      public
      notDissolved
      constant returns (address[])
  {
      return pendingBeneficiaries;
  }

  /**
   * @dev allows adding new beneficiary entity to trust
   * @param  _entity  entity address of the existing beneficiary
   * @param  _beneficiaryEntity entity address of the new beneficiary
   */
  function newBeneficiary(address _entity, address _beneficiaryEntity)
      public
      notDissolved
      beneficiary(_entity)
  {
      SmartLawTrust smartLaw = SmartLawTrust(trustee);
      require(smartLaw.isEntity(_beneficiaryEntity));
      if(beneficiaries.length > 1) {
          Beneficiary pendingNewBeneficiary = new Beneficiary(address(this), _beneficiaryEntity, _entity);
          pendingBeneficiaries.push(pendingNewBeneficiary);
          PendingBeneficiaryAdded(pendingNewBeneficiary);
      }
      else {
          beneficiaries.push(_beneficiaryEntity);
          BeneficiaryAdded(_beneficiaryEntity);
      }
  }

  /**
   * @dev allows beneficiaries to agree to add pending beneficiary
   * @param  _entity  entity address of the existing beneficiary
   * @param  _beneficiary beneficiary address of the pending beneficiary
   */
  function agreeToAddBeneficiary(address _entity, address _beneficiary)
      public
      notDissolved
      beneficiary(_entity)
  {
      Beneficiary pendingBeneficiary = Beneficiary(_beneficiary);
      pendingBeneficiary.sign(_entity);
      if(beneficiaries.length == pendingBeneficiary.countSignatures())
      {
          beneficiaries.push(pendingBeneficiary.entity());
          pendingBeneficiary.deactivate();
      }
  }

  function dissolveSignatures()
      public
      notDissolved
      constant returns (address[])
  {
      return dissolve;
  }

  function saleOffers()
      public
      notDissolved
      constant returns (address[])
  {
      return sales;
  }

}
