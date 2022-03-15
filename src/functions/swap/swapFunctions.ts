import { Percent, WETH } from '@uniswap/sdk'
import toast from 'react-hot-toast'
import store from '../../store/store'
import { setRouterContract } from '../../store/swap/swapSlice'

export const swapExactETHForTokens = async tradeEntity => {
  const { routerContract, account } = store.getState().swap
  const { path: pathState, trade } = tradeEntity
  const slippageTolerance = new Percent('50', '10000') // 50 bips, or 0.50%

  const amountOutMin = String(trade.minimumAmountOut(slippageTolerance).raw) // needs to be converted to e.g. hex

  const path: string[] = [...pathState]
  const to = account // should be a checksummed recipient addres
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20
  const value = String(trade.inputAmount.raw) // // needs to be converted to e.g. hex

  await sendTransaction(
    routerContract.methods.swapExactETHForTokens(amountOutMin, path, account, deadline).send({
      value,
      from: account.toLowerCase(),
    }),
  )
}

export const swapExactTokensForETH = async tradeEntity => {
  //   console.log('swap exact tokens for eth')
  const { routerContract, account } = store.getState().swap
  const { path: pathState, trade } = tradeEntity

  const path: string[] = [...pathState]
  const slippageTolerance = new Percent('50', '10000') // 50 bips, or 0.50%
  const amountOutMin = String(trade.minimumAmountOut(slippageTolerance).raw) // needs to be converted to e.g. hex
  const amountIn = String(trade.inputAmount.raw) // // needs to be converted to e.g. hex
  //   console.log(amountIn)
  //   console.log(amountOutMin, ' amount ojut')
  //   console.log(path)
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20
  await sendTransaction(
    routerContract.methods
      .swapExactTokensForETH(amountIn, amountOutMin, path, account.toLowerCase(), deadline)
      .send({ from: account.toLowerCase() }),
  )
}
export const swapExactTokensForTokens = async tradeEntity => {
  //   console.log('swap exact tokens for tokens')
  const { routerContract, account, web3 } = store.getState().swap
  const { path: pathState, trade } = tradeEntity

  const path: string[] = [...pathState]
  //   console.log(path)
  const slippageTolerance = new Percent('50', '10000') // 50 bips, or 0.50%
  const amountOutMin = String(trade.minimumAmountOut(slippageTolerance).raw) // needs to be converted to e.g. hex
  const amountIn = String(trade.inputAmount.raw) // // needs to be converted to e.g. hex
  //   console.log(amountIn)
  //   console.log(amountIn)
  //   console.log(amountOutMin, ' amount ojut')
  //   console.log(path)
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20
  await sendTransaction(
    routerContract.methods
      .swapExactTokensForTokens(amountIn, amountOutMin, path, account.toLowerCase(), deadline)
      .send({ from: account.toLowerCase() }),
  )
}

export async function sendTransaction(transaction) {
  let toastId
  await transaction
    .on('transactionHash', hash => {
      toastId = toast.loading('Transaction in progress')
      //   console.log(hash)
    })
    .on('receipt', () => {
      toast.dismiss(toastId)
      toast.success('Transaction Successful')
    })
    .on('error', error => {
      toast.error('An Error Occured')
      toast.dismiss(toastId)
      console.log(error)
    })
    .catch(error => {
      console.log(error)
    })
}
