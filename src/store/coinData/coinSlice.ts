import { createSlice } from '@reduxjs/toolkit'

interface coinState {
  data: {
    marketCap: number
    price: number
    totalSupply: number
    dailyChange: number
    dailyVolume: number
    hourlyChange: number
  }
}

const initialState: coinState = {
  data: {
    marketCap: 0,
    price: 0,
    totalSupply: 0,
    dailyChange: 0,
    dailyVolume: 0,
    hourlyChange: 0,
  },
}

const coinSlice = createSlice({
  name: 'coinSlice',
  initialState,
  reducers: {
    setCoinData: (coinState, action) => {
      coinState.data = action.payload
    },
  },
})

export const { setCoinData } = coinSlice.actions

export default coinSlice.reducer
