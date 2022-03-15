import store, { dispatch } from "../store/store";

import {
  setChainId,
  setAccount,
  setRouterContract,
  setWeb3,
} from "../store/swap/swapSlice";
import Web3 from "web3";
import Swap from "../component/Swap";

const connectWallet = async () => {
  const { web3, walletConnectProvider, routerContract } = store.getState().swap;

  let appWindow: any = {
    ...window,
  };
  let { ethereum } = appWindow;
  try {
    if (ethereum) {
      await ethereum.request({ method: "eth_requestAccounts" });
      const chainId = await web3.eth.getChainId();

      const accounts = await web3.eth.getAccounts();
      // const chainId = await ethereum.request({ method: 'eth_chainId' })
      // console.log('chain id ', chainId[2])
      dispatch(setChainId(Number(chainId)));
      dispatch(setAccount(accounts[0]));

      // get all idos
    }
    if (!ethereum) {
      await walletConnectProvider.enable();

      const web3 = new Web3(walletConnectProvider);

      const id = await web3.eth.net.getId();

      setWeb3(web3);
      const accounts = await web3.eth.getAccounts();

      setAccount(accounts[0]);
    }
  } catch (error: any) {
    alert(error.message);
    console.log(error.message);
  }
};

export default connectWallet;
