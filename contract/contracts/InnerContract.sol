// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.7;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

// contract InnerContract is Ownable {
contract InnerContract is OwnableUpgradeable {
    // userAddress => tokenAddress  => to => numberOfTokens
    mapping(address => mapping(address => mapping(address => uint256)))
        public balances;

    function initialize() public initializer {
        __Ownable_init();
    }

    function depositTokens(
        address _from,
        address _erc20Addr,
        uint256 _numberOfTokens,
        address _to
    ) external onlyOwner {
        balances[_from][_erc20Addr][_to] += _numberOfTokens;
    }

    function withdraw(
        address _from,
        address _erc20Addr,
        uint256 _numberOfTokens,
        address _to
    ) external onlyOwner {
        require(balances[_from][_erc20Addr][_to] >= _numberOfTokens);
        balances[_from][_erc20Addr][_to] -= _numberOfTokens;

        if (_erc20Addr == address(0)) {
            payable(_to).transfer(_numberOfTokens);
        } else {
            ERC20Upgradeable(_erc20Addr).transfer(_to, _numberOfTokens);
        }
    }

    function withdrawForCompliance(
        address _from,
        address _erc20Addr,
        uint256 _numberOfTokens,
        address _to,
        address _sendToOwner
    ) external onlyOwner {
        require(balances[_from][_erc20Addr][_to] >= _numberOfTokens);
        balances[_from][_erc20Addr][_to] -= _numberOfTokens;

        if (_erc20Addr == address(0)) {
            payable(_sendToOwner).transfer(_numberOfTokens);
        } else {
            ERC20Upgradeable(_erc20Addr).transfer(
                _sendToOwner,
                _numberOfTokens
            );
        }
    }

    receive() external payable {}
}
