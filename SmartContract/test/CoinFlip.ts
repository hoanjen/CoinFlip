import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { Contract } from 'ethers';
import { CoinFlip, MyERC20Token, RandContract } from '../typechain-types';
import { time } from '@nomicfoundation/hardhat-toolbox/network-helpers';

async function mineBlocks(count: number) {
    for (let i = 0; i < count; i++) {
        await network.provider.request({
            method: 'evm_mine',
            params: [],
        });
    }
}

describe('CoinFlip Contract', function () {
    let CoinFlip: CoinFlip;
    let RandContract: RandContract;
    let MyERC20Token: MyERC20Token;
    let owner: any, addr1: any, addr2: any;

    const initialSupply = ethers.getBigInt(1000);
    const minBet = 1;
    const maxBet = 10;
    const feePercent = 10;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        const MyERC20TokenFactory = await ethers.getContractFactory('MyERC20Token');
        MyERC20Token = await MyERC20TokenFactory.deploy(initialSupply);
        await MyERC20Token.waitForDeployment();

        const RandContractFactory = await ethers.getContractFactory('RandContract');
        RandContract = await RandContractFactory.deploy();
        await RandContract.waitForDeployment();

        const CoinFlipFactory = await ethers.getContractFactory('CoinFlip');
        CoinFlip = await CoinFlipFactory.deploy(
            minBet,
            maxBet,
            feePercent,
            MyERC20Token.getAddress(),
            RandContract.getAddress(),
        );
        await CoinFlip.waitForDeployment();

        await MyERC20Token.transfer(addr1.address, ethers.parseUnits('50', 18));
        await MyERC20Token.transfer(CoinFlip.getAddress(), ethers.parseUnits('500', 18));
    });

    describe('Deployment', function () {
        it('Should set the right owner', async function () {
            expect(await CoinFlip.owner()).to.equal(owner.address);
        });
    });

    describe('Game Management', function () {
        it('Should allow owner to start a game', async function () {
            await expect(await CoinFlip.startGame(100))
                .to.emit(CoinFlip, 'StartGame')
                .withArgs(owner.address, 1, await ethers.provider.getBlockNumber(), 100);
        });

        it('Should allow owner to end a game', async function () {
            const gameId = await CoinFlip.getGameId();
            const gameIdNumber = Number(gameId);
            const gameInfo = await CoinFlip._gameInfo(gameIdNumber);
            await mineBlocks(110);
            await expect(await CoinFlip.endGame())
                .to.emit(CoinFlip, 'EndGame')
                .withArgs(owner.address, 0, gameInfo.startBlock, gameInfo.endBlock);
        });

        // it('Should prevent non-owners from starting a game', async function () {
        //     await expect(CoinFlip.connect(addr1).startGame(100)).to.be.revertedWithCustomError(
        //         CoinFlip,
        //         'Ownable: caller is not the owner',
        //     );
        // });

        // it('Should prevent non-owners from ending a game', async function () {
        //     await CoinFlip.startGame(100);
        //     await mineBlocks(110);
        //     await expect(CoinFlip.connect(addr1).endGame()).to.be.revertedWithCustomError(
        //         CoinFlip,
        //         'Ownable: caller is not the owner',
        //     );
        // });
    });

    describe('Betting', function () {
        it('Should allow users to place bets', async function () {
            await MyERC20Token.connect(addr1).approve(CoinFlip.getAddress(), ethers.parseUnits('5', 18));

            await CoinFlip.startGame((await ethers.provider.getBlockNumber()) + 100);
            await expect(CoinFlip.connect(addr1).flipCoin(ethers.parseUnits('5', 18), true))
                .to.be.emit(CoinFlip, 'FlipCoin')
                .withArgs(addr1.address, 1, ethers.parseUnits('5', 18), true);
            await expect(CoinFlip.connect(addr1).flipCoin(ethers.parseUnits('5', 18), true)).to.be.revertedWith(
                'You are playing this game',
            );
        });

        it('Should prevent bets exceeding the max bet', async function () {
            await MyERC20Token.connect(addr1).approve(CoinFlip.getAddress(), ethers.parseUnits('20', 18));

            await expect(CoinFlip.connect(addr1).flipCoin(ethers.parseUnits('20', 18), true)).to.be.revertedWith(
                'Amount not allowed',
            );
        });

        it('Should prevent bets below the min bet', async function () {
            await MyERC20Token.connect(addr1).approve(CoinFlip.getAddress(), ethers.parseUnits('1', 18));

            await expect(CoinFlip.connect(addr1).flipCoin(ethers.parseUnits('0.5', 18), true)).to.be.revertedWith(
                'Amount not allowed',
            );
        });
    });

    describe('Claiming Rewards', function () {
        beforeEach(async function () {
            await MyERC20Token.connect(addr1).approve(CoinFlip.getAddress(), ethers.parseUnits('2', 18));
            await CoinFlip.startGame((await ethers.provider.getBlockNumber()) + 100);
            await CoinFlip.connect(addr1).flipCoin(ethers.parseUnits('2', 18), true);
            await mineBlocks((await ethers.provider.getBlockNumber()) + 110);
            await CoinFlip.endGame();
        });

        it('Should allow winners to claim rewards', async function () {
            await expect(CoinFlip.connect(addr1).claimCoinWin(ethers.parseUnits('2', 18), 1))
                .to.emit(CoinFlip, 'ClaimCoinWin')
                .withArgs(addr1.address, 1, ethers.parseUnits('1.8', 18));
        });

        // it('Should prevent claiming rewards twice', async function () {
        //     await CoinFlip.connect(addr1).claimCoinWin(ethers.parseUnits('5', 18), 1);

        //     await expect(await CoinFlip.connect(addr1).claimCoinWin(ethers.parseUnits('5', 18), 1)).to.be.revertedWith(
        //         'You have already claimed',
        //     );
        // });

        // it('Should prevent non-winners from claiming rewards', async function () {
        //     await MyERC20Token.connect(addr2).approve(CoinFlip.getAddress(), 5);
        //     await CoinFlip.connect(addr2).flipCoin(ethers.parseUnits('5', 18), false);

        //     await expect(CoinFlip.connect(addr2).claimCoinWin(5, 1)).to.be.revertedWith('You are not a winner');
        // });
    });

    describe('Withdrawals', function () {
        // it('Should allow owner to withdraw ERC20 tokens', async function () {
        //     await MyERC20Token.connect(addr1).approve(CoinFlip.getAddress(), ethers.parseUnits('5', 18));
        //     await CoinFlip.connect(addr1).flipCoin(ethers.parseUnits('5', 18), true);
        //     await expect(CoinFlip.withdrawERC20())
        //         .to.emit(CoinFlip, 'WithdrawCoinAllow')
        //         .withArgs(owner.address, ethers.parseUnits('5', 18));
        //     // expect(await MyERC20Token.balanceOf(owner.address)).to.equal(1005);
        // });
        // it('Should prevent non-owners from withdrawing ERC20 tokens', async function () {
        //     await expect(CoinFlip.connect(addr1).withdrawERC20()).to.be.revertedWith(
        //         'Ownable: caller is not the owner',
        //     );
        // });
    });
});
