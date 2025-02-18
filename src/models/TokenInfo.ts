export interface TokenInfo {
  address: string;
  balance: string;
  decimals?: number;
  symbol?: string;
  chainlinkOracle?: string;
  chainlinkPrice?: number;
}
