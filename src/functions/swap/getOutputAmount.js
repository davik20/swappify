import {
  ChainId,
  WETH,
  Token,
  TokenAmount,
  Fetcher,
  Pair,
  Fraction,
  BigintIsh,
  Route,
  Trade,
  TradeType,
  Percent,
} from "@uniswap/sdk";
import { compact } from "lodash";
import { amountToWei } from "./utils";

export const getOutputAmountAndSetToState = async (
  token,
  pair,
  route,
  value,
  setOutputValue,
  inputValueLocation
) => {
  try {
    if (token && pair && value) {
      if (!isNaN(value)) {
        let route;
        let path;
        let addressInput;
        let addressOutput;
        let addressMid;

        if (inputValueLocation == "0") {
          if (pair.length == 1) {
            route = new Route([...pair], token);

            addressInput = route.path[0].address;
            addressOutput = route.path[1].address;
            path = [addressInput, addressOutput];
          } else {
            route = new Route([pair[0], pair[1]], token);

            addressInput = route.path[0].address;
            addressMid = route.path[1].address;
            addressOutput = route.path[2].address;
            path = [addressInput, addressMid, addressOutput];
          }
        }
        if (inputValueLocation == "1") {
          if (pair.length == 1) {
            route = new Route([...pair], token);
            addressInput = route.path[0].address;
            addressOutput = route.path[1].address;
            path = [addressInput, addressOutput];
          } else {
            route = new Route([pair[1], pair[0]], token);
            addressInput = route.path[0].address;
            addressMid = route.path[1].address;
            addressOutput = route.path[2].address;
            path = [addressInput, addressMid, addressOutput];
          }
        }

        const decimals = token?.decimals;

        // execution price

        let amount = 10 ** decimals * Number(value);

        const trade = new Trade(
          route,
          new TokenAmount(token, amount),
          TradeType.EXACT_INPUT
        );
        const executionPrice = trade.executionPrice.toSignificant(6);
        let output = executionPrice * value;
        output = parseFloat(output);
        // console.log(output)
        // setOutputValue(output)
        // construct trade properties

        return [output, path, trade];
      }
    } else {
      setOutputValue(0);
      return [];
    }
  } catch (error) {
    return [];
    console.log(error);
  }
};

export const getOutputAmount = async (token, pair, route, value) => {
  try {
    if (token && pair) {
      if (!isNaN(value)) {
        const decimals = token?.decimals;
        let amount = 10 ** decimals * Number(value);
        let amountBigInt = amount;

        const tokenAmount = new TokenAmount(token, amountBigInt);

        const outputAmount = await pair.getOutputAmount(tokenAmount);
        const fraction = new Fraction(
          outputAmount[0].numerator,
          outputAmount[0].denominator
        );
        const output = fraction.toSignificant(6);

        return output;
      }
    }
  } catch (error) {
    console.log(error);
  }
};
