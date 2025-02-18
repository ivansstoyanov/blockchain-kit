import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";

dotenv.config();

const chainId = 1337;
const accounts = [
  {
    privateKey:
      "0xe80902f1423234ab6de5232a497a2dad6825185949438bdf02ef36cd3f38d62c",
    balance: "211371231719819352917048000",
  },
  {
    privateKey:
      "0x8dc23d20e4cc1c1bce80b3610d2b9c3d2dcc917fe838d6161c7b7107ea8049d2",
    balance: "211371231719819352917048000",
  },
];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "shanghai",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    localhost: {
      chainId,
      url: "http://localhost:8545",
    },
    hardhat: {
      chainId,
      allowUnlimitedContractSize: true,
      forking: {
        url: "" + process.env.MAINNET_KEY,
        blockNumber: 21861100,
      },
      accounts,
    },
  },
};

export default config;
