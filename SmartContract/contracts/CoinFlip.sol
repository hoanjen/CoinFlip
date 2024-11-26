// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { IRandContract } from './IRandContract.sol';

contract CoinFlip is Ownable {
    struct GamePlay {
        uint256 amount;
        bool isHeads;
        bool isClaim;
    }

    struct GameInfo {
        bool gameOver;
        bool result;
        uint256 startBlock;
        uint256 endBlock;
    }

    IERC20 private coinERC20Allow;
    IRandContract private randContract;

    bool private _gameEnabled;
    uint256 private _currentGameId;
    uint256 private _minBet;
    uint256 private _maxBet;
    uint256 private _feePercent;
    uint256 private _feeDecimal;

    mapping(uint256 => GameInfo) public _gameInfo;

    mapping(uint256 => mapping(address => GamePlay)) public _bettors;

    event SetGameEnabled(address sender, uint256 gameEnabled);
    event SetMinBet(address sender, uint256 miNBet);
    event SetMaxBet(address sender, uint256 maxBet);
    event SetFee(address sender, uint256 feePercent);
    event ClaimCoinWin(address indexed sender, uint256 indexed gameId, uint256 amount);
    event StartGame(address sender, uint256 indexed gameId, uint256 startBlock, uint256 endBlock);
    event EndGame(address sender, uint256 indexed gameId, uint256 startBlock, uint256 endBlock);
    event FlipCoin(address indexed sender, uint256 indexed gameId, uint amount, bool isHeads);
    event WithdrawCoinAllow(address indexed sender, uint256 amount);

    constructor(
        uint256 minBet_,
        uint256 maxBet_,
        uint256 feePercent_,
        address coinERC20Allow_,
        address randContract_
    ) Ownable(msg.sender) {
        _minBet = minBet_ * 10 ** 18;
        _maxBet = maxBet_ * 10 ** 18;
        _feePercent = feePercent_;
        _gameEnabled = true;
        coinERC20Allow = IERC20(coinERC20Allow_);
        randContract = IRandContract(randContract_);
        _currentGameId = 0;
        _gameInfo[_currentGameId] = GameInfo({
            gameOver: true,
            result: false,
            startBlock: block.number,
            endBlock: block.number
        });
    }

    receive() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function setGameEnabled(bool gameEnabled_) external onlyOwner {
        _gameEnabled = gameEnabled_;
    }

    function setMinBet(uint256 minBet_) external onlyOwner {
        _minBet = minBet_;
    }

    function setMaxBet(uint256 maxBet_) external onlyOwner {
        _maxBet = maxBet_;
    }

    function getGameId() external view returns (uint256) {
        return _currentGameId;
    }

    function getGameEnabled() external view returns (bool) {
        return _gameEnabled;
    }

    function calculateFee(uint256 amount_) internal view returns (uint256) {
        uint256 fee = (amount_ * _feePercent) / 100;
        return fee;
    }

    function setFee(uint256 feePercent_) external onlyOwner {
        _feePercent = feePercent_;
        emit SetFee(msg.sender, feePercent_);
    }
    function flipCoin(uint256 amount_, bool isHeads_) external {
        require(_gameEnabled, 'Game is not enabled');
        require(amount_ <= _maxBet && amount_ >= _minBet, 'Amount not allowed');
        require(coinERC20Allow.balanceOf(msg.sender) >= amount_, 'Amount allowance is not enough');
        require(block.number < _gameInfo[_currentGameId].endBlock, 'Game is over');
        require(amount_ <= coinERC20Allow.balanceOf(address(this)), 'Balance of contract run out');
        if (_bettors[_currentGameId][msg.sender].amount > 0) {
            revert('You are playing this game');
        }
        coinERC20Allow.transferFrom(msg.sender, address(this), amount_);
        _bettors[_currentGameId][msg.sender] = GamePlay({ amount: amount_, isHeads: isHeads_, isClaim: false });
        emit FlipCoin(msg.sender, _currentGameId, amount_, isHeads_);
    }

    function claimCoinWin(uint256 amount_, uint256 gameId_) external {
        require(_gameInfo[_currentGameId].gameOver, 'Game is not over');
        require(_gameInfo[gameId_].result == _bettors[gameId_][msg.sender].isHeads, 'You are not a winner');
        require(!_bettors[gameId_][msg.sender].isClaim, 'You have already claimed');
        require(_bettors[gameId_][msg.sender].amount == amount_, 'Amount incorrect');

        uint256 amountWin = amount_ - calculateFee(amount_);

        coinERC20Allow.transfer(msg.sender, amountWin);

        emit ClaimCoinWin(msg.sender, gameId_, amountWin);
    }

    function startGame(uint256 endBlock_) external onlyOwner {
        require(_gameInfo[_currentGameId].gameOver, 'Previous game is not over');
        _gameInfo[++_currentGameId] = GameInfo({
            gameOver: false,
            result: false,
            startBlock: block.number,
            endBlock: endBlock_
        });
        emit StartGame(msg.sender, _currentGameId, block.number, endBlock_);
    }

    function endGame() external onlyOwner {
        require(block.number > _gameInfo[_currentGameId].endBlock, 'Game is not over');
        _gameInfo[_currentGameId].result = randContract.getRandomBool();
        _gameInfo[_currentGameId].gameOver = true;
        emit EndGame(
            msg.sender,
            _currentGameId,
            _gameInfo[_currentGameId].startBlock,
            _gameInfo[_currentGameId].endBlock
        );
    }

    function withdrawERC20() external onlyOwner {
        uint256 balance = coinERC20Allow.balanceOf(address(this));
        require(balance > 0, 'No tokens to withdraw');

        require(coinERC20Allow.transfer(owner(), balance), 'Transfer failed');

        emit WithdrawCoinAllow(msg.sender, balance);
    }
}
