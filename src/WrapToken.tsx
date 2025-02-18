import React, { useState } from "react";
import { ethers } from "ethers";
import WETH_ABI from "./abis/WETH.json";
import { wethAddress } from "./utils/constants";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";

const TokenInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const WrapToken = () => {
  const { library, account } = useWeb3React();
  const [wrapValue, setWrapValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const wrap = async () => {
    if (!library) {
      return;
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const wethContract = new ethers.Contract(
        wethAddress,
        WETH_ABI,
        library.getSigner(account)
      );

      const tx = await wethContract.deposit({
        value: ethers.utils.parseEther(wrapValue.toString()),
      });

      setSuccess(`Witing for the transaction to be mined...`);
      await tx.wait();
      setSuccess(`Successfully wrapped ${wrapValue} ETH into WETH!`);
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (error) {
      console.error("Failed to wrap ETH:", error);
      setError("Failed to wrap ETH. Check the console for details.");
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
          <div>
            <h2>Wrap ETH into WETH</h2>
            <div>
              <TokenInput
                type="text"
                placeholder="Enter wrap amount"
                value={wrapValue}
                onChange={(e) => setWrapValue(e.target.value)}
              />
              <button onClick={wrap}>Wrap</button>
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
