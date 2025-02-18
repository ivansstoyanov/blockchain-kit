import React, { useState } from "react";
import { ethers } from "ethers";
import { uniswapRouterAddress, usniwapQuoterAddress } from "./utils/constants";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";
import ERC20ABI from "./abis/ERC20.json";
import uniswapRouterABI from "./abis/UniswapRouter.json";
import uniswapQuoterABI from "./abis/UniswapQuoter.json";
import { TokenInfo } from "./models/TokenInfo";
import { TokenSelect } from "./components/TokenSelect";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

const TokenInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const SwapTokens = () => {
  const { library, account } = useWeb3React();
  const [swapValue, setSwapValue] = useState("");
  const [slippageValue, setSlippageValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const tokens = useSelector((state: RootState) => state.tokens);

  const [selectedTokenFrom, setSelectedTokenFrom] = useState<TokenInfo | null>(
    null
  );
  const [selectedTokenTo, setSelectedTokenTo] = useState<TokenInfo | null>(
    null
  );

  const swap = async () => {
    try {
      if (!library) {
        return;
      }
      setError("");
      setSuccess("");
      setIsLoading(true);

      const signer = library.getSigner(account);
      const walletAddress = await signer.getAddress();
      const amountIn = ethers.utils.parseUnits(swapValue, 18);

      // Get Quote from Uniswap Quoter
      const quoterContract = new ethers.Contract(
        usniwapQuoterAddress,
        uniswapQuoterABI,
        signer
      );

      const amountOutMin =
        await quoterContract.callStatic.quoteExactInputSingle(
          selectedTokenFrom?.address,
          selectedTokenTo?.address,
          3000, // Uniswap fee tier (0.3%)
          amountIn,
          0
        );

      console.log(
        "Expected amount:",
        ethers.utils.formatUnits(amountOutMin, 18)
      );

      // Approve Uniswap Router to Spend WETH
      const fromContract = new ethers.Contract(
        selectedTokenFrom?.address || "",
        ERC20ABI,
        signer
      );
      const approvalTx = await fromContract.approve(
        uniswapRouterAddress,
        amountIn
      );
      await approvalTx.wait();
      console.log("Approval confirmed:", approvalTx.hash);

      // Execute Swap on Uniswap V3 Router
      const routerContract = new ethers.Contract(
        uniswapRouterAddress,
        uniswapRouterABI,
        signer
      );

      const amountOutMinWithSlippage = amountOutMin
        .mul(100 - Number(slippageValue))
        .div(100); // Apply slippage tolerance

      const tx = await routerContract.exactInputSingle({
        tokenIn: selectedTokenFrom?.address,
        tokenOut: selectedTokenTo?.address,
        fee: 3000, // 0.3% Uniswap V3 fee
        recipient: walletAddress,
        deadline: Math.floor(Date.now() / 1000) + 60 * 5, // 5 minutes deadline
        amountIn: amountIn,
        amountOutMinimum: amountOutMinWithSlippage,
        sqrtPriceLimitX96: 0,
      });

      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      setSuccess(`Successfully swapped!`);
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (error) {
      setError("Swap failed. Check the console for details.");
      console.error("Swap failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!account ? (
        ""
      ) : (
        <div>
          <h2>Swap ERC20 Tokens</h2>
          <TokenSelect
            tokens={tokens}
            label="Select a Token From:"
            selectedToken={selectedTokenFrom}
            onChange={setSelectedTokenFrom}
          />
          <TokenSelect
            tokens={tokens}
            label="Select a Token To:"
            selectedToken={selectedTokenTo}
            onChange={setSelectedTokenTo}
          />
          <div>
            <div>
              <TokenInput
                type="text"
                placeholder="Swap amount"
                value={swapValue}
                onChange={(e) => setSwapValue(e.target.value)}
              />
              <TokenInput
                type="text"
                placeholder="Slippage pecentage"
                value={slippageValue}
                onChange={(e) => setSlippageValue(e.target.value)}
              />
              <button onClick={swap}>Swap</button>
            </div>
          </div>
          {isLoading && <div>Loading tx...</div>}
          {success && <div>{success}</div>}
          {error && <div>{error}</div>}
        </div>
      )}
    </>
  );
};
