import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import "./style.css";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import toast, { Toaster } from "react-hot-toast";
import "../css/swap.css";
import { headingOne } from "../styles/typography";
import { ethers } from "ethers";
import {
  Swapper,
  SettingsArea,
  ConnectWalletButton,
  TokenInput0,
  TokenInput1,
  Top,
  Bottom,
  Max0,
  Max1,
  DisplayNetwork,
  InputContainer0,
  InputContainer1,
  Icons,
  device,
  TokenModalContainer,
  TokenModal,
  HeaderContainer,
  CloseIcon,
  TokenList,
  TokenListItem,
  TokenSearchInput,
  ArrowDown,
  SettingsModal,
  Slippage,
  Deadline,
} from "../layout/swap/SwapStyles";

import { getOutputAmountAndSetToState } from "../functions/swap/getOutputAmount";
import Erc20Abi from "../contracts/Erc20Abi.json";
import useClickOutside from "../hooks/useClickOutside";
import connectWallet from "../functions/connectWallet";
import {
  getTokenContract,
  getBalance,
  amountToWei,
  infuraProvider as InfuraProvider,
  amountFromWei,
} from "../functions/swap/utils";
import { useAppSelector, useAppDispatch } from "../hooks/storeHooks";
import {
  shortenAddress,
  copyToClipboard,
  fromWei,
} from "../functions/swap/utils";
import { TOKENS } from "../Constants";
import {
  ChainId,
  WETH,
  Fetcher,
  Route,
  Trade,
  TokenAmount,
  TradeType,
  Currency,
  Token,
  Percent,
} from "@uniswap/sdk";
import { ClipLoader, RingLoader } from "react-spinners";
import { chain, filter, includes } from "lodash";
import {
  sendTransaction,
  swapExactETHForTokens,
  swapExactTokensForETH,
  swapExactTokensForTokens,
} from "../functions/swap/swapFunctions";
import { getImportedTokens, addImportedToken } from "../Constants";
import CoinData from "../components/CoinData";
import { setAccount, setChainId } from "../store/swap/swapSlice";

function Swap2() {
  // refs
  const tokenModalRef = useRef(undefined);
  const settingsModalRef = useRef(undefined);
  const settingsClickRef = useRef([]);
  const tokenClickRef = useRef([]);

  // store
  const { chainId, account, web3, routerContract } = useAppSelector(
    (state) => state.swap
  );

  const dispatch = useAppDispatch();

  // ui state
  const [settingsModalShown, setSettingsModalShown] = useState(false);
  const [tokenModalShown, setTokenModalShown] = useState(false);
  const [currentModalSelected, setCurrentModalSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [tokenNotFound, setTokenNotFound] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchedToken, setSearchedToken] = useState(undefined);
  const [active, setActive] = useState(true);
  //hooks

  useClickOutside(tokenModalRef, tokenClickRef, () =>
    setTokenModalShown(false)
  );
  useClickOutside(settingsModalRef, settingsClickRef, () =>
    setSettingsModalShown(false)
  );

  // swap state
  const [slippage, setSlippage] = useState(0.5);
  const [deadline, setDeadline] = useState(30);
  const [token0Contract, setToken0Contract] = useState(null);
  const [token1Contract, setToken1Contract] = useState(null);
  const [token0Balance, setToken0Balance] = useState(0);
  const [token1Balance, setToken1Balance] = useState(0);
  const [token0BalanceRaw, setToken0BalanceRaw] = useState(0);
  const [token1BalanceRaw, setToken1BalanceRaw] = useState(0);
  const [insufficientLiquidity, setInsufficientLiquidty] = useState(false);
  const [pair, setPair] = useState(undefined);
  const [route, setRoute] = useState(undefined);
  const [tradeEntity, setTradeEntity] = useState({
    trade: undefined,
    path: undefined,
  });

  const infuraProvider = InfuraProvider(chainId);
  const renderCount = useRef(0);
  const [swapped, setSwapped] = useState(0);
  const [inputValue0, setInputValue0] = useState("");
  const [inputValue1, setInputValue1] = useState("");
  const [tokens, setTokens] = useState([]);
  const [importedTokens, setImportedTokens] = useState(
    getImportedTokens(chainId)
  );
  const [swappable, setSwappable] = useState(false);
  const [tokenSDK, setTokenSDk] = useState({
    token0: undefined,
    token1: undefined,
  });
  const [token0, setToken0] = useState(undefined);
  const [token1, setToken1] = useState(undefined);

  const [tokensMetaData, setTokensMetaData] = useState(() => ({
    token0MetaData: undefined,
    token1MetaData: undefined,
  }));

  //  USE EFFECT

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", (chainId) => {
        dispatch(setChainId(Number(chainId[2])));
      });
      window.ethereum.on("accountsChanged", (accounts) => {
        dispatch(setAccount(accounts[0]));
      });
    }
  }, []);

  useEffect(() => {
    // Map Token values and creates necessary object

    console.log(TOKENS());
    Promise.all(
      TOKENS().map(async (token) => {
        const { name, symbol, img, decimals, address } = token;
        let tokenContract = "";
        if (address) {
          tokenContract = await getTokenContract(
            Erc20Abi,
            token.address.toLowerCase()
          );
        }

        let balance = 0;
        if (account && tokenContract) {
          balance = await getBalance(tokenContract, account);
        }

        return {
          address,
          name,
          symbol,
          img,
          decimals,
          tokenContract,
          balance: Number(balance).toFixed(2),
        };
      })
    )
      .then((tokens) => {
        const filteredTokens = tokens.filter((token) => token.address !== "");

        setTokens(filteredTokens);
      })
      .catch((err) => console.log(err));

    if (getImportedTokens(chainId).length > 0) {
      Promise.all(
        getImportedTokens(chainId).map(async (token) => {
          const { name, symbol, img, decimals, address } = token;
          let tokenContract = "";
          if (address) {
            tokenContract = await getTokenContract(
              Erc20Abi,
              token.address.toLowerCase()
            );
          }

          let balance = 0;
          if (account && tokenContract) {
            balance = await getBalance(tokenContract, account);
          }

          return {
            address,
            name,
            symbol,
            img,
            decimals,
            tokenContract,
            balance: Number(balance).toFixed(2),
          };
        })
      ).then((tokens) => {
        const filteredTokens = tokens.filter((token) => token.address !== "");

        setImportedTokens(filteredTokens);
      });
    } else {
      setImportedTokens([]);
    }
  }, [account, chainId, swapped]);

  useEffect(() => {
    const { token0MetaData, token1MetaData } = tokensMetaData;
    if (token0MetaData === undefined && token1MetaData === undefined) {
      console.log(tokens);
      setTokensMetaData((prev) => ({
        token0MetaData: tokens[1],
        token1MetaData: tokens[0],
      }));
    } else {
      setTokensMetaData((prev) => ({
        token0MetaData: tokens[1],
        token1MetaData: tokens[0],
      }));
    }

    console.log(tokens);

    const getTokens = async () => {
      setLoading(true);
      let token0;
      let token1;

      try {
        token0 = await Fetcher.fetchTokenData(
          chainId,
          tokens[1].address,
          InfuraProvider(chainId),
          tokens[1].symbol,
          tokens[1].name
        );

        token1 = await Fetcher.fetchTokenData(
          chainId,
          tokens[0].address,
          InfuraProvider(chainId),
          tokens[0].symbol,
          tokens[0].name
        );

        setTokenSDk((prev) => ({
          token0,
          token1,
        }));
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    if (tokens.length > 0) {
      getTokens();
    }
  }, [tokens]);

  //  USE EFFECT
  useEffect(() => {
    let isMounted = true;
    // get token on page load || useful for newly loaded
    setInsufficientLiquidty(false);
    setInputValue0("");

    setInputValue1("");

    if (account && tokensMetaData) {
      // get token balance
      if (tokensMetaData.token0MetaData.tokenContract) {
        getBalance(tokensMetaData.token0MetaData.tokenContract, account)
          .then((balance0) => {
            let balance = Number(balance0).toFixed(4);

            setToken0Balance(balance);
            setToken0BalanceRaw(balance0);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      }
      if (tokensMetaData.token1MetaData.tokenContract) {
        getBalance(tokensMetaData.token1MetaData.tokenContract, account)
          .then((balance1) => {
            let balance = Number(balance1).toFixed(4);

            setToken1Balance(balance);
            setToken1BalanceRaw(balance1);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      }
    }

    if (
      tokensMetaData.token0MetaData &&
      tokensMetaData.token1MetaData &&
      routerContract &&
      account
    ) {
      getAllowance(tokensMetaData.token0MetaData);
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [tokensMetaData, account, routerContract]);

  //  USE EFFECT
  useEffect(() => {
    const getPair = async () => {
      setLoading(true);
      if (tokenSDK.token0 && tokenSDK.token1) {
        console.log("getting pair");
        const { token0, token1 } = tokenSDK;

        try {
          const pair = await Fetcher.fetchPairData(
            token0,
            token1,
            InfuraProvider(chainId)
          );

          setPair((prev) => (prev = [pair]));
          setLoading(false);
          setLoading(false);
        } catch (error) {
          // get other route if function throws an error
          //token0/eth token1/eth

          console.log("token 0 ", token0, "token 1 ", token1);
          try {
            console.log("alternate route");
            console.log("chain id ", chainId);
            const token0WethPair = await Fetcher.fetchPairData(
              token0,
              WETH[String(chainId)],
              InfuraProvider(chainId)
            );
            const token1WethPair = await Fetcher.fetchPairData(
              token1,
              WETH[String(chainId)],
              InfuraProvider(chainId)
            );
            // return [token0WethPair, token1WethPair]
            setPair((prev) => (prev = [token0WethPair, token1WethPair]));
            setLoading(false);
          } catch (error) {
            setInsufficientLiquidty(true);
            console.log("chain id ", chainId);
            console.log(error);
            setLoading(false);
          }
        }
      }
    };
    if (tokenSDK) {
      getPair();
    }
  }, [tokenSDK]);

  // swap functions
  const getToken = async (token) => {
    return await Fetcher.fetchTokenData(
      chainId,
      token.address,
      InfuraProvider(chainId),
      token.symbol,
      token.name
    );
  };
  const tokenExistsInArray = (value) => {
    let token =
      tokens.find(
        (token) => token.address.toLowerCase() === value.toLowerCase()
      ) ||
      importedTokens.find(
        (token) => token.address.toLowerCase() === value.toLowerCase()
      );
    if (token) {
      return [token, true];
    } else {
      return [token, false];
    }
  };

  const searchForToken = async (value, number) => {
    const searchItem = value.toLowerCase().trim();
    setSearchInput(value);
    let [token, bool] = tokenExistsInArray(searchItem);

    if (bool) {
      setTokenNotFound(false);
      setSearchedToken(token);

      return;
    }

    if (searchItem.length === 42) {
      try {
        const tokenContract = await new web3.eth.Contract(Erc20Abi, searchItem);
        const name = await tokenContract.methods.name().call();
        const address = await tokenContract._address;
        const symbol = await tokenContract.methods.symbol().call();
        const decimals = await tokenContract.methods.decimals().call();
        let balance = 0.0;
        if (account) {
          balance = await tokenContract.methods.balanceOf(account).call();
          balance = await amountFromWei(balance, decimals);
        }

        const token = {
          name,
          address,
          symbol,
          decimals: decimals,
          balance,
          tokenContract,
          img: "data:image/png;base64,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",
        };

        setSearchedToken(token);
      } catch (error) {
        console.log(error);
        setTokenNotFound(true);
        setTimeout(() => {
          setTokenNotFound(false);
        }, 3000);
      }
    } else {
      setTokenNotFound(true);
      setSearchedToken(undefined);
      setTimeout(() => {
        setTokenNotFound(false);
      }, 3000);
    }
  };

  const swap = async () => {
    const { token0MetaData, token1MetaData } = tokensMetaData;

    try {
      setSwapLoading(true);
      if (
        tokensMetaData.token0MetaData.address.toLowerCase() ===
          "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2".toLowerCase() ||
        tokensMetaData.token0MetaData.address.toLowerCase() ===
          "0xc778417e063141139fce010982780140aa0cd5ab".toLowerCase()
      ) {
        await swapExactETHForTokens(tradeEntity);
        setSwapLoading(false);
        setSwapped((prev) => prev + 1);
      } else if (
        tokensMetaData.token1MetaData.address.toLowerCase() ===
          "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" ||
        tokensMetaData.token1MetaData.address.toLowerCase() ===
          "0xc778417e063141139fce010982780140aa0cd5ab".toLowerCase()
      ) {
        await swapExactTokensForETH(tradeEntity);
        setSwapLoading(false);
        setSwapped((prev) => prev + 1);
      } else {
        await swapExactTokensForTokens(tradeEntity);
        setSwapLoading(false);
        setSwapped((prev) => prev + 1);
      }
    } catch (error) {
      setSwapLoading(false);
      setSwapped((prev) => prev + 1);
    }
  };

  const approve = async () => {
    const { token0MetaData } = tokensMetaData;

    try {
      setSwapLoading(true);
      await sendTransaction(
        token0MetaData.tokenContract.methods
          .approve(
            routerContract._address,
            "115792089237316195423570985008687907853269984665640564039457584007913129639935"
          )
          .send({
            from: account,
          })
      );
      setSwapLoading(false);
      setSwapped((prev) => prev + 1);
    } catch (error) {
      setSwapLoading(false);
      setSwapped((prev) => prev + 1);
    }
  };

  const getAllowance = async (tokenMetaData) => {
    console.log(account, routerContract);
    const { tokenContract } = tokenMetaData;
    if (tokenContract) {
      tokenContract.methods
        .allowance(account, routerContract._address)
        .call()
        .then((result) => {
          const amount = amountToWei(result, Number(tokenMetaData.decimals));
          if (
            String(result).length >= 70 ||
            tokenContract._address.toLowerCase() ===
              "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2".toLowerCase() ||
            tokenContract._address.toLowerCase() ===
              "0xc778417e063141139fce010982780140aa0cd5ab".toLowerCase()
          ) {
            setSwappable(true);
          } else {
            setSwappable(false);
          }
          console.log("allowance gottrn");
        })
        .catch((error) => console.log(error));
    }
  };

  const populateOutput = async (inputValueLocation, value, type) => {
    if (pair) {
      if (inputValueLocation === "0") {
        // await getPairData()

        if (type === "input") {
          setInputValue0(parseFloat(value));
        } else {
          setInputValue0(parseFloat(value).toFixed(4));
        }

        const [output, path, trade] = await getOutputAmountAndSetToState(
          tokenSDK.token0,
          pair,
          route,
          value,
          setInputValue1,
          inputValueLocation
        );

        setInputValue1(output);
        setTradeEntity({
          trade,
          path,
        });
      }
      if (inputValueLocation === "1") {
        // await getPairData()

        if (type === "input") {
          setInputValue1(parseFloat(value));
        } else {
          setInputValue1(parseFloat(value).toFixed(4));
        }

        const [output, path, trade] = await getOutputAmountAndSetToState(
          tokenSDK.token1,
          pair,
          route,
          value,
          setInputValue0,
          inputValueLocation
        );
        setInputValue0(output);
        // console.log(output)
        setTradeEntity({
          trade,
          path,
        });
      }
    }
  };

  const handleInput = (e, inputValueLocation) => {
    const value = parseFloat(e.currentTarget.value);

    populateOutput(inputValueLocation, value, "input");
  };

  //

  const onSelectToken = (address, token, number) => {
    // console.log(arguments);
    setLoading(true);
    // console.log(token)
    const init = async () => {
      const { token0MetaData, token1MetaData } = tokensMetaData;
      if (address) {
        const token = tokens.find((item) => item.address === address);

        if (number === 0) {
          if (token0MetaData === token || token1MetaData === token) {
            setLoading(false);
            return;
          }
          setTokensMetaData((prev) => ({
            ...prev,
            token0MetaData: token,
          }));
          const tokenSdk = await getToken(token);
          setTokenSDk((prev) => ({
            ...prev,
            token0: tokenSdk,
          }));
          // setLoading(false);
        }

        if (number === 1) {
          if (token0MetaData === token || token1MetaData === token) {
            setLoading(false);
            return;
          }
          setTokensMetaData((prev) => ({
            ...prev,
            token1MetaData: token,
          }));

          const tokenSdk = await getToken(token);

          setTokenSDk((prev) => ({
            ...prev,
            token1: tokenSdk,
          }));
        }
      } else if (token) {
        if (
          token0MetaData.address === token.address ||
          token1MetaData.address === token.address
        ) {
          setLoading(false);
          return;
        }

        if (number === 0) {
          setTokensMetaData((prev) => ({
            ...prev,
            token0MetaData: token,
          }));
          const tokenSdk = await getToken(token);
          setTokenSDk((prev) => ({
            ...prev,
            token0: tokenSdk,
          }));
        }

        if (number === 1) {
          setTokensMetaData((prev) => ({
            ...prev,
            token1MetaData: token,
          }));
          const tokenSdk = await getToken(token);
          setTokenSDk((prev) => ({
            ...prev,
            token1: tokenSdk,
          }));
        }
        setSearchedToken(undefined);
        setSearchInput("");
      }

      // setLoading(false)
      setTokenModalShown(false);
    };

    init();
  };

  // Ui functions
  const closeSettings = () => {
    setTokenModalShown(false);
    setTokenNotFound(false);
    setSearchedToken(undefined);
  };

  const showTokenModal = (number) => {
    setTokenModalShown(true);
    setCurrentModalSelected(number);
  };

  const swapTokensOrientation = () => {
    setTokensMetaData((prev) => ({
      token0MetaData: prev.token1MetaData,
      token1MetaData: prev.token0MetaData,
    }));
  };
  const copy = (text) => {
    copyToClipboard(text);
    toast("Copied to clipboard ");
  };

  const importToken = (token, chainId) => {
    const importedTokens = getImportedTokens(chainId);
    const importedToken = importedTokens.find(
      (importedToken) => importedToken.address === token.address
    );

    if (importedToken) {
      return;
    }
    addImportedToken(token, String(chainId));

    setImportedTokens((prev) => {
      return [...prev, token];
    });
    onSelectToken(undefined, token, currentModalSelected);
  };

  const getMax = (number) => {
    if (number === 0) {
      console.log("getting mas");
      if (token0Balance === 0) return;
      setInputValue0(token0Balance);

      populateOutput(String(number), token0BalanceRaw);
    }
    if (number === 1) {
      setInputValue1(token1Balance);
      populateOutput(String(number), token1BalanceRaw);
    }
  };

  const updateSlippage = (e) => {
    if (isNaN(e.target.value)) {
      console.log("not a number");
      return;
    }
    if (e.target.value > 50) {
      return;
    }
    setSlippage(e.target.value);
  };
  const renderSwapButton = () => {
    const { token0MetaData } = tokensMetaData;
    if (token0Balance && account) {
      if (
        inputValue0 === "" ||
        Number(inputValue0) === 0 ||
        isNaN(inputValue0)
      ) {
        return (
          <SwapButton style={{ backgroundColor: "grey" }}>
            Enter An Amount
          </SwapButton>
        );
      } else if (
        Number(inputValue0) > Number(token0Balance) &&
        Number(inputValue0) > 0
      ) {
        return (
          <SwapButton style={{ backgroundColor: "grey" }}>
            Insufficient {`${token0MetaData.symbol}`} Balance
          </SwapButton>
        );
      } else if (!swappable) {
        return (
          <SwapButton onClick={() => approve()}>
            {swapLoading ? <ClipLoader size={10} /> : "Approve"}
          </SwapButton>
        );
      } else if (insufficientLiquidity) {
        return (
          <SwapButton style={{ backgroundColor: "grey" }}>
            Insufficient Liquidity
          </SwapButton>
        );
      } else {
        return (
          <SwapButton onClick={() => swap()}>
            {swapLoading ? <ClipLoader size={10} /> : "Swap"}
          </SwapButton>
        );
      }
    } else {
      return <div></div>;
    }
  };

  return (
    <div>
      <SwapSection style={{ alignItems: "center" }}>
        {tokenModalShown && (
          <TokenModalContainer>
            <TokenModal ref={tokenModalRef}>
              <HeaderContainer>
                <div className="title">Select a token </div>
                <TokenSearchInput
                  style={{ color: "white" }}
                  onChange={(e) => {
                    searchForToken(e.target.value, currentModalSelected);
                  }}
                  placeholder="Paste an address "
                />
                <CloseIcon onClick={closeSettings} />
              </HeaderContainer>
              <div className="separator"> </div>

              <TokenList>
                {tokenNotFound && (
                  <TokenListItem
                    style={{ justifyContent: "center", fontWeight: "bold" }}
                  >
                    Token not found
                  </TokenListItem>
                )}
                {searchInput && searchedToken && (
                  <TokenListItem
                    style={{
                      borderBottom: "1px solid rgba(255,255,255, .1)",
                      marginBottom: ".5rem",
                      paddingTop: "1.5rem",
                      paddingBottom: "1.5rem",
                      filter:
                        searchedToken?.address ===
                          tokensMetaData?.token0MetaData?.address ||
                        searchedToken?.address ===
                          tokensMetaData?.token1MetaData?.address
                          ? "opacity(.4)"
                          : "",
                    }}
                  >
                    <img src={searchedToken.img} />
                    <p
                      onClick={() =>
                        onSelectToken(
                          undefined,
                          searchedToken,
                          currentModalSelected
                        )
                      }
                      className="symbol"
                    >
                      {searchedToken.symbol}
                    </p>
                    <p className="balance">{searchedToken.balance}</p>
                    {tokenExistsInArray(searchedToken.address)[1] === false && (
                      <button
                        onClick={() => {
                          importToken(searchedToken, chainId);
                        }}
                        style={{
                          color: "white",
                          padding: ".3rem 1.4rem",
                          backgroundColor: "rgb(232, 0, 111)",
                          alignSelf: "center",
                          marginLeft: "1rem",
                        }}
                      >
                        Import
                      </button>
                    )}
                  </TokenListItem>
                )}
                {tokens.length > 0 &&
                  !searchedToken &&
                  tokens.map((token: TokenMetaData, index) => (
                    <TokenListItem
                      style={{
                        filter:
                          token?.address ===
                            tokensMetaData?.token0MetaData?.address ||
                          token?.address ===
                            tokensMetaData?.token1MetaData?.address
                            ? "opacity(.4)"
                            : "",
                      }}
                      onClick={() =>
                        onSelectToken(
                          token?.address,
                          undefined,
                          currentModalSelected
                        )
                      }
                      key={index}
                    >
                      <img src={token.img} />
                      <p className="symbol">{token?.symbol}</p>
                      <p className="balance">{token?.balance}</p>
                    </TokenListItem>
                  ))}
              </TokenList>

              {importedTokens.length > 0 && !searchedToken && (
                <TokenList>
                  {importedTokens.map((token, index) => (
                    <TokenListItem
                      style={{
                        filter:
                          token?.address ===
                            tokensMetaData?.token0MetaData?.address ||
                          token?.address ===
                            tokensMetaData?.token1MetaData?.address
                            ? "opacity(.4)"
                            : "",
                      }}
                      onClick={() =>
                        onSelectToken(undefined, token, currentModalSelected)
                      }
                      key={index}
                    >
                      <img src={token.img} />
                      <p className="symbol">{token?.symbol}</p>
                      <p className="balance">{token?.balance}</p>
                    </TokenListItem>
                  ))}
                </TokenList>
              )}
            </TokenModal>
          </TokenModalContainer>
        )}
        <SwapContainer>
          {loading && (
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0, .8)",
                zIndex: "3",
                top: "0",
                left: "0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <RingLoader size="50" color="wheat" />
            </div>
          )}

          <Heading>
            <div
              style={{
                marginRight: "2rem",
                backgroundColor:
                  chainId === 1 ? "lightgreen" : "rgba(243, 133, 30, 0.205)",
                color: chainId === 1 ? "white" : "yellow",
                borderRadius: ".5rem",
                padding: ".5rem 1rem",

                marginTop: ".5rem",
              }}
            >
              {chainId === 1
                ? "Mainnet"
                : chainId === 4
                ? "Rinkeby"
                : chainId === 3
                ? "Ropsten"
                : "Unsupported Chain"}{" "}
            </div>
            <img
              src={`${process.env.PUBLIC_URL}/img/ic_donut_small_24px.png`}
              alt="logo"
            />

            <h1>Swap </h1>
            <ConnectWalletButton
              onClick={() => (account ? copy(account) : connectWallet())}
            >
              {account ? shortenAddress(account) : "Connect Wallet"}
            </ConnectWalletButton>
          </Heading>
          <Content>
            <ButtonContainer>
              {" "}
              <Button
                style={{
                  color: active ? "red" : "",
                  backgroundColor: active ? "white" : "",
                }}
                className={`${active && "active"}`}
                onClick={() => setActive(active)}
              >
                ERC-20
              </Button>
              {/* <Button onClick={() => toast.success("Coming Soon")}>
                BEP-20
              </Button> */}
            </ButtonContainer>
            <TokenSection>
              <InputContainer>
                <MaxButton onClick={() => getMax(0)}>Max</MaxButton>
                <MetaData
                  ref={(target) => (tokenClickRef.current[0] = target)}
                  style={{ position: "relative" }}
                  onClick={() => showTokenModal(0)}
                  className="hover-state"
                >
                  <img alt="logo" src={tokensMetaData?.token0MetaData?.img} />
                  <p> {tokensMetaData?.token0MetaData?.symbol}</p>
                  <ArrowDropDownIcon style={{ fontSize: "1rem", padding: 0 }} />
                </MetaData>
                <TokenInput>
                  <div>Balance {token0Balance}</div>
                  <input
                    value={inputValue0}
                    type="number"
                    onChange={(e) => handleInput(e, "0")}
                    placeholder="0.00"
                  />
                </TokenInput>
              </InputContainer>
              <InputContainer>
                <MetaData
                  ref={(target) => (tokenClickRef.current[1] = target)}
                  style={{ position: "relative", cursor: "pointer" }}
                  onClick={() => showTokenModal(1)}
                  className="hover-state"
                >
                  <img alt="logo" src={tokensMetaData?.token1MetaData?.img} />
                  <p> {tokensMetaData?.token1MetaData?.symbol}</p>
                  <ArrowDropDownIcon style={{ fontSize: "1rem", padding: 0 }} />
                </MetaData>
                <TokenInput>
                  <input
                    style={{ width: "12rem" }}
                    value={inputValue1}
                    type="number"
                    placeholder="0.00"
                    onChange={(e) => handleInput(e, "1")}
                  />
                </TokenInput>
              </InputContainer>
              {renderSwapButton()}
            </TokenSection>
          </Content>
        </SwapContainer>
      </SwapSection>
    </div>
  );
}

const SwapSection = styled.div`
  background-color: black;
  height: 100vh;
  display: flex;
  padding: 0;
  justify-content: center;
`;

const SwapContainer = styled.div`
  color: white;
  position: relative;

  min-width: 430px;
  padding: 2rem 1rem;
  background-image: linear-gradient(to bottom, #f71382, #ac1b94);
  border-radius: 30px;
  bottom: 2rem;

  @media screen and ${device.sm} {
    min-width: 300px;
  }
`;

const Heading = styled.div`
  color: white;
  text-align: center;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.6rem;

  > img {
    margin-right: 0.3rem;
    width: 20px;
  }
  > h1 {
    margin-right: 1rem;
  }

  @media screen and ${device.sm} {
    min-width: 300px;

    > p {
      margin-right: 35px;
    }
  }
`;

const Content = styled.div``;

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  color: white;
  cursor: pointer;
  transition: 0.2s all;
  border: 1px solid white;
  background-color: transparent;
  width: 70px;
  padding: 0.4rem;
  margin-right: 0.3rem;
  border-radius: 5px;
  font-family: "Roboto Mono", monospace;
  :active {
    border: 1px solid #f71382;
    background-color: white;
    color: #f71382;
  }
`;

const TokenSection = styled.div`
  margin-top: 0.5rem;
`;

const InputContainer = styled.div`
  position: relative;
  background-color: white;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  padding: 0.6rem 0.6rem;
`;

const MetaData = styled.div`
  background-color: black;
  border-radius: 10px;
  padding: 0.5rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  > img {
    width: 20px;
    margin-right: 0.3rem;
  }
  > p {
    margin-right: 0.7rem;
    font-size: 0.9rem;
  }
`;

const MaxButton = styled.button`
  position: absolute;
  border: 1px solid #f71382;
  background-color: transparent;
  color: #f71382;
  outline: none;
  left: 12rem;
  bottom: 1rem;
  padding: 0.6px 3px;
  border-radius: 2px;
  cursor: pointer;
`;
const TokenInput = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 1rem;

  color: #4b4b4b;

  > input {
    margin-top: 1rem;
    font-weight: bold;
    border: none;
    outline: none;
    font-size: 1.3rem;
    direction: rtl;
    font-family: "Roboto Mono", monospace;
    width: 9rem;
  }
`;

const SwapButton = styled.button`
  background-color: #00f3aa;
  color: #161616;
  padding: 1rem;
  text-align: center;
  width: 100%;
  font-size: 1.3rem;
  border-radius: 15px;
  border: none;
`;
export default Swap2;
