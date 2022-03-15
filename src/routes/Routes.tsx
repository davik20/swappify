import React, { FunctionComponent, useEffect } from 'react'
import { Switch, Route } from 'react-router'
import AppRoute from '../routes/AppRoute'
import AuthRoute from '../routes/AuthRoute'
import Login from '../pages/Login'
import PageNotFound from '../pages/PageNotFound'
import LandingPage from '../pages/Landing'
import Rick from '../pages/Rick'
import Swap from '../pages/Swap'
import axios from 'axios'
import net from 'net'

// web3 imports
import getWeb3 from '../functions/getWeb3'
import { ROUTER_ADDRESS } from '../Constants'
import RouterContractAbi from '../../contracts/RouterAbi.json'
import { useAppDispatch } from '../hooks/storeHooks'
import { setChainId, setRouterContract, setWeb3, setWalletConnectProvider } from '../store/swap/swapSlice'
import { setCoinData } from '../store/coinData/coinSlice'

const BASE_PATH = '/'
const buildPath = (path: string): string => `${BASE_PATH}${path}`

export const path = {
  home: buildPath(''),
  unitMapper: buildPath('test'),
  login: '/login',
  rick: '/rick',
  swap: '/swap',
}

const Routes: FunctionComponent = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const init = async () => {
      // set web3
      const result: any = await getWeb3()
      const [web3, walletConnectProvider, chainId] = result
      console.log('chain Id ', chainId)
      dispatch(setWeb3(web3))
      const RouterContract = new web3.eth.Contract(RouterContractAbi, ROUTER_ADDRESS)
      // set Router contract
      dispatch(setRouterContract(RouterContract))
      // set walletConnectProvider
      if (walletConnectProvider !== undefined) {
        dispatch(setWalletConnectProvider(walletConnectProvider))
      }
      // set chain Id
      dispatch(setChainId(chainId))
    }

    init()
  }, [])

  useEffect(() => {
    // API REFERENCE
    //     fully_diluted_market_cap: 8155142.63
    // last_updated: "2021-08-11T12:03:07.000Z"
    // market_cap: 0
    // market_cap_dominance: 0
    // percent_change_1h: 0.16382065
    // percent_change_7d: -7.08041107
    // percent_change_24h: -3.5091964
    // percent_change_30d: -40.43048677
    // percent_change_60d: 23.95446106
    // percent_change_90d: 0
    // price: 0.00081551426296
    setTimeout(() => {
      console.log('fetching data')
      axios.get('https://prices-cuminu.herokuapp.com/api/coinData').then(({ data }) => {
        const { max_supply: totalSupply } = data
        const { USD } = data.quote
        const {
          fully_diluted_market_cap: marketCap,
          percent_change_24h: dailyChange,
          price,
          volume_24h: dailyVolume,
          percent_change_1h: hourlyChange,
        } = USD
        dispatch(
          setCoinData({
            marketCap,
            price,
            totalSupply,
            dailyChange,
            dailyVolume,
            hourlyChange,
          }),
        )
      })
    }, 10000)
  }, [])
  return (
    <Switch>
      <Route exact path={path.home} component={LandingPage} />
      <AuthRoute exact path={path.login} component={Login} />
      <AppRoute exact path={path.home} component={() => <div></div>} />
      <AppRoute exact path={path.unitMapper} component={() => <div></div>} />
      <AppRoute exact path={path.rick} component={Rick} />
      <AppRoute exact path={path.swap} component={Swap} />
      <Route component={PageNotFound} />
    </Switch>
  )
}

export default Routes
