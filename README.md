# Blockchain Dapp with React and Hardhat

This is a simple blockchain Dapp that allows users to connect a wallet, check ERC20 balances and interact with wrapping and swapping tokens. The Dapp is built using React and Hardhat.
The Dapp includes:

- connect wallet using Metamask
- show balances for ERC20 tokens
- show current price with Chainlink oracles
- wrap ETH to WETH
- swap tokens using Uniswap

## DEMO

[Online DEMO here](https://ivansstoyanov.github.io/blockchain-kit/)

> **_NOTE:_** App can be used with chains 1, 31337 and 1337.

## Running the Dapp

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Start the frontend

```bash
npm start
```

## Running the Local Server

1. Create `.env` file with valid `MAINNET_KEY` key
2. Run local server

```bash
npm run node-local
```
