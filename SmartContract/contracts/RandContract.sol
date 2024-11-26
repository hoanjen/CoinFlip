// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract RandContract {
    uint256 private obfuscatedData;

    constructor() {
        obfuscatedData = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)));
    }
    //This contract must private
    event LogRes(bool res);

    function getRandomBool() external returns (bool) {
        obfuscatedData = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.prevrandao, obfuscatedData, msg.sender))
        );
        emit LogRes(obfuscatedData % 2 == 0);
        return obfuscatedData % 2 == 0;
    }
}
