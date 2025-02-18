import React from "react";
import styled from "styled-components";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { injected } from "./utils/connectors";
import { Address } from "./components/Address";
import {
  NoEthereumProviderError,
  UserRejectedRequestError,
} from "@web3-react/injected-connector";
import { useEagerConnect, useInactiveListener } from "./utils/hooks";

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
`;

const NetworkStatus = styled.div<{ error: boolean }>`
  display: flex;
  justify-content: center;
  color: ${(props) => (props.error ? "black" : "green")};
  background-color: ${(props) => (props.error ? "#FF5733" : "lightgreen")};
  font-weight: bold;
  width: 100%;
  padding: 5px 0;
  margin-bottom: 10px;
`;

const UserStatus = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  width: 100%;
`;

function Header() {
  const { account, chainId, active, error, activate, deactivate } =
    useWeb3React();

  const eagerConnectionSuccessful = useEagerConnect();
  useInactiveListener(!eagerConnectionSuccessful);

  function getErrorMessage(error: Error): string {
    let errorMessage: string;

    switch (error.constructor) {
      case NoEthereumProviderError:
        errorMessage = `No Ethereum browser extension detected. Please install MetaMask extension.`;
        break;
      case UnsupportedChainIdError:
        errorMessage = `You're connected to an unsupported network.`;
        break;
      case UserRejectedRequestError:
        errorMessage = `Please authorize this website to access your Ethereum account.`;
        break;
      default:
        errorMessage = error.message;
    }

    return errorMessage;
  }

  return (
    <StyledHeader>
      <NetworkStatus error={!!error || !active}>
        {!error ? (
          <span>
            {!chainId
              ? "Not Connected"
              : chainId === 1
              ? "Mainnet"
              : chainId === 31337
              ? "Local Test"
              : chainId === 1337
              ? "Local Test"
              : "Unsupported Network"}
            {chainId ? ` id=${chainId}` : ""}
          </span>
        ) : (
          <span>{getErrorMessage(error)}</span>
        )}
      </NetworkStatus>

      <UserStatus>
        <span>
          {"Hello, "}
          <Address address={account} hideAddress={true} />
          {account ? "" : "Guest"}
        </span>

        <button onClick={() => (active ? deactivate() : activate(injected))}>
          {active ? "Disconnect" : "Connect"}
        </button>
      </UserStatus>
    </StyledHeader>
  );
}

export default Header;
