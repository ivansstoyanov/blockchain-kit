import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TokenInfo } from "../models/TokenInfo";
import {
  chainlink_usdcEthAddress,
  chainlink_usdcUsdAddress,
  chainlink_wstEthUsdcAddress,
  NEXOAddress,
  USDCAddress,
  wethAddress,
  wstEthAddress,
} from "../utils/constants";

const loadFromLocalStorage = (): TokenInfo[] => {
  const stored = localStorage.getItem("tokens");
  return stored ? JSON.parse(stored) : defaultTokens;
};

const defaultTokens: TokenInfo[] = [
  {
    address: wethAddress,
    balance: "0",
    chainlinkOracle: chainlink_usdcEthAddress,
  },
  {
    address: wstEthAddress,
    balance: "0",
    chainlinkOracle: chainlink_wstEthUsdcAddress,
  },
  {
    address: USDCAddress,
    balance: "0",
    chainlinkOracle: chainlink_usdcUsdAddress,
  },
  {
    address: NEXOAddress,
    balance: "0",
  },
];

const tokenSlice = createSlice({
  name: "tokens",
  initialState: loadFromLocalStorage(),
  reducers: {
    setTokens: (state, action: PayloadAction<TokenInfo[]>) => {
      state.length = 0;
      state.push(...action.payload);
      localStorage.setItem("tokens", JSON.stringify(state));
    },
    updateToken: (state, action: PayloadAction<TokenInfo>) => {
      const index = state.findIndex(
        (t) => t.address === action.payload.address
      );
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
        localStorage.setItem("tokens", JSON.stringify(state));
      }
    },
    addToken: (state, action: PayloadAction<TokenInfo>) => {
      state.push(action.payload);
      localStorage.setItem("tokens", JSON.stringify(state));
    },
    removeToken: (state, action: PayloadAction<string>) => {
      const newState = state.filter((t) => t.address !== action.payload);
      localStorage.setItem("tokens", JSON.stringify(newState));
      return newState;
    },
  },
});

export const { setTokens, updateToken, addToken, removeToken } =
  tokenSlice.actions;
export default tokenSlice.reducer;
