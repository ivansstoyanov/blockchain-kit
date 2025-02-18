import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { chainlink_usdcEthAddress } from "./utils/constants";
import { Address } from "./components/Address";
import erc20ABI from "./abis/ERC20.json";
import priceFeedABI from "./abis/PriceFeed.json";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { addToken, updateToken } from "./redux/tokenSlice";

const StyledBalances = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  background-color: #f8f9fa;
  min-width: 500px;
`;

const StyledSingleBalance = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 5px;
  background-color: #e3e3e3;
  max-width: 500px;
`;

const TokenInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

function TokenBalances() {
  const { library, account } = useWeb3React();
  const [ethBalance, setEthBalance] = useState("0");
  const [newTokenAddress, setNewTokenAddress] = useState("");
  const [blockNumber, setBlockNumber] = useState<number>();
  const tokens = useSelector((state: RootState) => state.tokens);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!library) {
      return;
    }
    library.on("block", setBlockNumber);

    return (): void => {
      library.removeListener("block", setBlockNumber);
      setBlockNumber(undefined);
    };
  }, [library]);

  useEffect(() => {
    async function fetchPrice(chainlinkFeedAddress: string) {
      if (!library) {
        return;
      }

      const contract = new ethers.Contract(
        chainlinkFeedAddress,
        priceFeedABI,
        library
      );
      const [, answer, , ,] = await contract.latestRoundData();

      const decimals = 8;
      const formattedPrice = parseFloat(
        chainlinkFeedAddress === chainlink_usdcEthAddress
          ? ethers.utils.parseEther("1").div(answer).toString()
          : ethers.utils.formatUnits(answer, decimals)
      );

      return formattedPrice;
    }

    async function fetchEthBalance() {
      if (library && account) {
        const balance = await library.getBalance(account);
        setEthBalance(ethers.utils.formatEther(balance));
      }
    }
    fetchEthBalance();

    async function fetchErcBalances() {
      if (library && account) {
        // TODO add multicall to fetch all balances in one call
        for (const token of tokens) {
          const erc20 = new ethers.Contract(token.address, erc20ABI, library);

          let price = undefined;
          if (token.chainlinkOracle) {
            price = (await fetchPrice(token.chainlinkOracle)) || undefined;
          }
          const balance = await erc20.balanceOf(account);
          const decimals = token.decimals || (await erc20.decimals());
          const symbol = token.symbol || (await erc20.symbol());

          const newTokenData = {
            address: token.address,
            balance: balance.toString(),
            decimals,
            symbol,
            chainlinkOracle: token.chainlinkOracle,
            chainlinkPrice: price,
          };
          dispatch(updateToken(newTokenData));
        }
      }
    }
    fetchErcBalances();
  }, [dispatch, tokens, library, account, blockNumber]);

  const handleAddToken = async () => {
    if (!newTokenAddress) return;
    try {
      const erc20 = new ethers.Contract(newTokenAddress, erc20ABI, library);
      const balance = await erc20.balanceOf(account);
      const decimals = await erc20.decimals();
      const symbol = await erc20.symbol();
      dispatch(
        addToken({
          address: newTokenAddress,
          balance: balance.toString(),
          decimals,
          symbol,
        })
      );
      setNewTokenAddress("");
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  };

  return (
    <>
      {!account ? (
        ""
      ) : (
        <StyledBalances>
          <h3>Acount Balances</h3>
          <StyledSingleBalance>
            <div>ETH Balance</div>
            <span>{Number(ethBalance).toFixed(2)} ETH</span>
          </StyledSingleBalance>
          <h3>ERC20 Token Balances</h3>
          {tokens.map((token, index) => (
            <StyledSingleBalance key={index}>
              <span>
                <Address address={token.address} />
                {token.chainlinkPrice && (
                  <span>{`(${token.chainlinkPrice.toFixed(2)} USD)`}</span>
                )}
              </span>
              <span>
                {`${Number(
                  ethers.utils.formatUnits(token.balance, token.decimals)
                ).toFixed(2)} ${token.symbol}`}
              </span>
            </StyledSingleBalance>
          ))}
          <div>
            <TokenInput
              type="text"
              placeholder="Enter token address"
              value={newTokenAddress}
              onChange={(e) => setNewTokenAddress(e.target.value)}
            />
            <button onClick={handleAddToken}>Add New Token</button>
          </div>
        </StyledBalances>
      )}
    </>
  );
}

export default TokenBalances;
