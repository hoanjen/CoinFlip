import { execSync } from 'child_process';
import * as fs from 'fs';

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

async function verifyContracts() {
    try {
        // Đọc thông tin hợp đồng từ tệp JSON
        const contractInfo: ContractInfoType = JSON.parse(fs.readFileSync('./contract.json', 'utf-8'));

        // Xác minh từng hợp đồng
        await verifyContract('MyERC20Token', contractInfo.erc20Token.address, ...contractInfo.erc20Token.arguments);
        await verifyContract('RandContract', contractInfo.randContract.address);
        await verifyContract('CoinFlip', contractInfo.coinFlip.address, ...contractInfo.coinFlip.arguments);

        console.log('All contracts verified successfully!');
    } catch (error) {
        console.error('Error verifying contracts:', error);
        process.exitCode = 1;
    }
}

async function verifyContract(contractName: string, contractAddress: string, ...contractArgs: (string | number)[]) {
    try {
        console.log(`Verifying ${contractName} at ${contractAddress} on the network...`);

        // Kiểm tra và xây dựng chuỗi tham số nếu cần thiết
        const argsString = contractArgs.length > 0 ? contractArgs.join(' ') : '';

        // Thực thi lệnh Hardhat verify
        execSync(`npx hardhat verify --network sepolia ${contractAddress} ${argsString}`, {
            stdio: 'inherit',
        });

        console.log(`${contractName} verification successful!`);
    } catch (error) {
        console.error(`${contractName} verification failed:`, error);
        throw error;
    }
}

// Gọi hàm chính để xác minh hợp đồng
verifyContracts();
