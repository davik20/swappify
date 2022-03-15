import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type swapState = {
  chainId: number
  isConnected: boolean
  routerContract: any
  account: string
  web3: any
  walletConnectProvider: any
}

const initialState: swapState = {
  chainId: 1,
  isConnected: false,
  routerContract: undefined,
  account: '',
  web3: undefined,
  walletConnectProvider: undefined,
}

const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    isConnected: (swap, action: PayloadAction<boolean>) => {
      swap.isConnected = action.payload
    },
    setChainId: (swap, action) => {
      swap.chainId = action.payload
    },
    setRouterContract: (swap, action) => {
      swap.routerContract = action.payload
    },
    setWeb3: (swap, action) => {
      swap.web3 = action.payload
    },
    setWalletConnectProvider: (swap, action) => {
      swap.walletConnectProvider = action.payload
    },
    setAccount: (swap, action: PayloadAction<string>) => {
      swap.account = action.payload
    },
  },
})

export const {
  isConnected,
  setChainId,
  setAccount,
  setRouterContract,
  setWeb3,
  setWalletConnectProvider,
} = swapSlice.actions

export default swapSlice.reducer
