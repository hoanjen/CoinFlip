import { ethers } from 'ethers';
import contractJson from '../contract.json';
import config from '../config/config';
import balanceService from '../services/balance.service';

const provider = new ethers.JsonRpcProvider(config.onchain.network_rpc_url);

const contract = {
    erc20Token: new ethers.Contract(contractJson.erc20Token.address, contractJson.erc20Token.abi),
};

const getBalanceOnchain = async (address: string) => {
    const nativeCoinQuantity = await provider.getBalance(address);
    const tokenAllowQuantity = await provider.getBalance(contract.erc20Token.getAddress());
    const latestBlock = await provider.getBlock('latest');
    return {
        nativeCoinQuantity,
        tokenAllowQuantity,
        tokenAllow: await contract.erc20Token.name(),
        blockTimeStamp: latestBlock?.timestamp ? latestBlock.timestamp : Date.now(),
    };
};
async function getContractEvents(blockA: number, blockB: number) {
    // try {
    //
    //     const filter = {
    //         address: contract.erc20Token.getAddress(),
    //         fromBlock: blockA,
    //         toBlock: blockB,
    //     };
    //
    //     const logs = await provider.getLogs(filter);
    //
    //     // Parse logs sử dụng ABI của contract
    //     const events = logs.map((log) => {
    //         return contract.erc20Token.interface.parseLog(log);
    //     });
    //
    //     events.forEach((event, index) => {
    //         console.log(`Event #${index + 1}:`, event);
    //     });
    // } catch (error) {
    //     console.error('Error fetching events:', error);
    // }
}

export { getContractEvents, getBalanceOnchain };
