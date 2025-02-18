import { ReactElement } from "react";
import styled from "styled-components";
import Header from "./Header";
import TokenBalances from "./TokenBalances";
import { WrapToken } from "./WrapToken";
import { SwapTokens } from "./SwapTokens";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const StyledAppRoot = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledAppDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 720px;
`;

export function App(): ReactElement {
  return (
    <Provider store={store}>
      <StyledAppRoot>
        <StyledAppDiv>
          <Header />
          <TokenBalances />
          <WrapToken />
          <SwapTokens />
        </StyledAppDiv>
      </StyledAppRoot>
    </Provider>
  );
}
