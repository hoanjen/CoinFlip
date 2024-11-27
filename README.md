# CoinFlip

CoinFlip is a blockchain-based project that allows users to place bets and test their luck by flipping a coin.

## 📂 Project Structure

The project consists of three main components:

- **Backend**: API to handle transactions and business logic.
- **Frontend**: User interface for placing bets and viewing results.
- **SmartContract**: Smart contract deployed on the blockchain to ensure transparency and security.

## 🚀 Key Features

1. Users place bets using cryptocurrency.
2. Smart contract processes the random result.
3. Results are displayed instantly on the interface.
4. Betting history and results are stored transparently.

## 🛠️ Technologies Used

- **Frontend**: React.js(depending on the project)
- **Backend**: Node.js, Express.js
- **SmartContract**: Solidity, Hardhat
- **Blockchain**: Ethereum or EVM-compatible blockchain
- **Database**: MongoDB

## 📦 Installation and Setup

### Prerequisites:

- Node.js (v16+)
- Hardhat (for smart contracts)
- Blockchain Node (Ganache or RPC URL of a blockchain network)

### Setup Instructions:

1. Clone the repository:

```bash
   git clone https://github.com/hoanjen/CoinFlip.git
   cd CoinFlip
```

2. Setup the Backend:

```bash
   cd Backend
   npm install
   npm run start
```

3. Setup the Frontend:

```bash
   cd Frontend
   npm install
   npm run start
```

4. Deploy the Smart Contract:

```bash
    cd SmartContract
    npm install
    npx hardhat contract:compile
    npx haraht contract:test
    npx hardhat contract:deploy
    npx haraht contract:very
```
