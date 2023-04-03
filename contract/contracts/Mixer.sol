// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import '@openzeppelin/contracts/access/Ownable.sol';
import "./InnerContract.sol";

contract Mixer is Context, Ownable {
    mapping(address => uint8) public addressDeposits;
    address payable public currentContract;

    event NewInnerContractCreated(address);

    constructor() {
        createNewInnerContract();
    }

    function getCurrentContract() external view returns(address){
        return currentContract;
    }

    function createNewInnerContract() internal returns(address) {
        currentContract = payable( address ( new InnerContract() ) );
        emit NewInnerContractCreated(currentContract);
        return currentContract;
    }

    function depositTokens(address _erc20Addr, uint256 _numberOfTokens, address _to) external payable {
        require(msg.value >= 3 * 10**16, "Mixer: Fee to contract and min deposit balance not sent!");

        if (addressDeposits[currentContract] == 30) {
            createNewInnerContract();
        }

        if (_erc20Addr == address(0)) {
            currentContract.transfer(msg.value - 10**16);
            InnerContract(currentContract).depositTokens(_msgSender(), _erc20Addr, msg.value - 10**16, _to);
        } else {
            ERC20(_erc20Addr).transferFrom(_msgSender(), currentContract, _numberOfTokens);
            InnerContract(currentContract).depositTokens(_msgSender(), _erc20Addr, _numberOfTokens, _to);
        }

        addressDeposits[currentContract] += 1;
    }

    function withdraw(address _contractAddress, address _erc20Addr, uint256 _numberOfTokens, address _from) external {
        InnerContract(payable(_contractAddress)).withdraw(_from, _erc20Addr, _numberOfTokens, msg.sender);
    }

    receive() external payable {
        revert();
    }
}