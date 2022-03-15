import Web3 from 'web3'
import WalletConnectProvider from '@walletconnect/web3-provider'

const getWeb3 = () => {
  let windowApp: any = {
    ...window,
  }
  let { ethereum } = windowApp

  return new Promise(async (resolve, reject) => {
    let chainId
    try {
      if (ethereum) {
        const web3 = new Web3(ethereum)

        chainId = await web3.eth.getChainId()

        resolve([web3, undefined, chainId])
      } else if (!ethereum) {
        const walletConnectProvider = await new WalletConnectProvider({
          infuraId: '3ee5b26be9d9451b96c018232c629555',
        })
        const provider = 'https://mainnet.infura.io/v3/3ee5b26be9d9451b96c018232c629555'

        const web3 = new Web3(new Web3.providers.HttpProvider(provider))
        chainId = await web3.eth.getChainId()
        resolve([web3, walletConnectProvider, chainId])
      }
    } catch (error) {
      reject(error)
    }
  })
}

export default getWeb3
