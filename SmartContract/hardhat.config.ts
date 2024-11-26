import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-verify';
import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/types';
dotenv.config();
const { ALCHEMY_HTTPS_URL, SEPOLIA_PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

const config: HardhatUserConfig = {
    solidity: {
        version: '0.8.27',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        sepolia: {
            url: ALCHEMY_HTTPS_URL,
            accounts: [SEPOLIA_PRIVATE_KEY ? SEPOLIA_PRIVATE_KEY : ''],
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    typechain: {
        outDir: 'typechain-types',
    },
};

export default config;
