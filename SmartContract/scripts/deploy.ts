import { ethers } from 'hardhat';
import * as fs from 'fs';

import erc20TokenJson from '../artifacts/contracts/MyERC20.sol/MyERC20Token.json';
import randContractJson from '../artifacts/contracts/RandContract.sol/RandContract.json';
import coinFlipJson from '../artifacts/contracts/CoinFlip.sol/CoinFlip.json';

type ContractInfoType = {
    erc20Token: {
        address: string;
        abi: any;
        arguments: (number | string)[];
    };
    randContract: {
        address: string;
        abi: any;
    };
    coinFlip: {
        address: string;
        abi: any;
        arguments: (number | string)[];
    };
};

async function deployContracts() {
    console.log('Contracts are deploying...');

    const totalSupplyErc20: number = 1000; // 1000 token
    const playFeePercentage: number = 10; // 2.5 %
    const playFeeDecimal: number = 1;
    const minBet: number = 1;
    const maxBet: number = 10;

    const erc20Token = await deploy('MyERC20Token', [totalSupplyErc20]);
    console.log('done MyERC20Token');
    const erc20TokenAddress = await erc20Token.getAddress();

    const randContract = await deploy('RandContract', []);
    console.log('done RandContract');

    const randContractAddress = await randContract.getAddress();

    const coinFlip = await deploy('CoinFlip', [
        minBet,
        maxBet,
        playFeePercentage,
        erc20TokenAddress,
        randContractAddress,
    ]);
    console.log('done CoinFlip');

    const coinFlipAddress = await coinFlip.getAddress();

    const contractInfo = {
        erc20Token: {
            address: erc20TokenAddress,
            abi: erc20TokenJson.abi,
            arguments: [totalSupplyErc20],
        },
        randContract: {
            address: randContractAddress,
            abi: randContractJson.abi,
        },
        coinFlip: {
            address: coinFlipAddress,
            abi: coinFlipJson.abi,
            arguments: [minBet, maxBet, playFeePercentage, erc20TokenAddress, randContractAddress],
        },
    };

    writeContractInfoToJson(contractInfo);

    console.log('Contracts deployed successfully!');
    console.log('ERC20 Token:', erc20TokenAddress);
    console.log('RandContract :', randContractAddress);
    console.log('Coin FLip:', coinFlipAddress);
}

function writeContractInfoToJson(contractInfo: ContractInfoType) {
    const filePath = './contract.json';
    try {
        fs.writeFileSync(filePath, JSON.stringify(contractInfo, null, 2));
        console.log(`Contract info written to ${filePath}`);
    } catch (error) {
        console.error('Error writing contract info to JSON file:', error);
        process.exitCode = 1;
    }
}

async function deploy(contractName: string, args: (any | number)[]) {
    const contract = await ethers.deployContract(contractName, args);
    await contract.waitForDeployment();
    return contract;
}

deployContracts().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
