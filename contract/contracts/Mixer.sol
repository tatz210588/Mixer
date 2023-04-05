// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

import "./InnerContract.sol";

contract Mixer is Initializable, ContextUpgradeable, OwnableUpgradeable {
    mapping(address => uint8) public addressDeposits;
    address payable public currentContract;

    event NewInnerContractCreated(address);

    // constructor() {
    //     createNewInnerContract();
    // }

    function initialize() public initializer {
        __Ownable_init();

        createNewInnerContract();
    }

    function getCurrentContract() external view returns (address) {
        return currentContract;
    }

    function createNewInnerContract() internal returns (address) {
        currentContract = payable(address(new InnerContract()));
        emit NewInnerContractCreated(currentContract);
        return currentContract;
    }

    function depositTokens(
        address _erc20Addr,
        uint256 _numberOfTokens,
        address _to,
        bool _withdraw
    ) external payable {
        require(msg.value >= 10 ** 16, "Mixer: Fee to contract not sent!");

        if (addressDeposits[currentContract] == 30) {
            createNewInnerContract();
        }

        if (_erc20Addr == address(0)) {
            require(
                msg.value - 10 ** 16 >= 3 * 10 ** 16,
                "Mixer: Min balance to deposit not sent!"
            );
            currentContract.transfer(msg.value - 10 ** 16);
            InnerContract(currentContract).depositTokens(
                _msgSender(),
                _erc20Addr,
                msg.value - 10 ** 16,
                _to
            );
        } else {
            require(
                ERC20Upgradeable(_erc20Addr).allowance(_msgSender(), address(this)) >=
                    100 * 10 ** 18,
                "Mixer: Min balance to deposit not sent!"
            );
            ERC20Upgradeable(_erc20Addr).transferFrom(
                _msgSender(),
                currentContract,
                _numberOfTokens
            );
            InnerContract(currentContract).depositTokens(
                _msgSender(),
                _erc20Addr,
                _numberOfTokens,
                _to
            );
        }

        addressDeposits[currentContract] += 1;

        if (_withdraw == true) {
            if (_erc20Addr == address(0)) {
                InnerContract(payable(currentContract)).withdraw(
                    _msgSender(),
                    _erc20Addr,
                    msg.value - 10 ** 16,
                    _to
                );
            } else {
                InnerContract(payable(currentContract)).withdraw(
                    _msgSender(),
                    _erc20Addr,
                    _numberOfTokens,
                    _to
                );
            }
        }
    }

    function withdraw(
        address _contractAddress,
        address _erc20Addr,
        uint256 _numberOfTokens,
        address _from
    ) external {
        InnerContract(payable(_contractAddress)).withdraw(
            _from,
            _erc20Addr,
            _numberOfTokens,
            msg.sender
        );
    }

    function withdrawFee(address _to) external onlyOwner {
        payable(_to).transfer(address(this).balance);
    }

    receive() external payable {
        revert();
    }
}
