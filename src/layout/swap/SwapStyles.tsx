import React from "react";
import styled from "styled-components";
import SettingsIcon from "@material-ui/icons/Settings";
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";
import SwapVerticalCircleOutlinedIcon from "@material-ui/icons/SwapVerticalCircleOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import KeyboardArrowDownOutlinedIcon from "@material-ui/icons/KeyboardArrowDownOutlined";
import { headingOne } from "../styles/typography";
// icons
export const Icons = {
  AccountBalanceWalletOutlinedIcon,
  SettingsIcon,
  CloseOutlinedIcon,
  KeyboardArrowDownOutlinedIcon,
};

// media queries
const size = {
  xs: "400px",
  sm: "768px",
  lg: "1200px",
  xl: "3200px",
};
export const device = {
  xs: `(max-width: ${size.xs})`,
  sm: `(max-width: ${size.sm})`,
  lg: `(max-width: ${size.lg})`,
  xl: `(max-width: ${size.xl})`,
};

// Swap Ui

export const SwapSection = styled.section`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: black;

  align-items: center;
`;
export const SwapContainer = styled.div`
  position: relative;
  margin-top: 4rem;
  height: 30rem;
  color: white;

  border: 1px solid #d887b3;
  width: 90%;

  @media only screen and ${device.xl} {
    width: 35rem;
  }

  @media only screen and ${device.sm} {
    width: 25rem;
  }
  @media only screen and ${device.xs} {
    width: 20rem;
  }
`;
export const Top = styled.div`
  display: flex;
  align-items: start;
`;

export const DisplayNetwork = styled.div`
  width: 3.5rem;
  height: 12rem;
  background-color: #da117f;
  margin: 0.5rem 0 0 0.5rem;
  border: 1px solid white;
`;
export const Button = styled.button`
  color: white;
  width: 9rem;
  height: 2rem;
  margin-top: 0.5rem;
  border: 1px solid white;
  background-color: #da117f;
  margin-left: auto;
  &:hover {
    color: rgba(0, 0, 0, 0.8);
    background-color: #da117f;
    border: 1px solid white;
  }
`;
export const InputContainer0 = styled.div`
  background-color: rgba(221, 178, 202, 0.9);
  width: 70%;
  height: 6rem;
  left: 1.3rem;
  top: 4.3rem;
  position: absolute;
  border-radius: 1rem;
  border: 2px solid white;
  display: flex;
  align-items: center;
  & .token-name {
    cursor: pointe r;
  }
  & .token-img {
    width: 3rem;

    margin-right: 0.5rem;
    margin-left: 0.5rem;
    border-radius: 50%;
    @media only screen and ${device.sm} {
      width: 2rem;
    }
  }
`;

export const TokenInput0 = styled.input`
  /* margin-left: auto; */
  background-color: transparent;
  display: block;
  color: black;
  /* padding: 0.5rem; */
  font-size: 1rem;
  outline: none;
  border: none;
  direction: rtl;
  position: relative;
  transition: all 0.3s ease;

  @media only screen and ${device.sm} {
    width: 6rem;

    margin-left: 0;
  }
  &::placeholder {
    color: black;
  }

  + .underline {
    width: 0;
    height: 0;
    background-color: rgba(0, 0, 0, 0.8);
    transition: all 1s ease;
    transform-origin: left;
  }
  &:focus + .underline {
    position: absolute;

    width: 11rem;
    height: 2px;

    @media only screen and ${device.sm} {
      width: 6rem;
    }
  }
`;

export const Max0 = styled.div`
  background-color: white;
  position: absolute;
  bottom: -1.4rem;
  right: 1rem;
  color: black;
  display: flex;
  align-items: center;
  padding: 0.2rem 0.8rem;
  font-size: 1rem;

  @media only screen and ${device.sm} {
    padding: 0.2rem 0.5rem;
    font-size: 0.7rem;
    right: 1rem;
  }

  > button {
    margin-right: 1rem;
    color: #cf3851;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: bold;
    @media only screen and ${device.sm} {
      padding: 0.2rem 0.5rem;
      font-size: 0.5rem;
      right: 1.3rem;
    }
  }

  > p {
    font-size: 0.9rem;
    @media only screen and ${device.sm} {
      padding: 0.2rem 0.5rem;
      font-size: 0.5rem;
      right: 1.3rem;
    }
  }
`;
export const Max1 = styled.div`
  background-color: white;
  position: absolute;
  bottom: -1.5rem;
  left: 1rem;
  color: black;
  display: flex;
  align-items: center;
  padding: 0.2rem 0.8rem;
  font-size: 1rem;

  @media only screen and ${device.sm} {
    padding: 0.2rem 0.5rem;
    font-size: 0.7rem;
    left: 1rem;
  }

  > button {
    margin-right: 1rem;
    color: #cf3851;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: bold;
    @media only screen and ${device.sm} {
      padding: 0.2rem 0.5rem;
      font-size: 0.5rem;
      right: 1.3rem;
    }
  }

  > p {
    font-size: 0.9rem;
    @media only screen and ${device.sm} {
      padding: 0.2rem 0.5rem;
      font-size: 0.5rem;
      right: 1.3rem;
    }
  }
`;
export const Swapper = styled(SwapVerticalCircleOutlinedIcon)`
  color: #f3f374;
  position: absolute;
  top: 45%;
  right: 45%;
  cursor: pointer;
`;

export const ArrowDown = styled(KeyboardArrowDownOutlinedIcon)`
  position: absolute;
  top: 1rem;
  left: 25%;
  cursor: pointer;
`;

export const InputContainer1 = styled.div`
  background-color: rgba(221, 178, 202, 0.9);
  width: 70%;
  height: 6rem;
  right: 1.3rem;
  z-index: 1;
  bottom: 7rem;
  position: absolute;
  border-radius: 1rem;
  border: 2px solid white;
  display: flex;

  align-items: center;

  > .token-img {
    width: 3rem;
    margin-right: 0.5rem;
    margin-left: 0.5rem;
    border-radius: 50%;
    @media only screen and ${device.sm} {
      width: 2rem;
    }
  }
`;

export const TokenInput1 = styled.input`
  /* margin-right: auto; */
  background-color: transparent;
  display: block;
  color: black;
  padding: 0.5rem;
  font-size: 1rem;
  outline: none;
  border: none;
  direction: ltr;
  position: relative;
  transition: all 0.3s ease;
  @media only screen and ${device.sm} {
    width: 8rem;
    margin-right: 0;
  }
  &::placeholder {
    color: black;
  }

  + .underline {
    width: 0;
    height: 0;
    background-color: rgba(0, 0, 0, 0.8);
    transition: all 1s ease;
    transform-origin: left;
  }
  &:focus + .underline {
    position: absolute;

    width: 11rem;
    height: 2px;

    @media only screen and ${device.sm} {
      width: 8rem;
    }
  }
`;

export const ConnectWalletButton = styled(Button)`
  cursor: pointer;
`;

export const Bottom = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  align-items: flex-end;
`;

export const SwapButton = styled(Button)`
  width: 12rem;
  margin: 0 0 0.5rem 0.5rem;
`;

export const SettingsArea = styled.div`
  width: 3.5rem;
  height: 15rem;
  background-color: #da117f;
  margin-left: auto;
  border: 1px solid white;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  & > .settings {
    color: yellow;
    cursor: pointer;
  }

  & > .wallet {
    color: yellow;
    margin-top: 0.7rem;
    margin-bottom: 1rem;
  }
`;

//////// Token modal

export const TokenModalContainer = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.8);

  backdrop-filter: blur(5px);
  -moz-backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  z-index: 40;
`;

export const TokenModal = styled.div`
  background-color: #311024;
  color: white;
  height: 32rem;
  margin-top: 6rem;

  width: 30%;

  padding: 1rem;

  border-radius: 0.7rem;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  overflow-y: scroll;

  & > .separator {
    width: 100%;
    height: 0.5px;
    background-color: #8b84845e;
    margin-top: 1.2rem;
  }

  @media only screen and ${device.lg} {
    width: 50%;
  }
  @media only screen and ${device.sm} {
    width: 90%;
  }
  @media only screen and ${device.xs} {
    width: 90%;
    padding: 1.5rem;
  }
`;
export const HeaderContainer = styled.div`
  position: relative;
  padding: 1.5rem 1.5rem 0 1.5rem;
  width: 100%;
  > .title {
    color: #ffffffb2;
    font-size: 1.1rem;
    align-self: start;
  }
`;
export const CloseIcon = styled(CloseOutlinedIcon)`
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  cursor: pointer;
`;

export const TokenSearchInput = styled.input`
  border: 1px solid #ffffffb2;
  background-color: transparent;
  padding: 0.8rem 1.5rem;
  border-radius: 0.3rem;
  width: 100%;
  margin-top: 1.5rem;
  outline: none;

  &:placeholder {
    color: #808080ab;
  }
  &:focus {
    border: 1px solid lightpink;
  }
`;

export const TokenList = styled.div`
  width: 100%;
  margin-top: 0rem;
  /* overflow-y: scroll; */
`;
export const TokenListItem = styled.div`
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #b4a2ad44;
  }

  > img {
    width: 2.3rem;
    margin-right: 1rem;
    border-radius: 50%;
  }
  > .balance {
    margin-left: auto;
  }
`;

// settings

export const SettingsModal = styled.div`
  position: absolute;
  background-color: #311024;
  width: 20rem;
  height: 20rem;
  bottom: 4rem;
  right: 2.5rem;

  z-index: 2;

  @media only screen and ${device.xs} {
    width: 15rem;
    height: 15rem;
  }
`;
export const Slippage = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 0 1.5rem 0 1.5rem;
  > h1 {
    color: #c4c4c47d;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  /* &> div {
      
  } */
  & button {
    background-color: red;
    margin-right: 1rem;
    padding: 0.2rem 0.8rem;
    border-radius: 1rem;
    outline: none;
  }
  & .input {
    border-radius: 1rem;
    outline: none;
    direction: rtl;
    padding: 0.1rem 1rem;
    width: 6rem;
    color: black;
  }
`;
export const Deadline = styled(Slippage)`
  & input {
    border-radius: 1rem;
    outline: none;
    direction: rtl;
    padding: 0.1rem 1rem;
    margin-right: 1rem;
    color: black;
  }
`;
