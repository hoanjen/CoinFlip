import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import config from '../config/config';
import contractJson from '../contract.json';
import synchronizeService from '../services/synchronize.service';
import transactionService from '../services/transaction.service';
import { EventLog } from 'web3/types';
import bettingService from '../services/betting.service';
const web3 = new Web3(config.onchain.network_rpc_url);

const contracts: Record<string, Contract<any>> = {
    // erc20Token: new web3.eth.Contract(contractJson.erc20Token.abi, contractJson.erc20Token.address),
    coinFlip: new web3.eth.Contract(contractJson.coinFlip.abi, contractJson.coinFlip.address),
};

const onJobGetDataFromSmartContract = async (): Promise<void> => {
    try {
        const currentBlock = await web3.eth.getBlockNumber();
        console.log('Current block onchain:', currentBlock);

        const lastSynchronized = await synchronizeService.getLastSynchronize();
        const lastBlockSynchronized = lastSynchronized
            ? Number(lastSynchronized.toBlock) + 1
            : config.onchain.block_number_start;
        const lastBlockOnchain = Math.min(Number(currentBlock), lastBlockSynchronized + 10000);

        //   await synchronize(lastBlockSynchronized, lastBlockOnchain);
    } catch (err) {
        console.error(err);
    }
};

const synchronize = async (startBlock: number, endBlock: number) => {
    console.log(`👂 Listen from block ${startBlock} to ${endBlock}`);

    const getPastEventsConfig = { fromBlock: startBlock, toBlock: endBlock };

    const synchronize = await synchronizeService.createSynchronize(getPastEventsConfig);

    for (const contractName in contracts) {
        const contract = contracts[contractName];
        const listEvents: any = await contract.getPastEvents('allEvents', getPastEventsConfig);

        const sortedEvents = listEvents.sort((a: any, b: any) => Number(a.blockNumber) - Number(b.blockNumber));
        // console.log('Transactions ' + contractName + ':', sortedEvents);
        for (const event of sortedEvents) {
            const block = await web3.eth.getBlock(event.blockNumber);
            await transactionService.createTransaction({
                contractAddress: event.address,
                transactionHash: event.transactionHash,
                blockHash: event.blockHash,
                blockNumber: Number(event.blockNumber),
                eventName: event.event,
                sender: '',
                receiver: '',
                blockTimeStamp: Number(block.timestamp),
                synchronize: synchronize.id,
            });
            event.blockTimeStamp = block.timestamp;

            switch (contractName) {
                case 'coinFlip':
                    await handleSyncCoinFlip(event, contract);
                    break;
                default:
                    break;
            }
        }
    }
};

const handleSyncCoinFlip = async (event: any, contract: Contract<any>) => {
    const eventName = event.event;
    const contractAddress = contractJson.coinFlip.address;
    const blockTimeStamp = event.blockTimeStamp;
    switch (eventName) {
        case 'StartGame': {
            const { sender, gameId, startBlock, endBlock } = event.returnValues;
            await bettingService.createBetting(sender, gameId, startBlock, endBlock, blockTimeStamp);
            break;
        }

        case 'FlipCoin': {
            const { sender, gameId, amount, isHeads } = event.returnValues;
            await bettingService.createBettor(sender, gameId, amount, isHeads, blockTimeStamp, event.transactionHash);
            break;
        }
        case 'EndGame': {
            const { gameId } = event.returnValues;
            await bettingService.updateBetting(gameId);
            break;
        }
        default:
            break;
    }
};

async function getContractEvents(blockA: number, blockB: number) {
    synchronize(7127342, 7128342);
}

export { getContractEvents };
