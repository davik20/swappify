import toast from "react-hot-toast";
import Web3 from "web3";
import store from "../../store/store";

import { ethers } from "ethers";

const etherMap = {
  18: "Ether",
  15: "milliether",
  12: "microether",
  9: "Gwei",
  6: "mwei",
  3: "kwei",
  1: "wei",
};
export const shortenAddress = (address) => {
  const start = address.slice(0, 6);
  const end = address.slice(address.length - 6, address.length);
  return `${start}***${end}`;
};

export const fromWei = (amount) => {
  const { web3 } = store.getState().swap;

  return web3.utils.fromWei(String(amount), "Ether");
};

export const amountToWei = (amount, decimals) => {
  const { web3 } = store.getState().swap;
  return web3.utils.toWei(String(amount), etherMap[String(decimals)]);
};

export const amountFromWei = (amount, decimals) => {
  const { web3 } = store.getState().swap;
  return web3.utils.fromWei(String(amount), etherMap[String(decimals)]);
};

export const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    // default: modern asynchronous API

    return navigator.clipboard.writeText(text);
  } else if (window.clipboardData && window.clipboardData.setData) {
    // for IE11
    window.clipboardData.setData("Text", text);
    return Promise.resolve();
  } else {
    // workaround: create dummy input
    const input = ("input", { type: "text" });
    input.value = text;
    document.body.append(input);
    input.focus();
    input.select();
    document.execCommand("copy");
    input.remove();
    return Promise.resolve();
  }
};

export const getBalance = async (tokenContract, address) => {
  const { web3 } = store.getState().swap;

  // get decimals
  const decimals = await tokenContract.methods.decimals().call();

  //check if weth
  if (
    tokenContract._address.toLowerCase() ===
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2".toLowerCase() ||
    tokenContract._address.toLowerCase() ===
      "0xc778417e063141139fce010982780140aa0cd5ab".toLowerCase()
  ) {
    let balance = await web3.eth.getBalance(address);
    balance = web3.utils.fromWei(balance, etherMap[decimals]);
    console.log(balance);
    return balance;
  } else {
    let balance = await tokenContract.methods
      .balanceOf(address.toLowerCase())
      .call();

    balance = web3.utils.fromWei(balance, etherMap[decimals]);
    console.log(balance);
    return balance;
  }
};

export const getTokenContract = async (abi, address) => {
  const { web3 } = store.getState().swap;
  try {
    const tokenContract = new web3.eth.Contract(abi, address.toLowerCase());
    return tokenContract;
  } catch (error) {
    console.log(error);
  }
};

export const infuraProvider = (chainId) => {
  const chainIdMapping = {
    1: "homestead",
    3: "ropsten",
    4: "rinkeby",
  };

  return new ethers.providers.InfuraProvider(
    chainIdMapping[String(chainId)],
    "3ee5b26be9d9451b96c018232c629555"
  );
};
