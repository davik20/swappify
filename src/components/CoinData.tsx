import styled, { keyframes } from "styled-components";
import React from "react";
import { useAppSelector } from "../hooks/storeHooks";
import NumberFormat from "react-number-format";
import { device } from "../layout/swap/SwapStyles";

const Container = styled.div`
  background-color: #523b3e !important;

  width: 100%;
  align-items: center;
  justify-content: center;

  overflow-x: scroll;
`;

const CoinIndexContainer = styled.div`

  display: flex;
  justify-content: center;

  /* transform: translateX(150%); */
  /* animation: animate 20s;
  animation-delay: 0s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite; */

  /* @keyframes animate {
    0% {
      /* transform: translateX(25%); */
    }
    /* 100% {
      transform: translateX(-125%);
    }
  } */ 
`;

const CoinIndexContainer2 = styled(CoinIndexContainer)`
  animation: animate2 20s;

  animation-delay: 9.5s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  @keyframes animate2 {
    0% {
      /* transform: translateX(25%); */

      opacity: 1;
    }
    100% {
      transform: translateX(-125%);
    }
  }
`;

const CoinIndex = styled.div`
  display: flex;
  align-items: center;

  padding: 0.5rem 1rem;

  &:not(:last-child) {
    /* border-right: 1px solid white; */
  }
  > h1 {
    margin-right: 0.7rem;
    font-size: 1rem;
    color: #ffffffb9;
  }
  > p {
    font-size: 0.7rem;
    font-weight: bold;
    letter-spacing: 0.1rem;
  }
  @media screen and ${device.sm} {
    > h1 {
      margin-right: 0.2rem;
      font-size: 0.4rem;
      color: #ffffffb9;
    }
    > p {
      font-size: 0.3rem;
      font-weight: bold;
      letter-spacing: 0.1rem;
    }
  }
`;

function CoinData() {
  const {
    marketCap,
    price,
    totalSupply,
    dailyChange,
    dailyVolume,
    hourlyChange,
  } = useAppSelector((state) => state.coinData.data);

  return (
    <Container style={{ backgroundColor: "red" }}>
      <CoinIndexContainer>
        <CoinIndex>
          <h1>Market Cap:</h1>
          <p>$ {marketCap.toFixed(2)}</p>
        </CoinIndex>
        <CoinIndex>
          <h1>Price:</h1>
          <p>{price.toFixed(4)}</p>
        </CoinIndex>
        <CoinIndex>
          <h1>24 Hr change:</h1>
          <p style={{ color: Math.sign(dailyChange) === -1 ? "red" : "green" }}>
            {dailyChange.toFixed(2)}%
          </p>
        </CoinIndex>
        <CoinIndex>
          <h1>1 Hr change:</h1>
          <p
            style={{ color: Math.sign(hourlyChange) === -1 ? "red" : "green" }}
          >
            {hourlyChange.toFixed(2)}%
          </p>
        </CoinIndex>
        <CoinIndex>
          <h1>Total Supply:</h1>
          <p>$ {totalSupply}</p>
        </CoinIndex>
        <CoinIndex>
          <h1>Daily volume:</h1>
          <p>$ {dailyVolume.toFixed(2)}</p>
        </CoinIndex>
      </CoinIndexContainer>
      {/* <CoinIndexContainer2>
        <CoinIndex>
          <h1>Market Cap:</h1>
          <p>
            <NumberFormat
              style={{ backgroundColor: 'transparent' }}
              thousandSeparator={true}
              value={marketCap.toFixed(2)}
              prefix="$"
            />
          </p>
        </CoinIndex>
        <CoinIndex>
          <h1>Price:</h1>
          <p>
            <NumberFormat
              style={{ backgroundColor: 'transparent' }}
              thousandSeparator={true}
              value={price.toFixed(4)}
              prefix="$"
            />
          </p>
        </CoinIndex>
        <CoinIndex>
          <h1>24 Hr change:</h1>
          <p style={{ color: Math.sign(dailyChange) === -1 ? 'red' : 'green' }}>{dailyChange.toFixed(2)}%</p>
        </CoinIndex>
        <CoinIndex>
          <h1>1 Hr change:</h1>
          <p style={{ color: Math.sign(hourlyChange) === -1 ? 'red' : 'green' }}>{hourlyChange.toFixed(2)}%</p>
        </CoinIndex>
        <CoinIndex>
          <h1>Total Supply:</h1>
          <p>
            <NumberFormat
              style={{ backgroundColor: 'transparent' }}
              thousandSeparator={true}
              value={totalSupply}
              prefix="$"
            />
          </p>
        </CoinIndex>
        <CoinIndex>
          <h1>Daily volume:</h1>
          <p>
            <NumberFormat
              style={{ backgroundColor: 'transparent' }}
              thousandSeparator={true}
              value={dailyVolume.toFixed(2)}
              prefix="$"
            />
          </p>
        </CoinIndex>
      </CoinIndexContainer2> */}
    </Container>
  );
}

export default CoinData;
