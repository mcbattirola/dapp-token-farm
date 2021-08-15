import React, { useState, useEffect } from 'react'
import Web3 from 'web3'

import Navbar from './Navbar'
import Balance from './Balance'
import StakeForm from './StakeForm'
import './App.css'

import { fromWei, loadWeb3 } from '../utils/web3'
import { DaiToken, DappToken, TokenFarm } from '../abis/index'

const App = () => {

  const [account, setAccount] = useState('0x0')
  const [daiToken, setDaiToken] = useState<any>()
  const [dappToken, setDappToken] = useState<any>()
  const [tokenFarm, setTokenFarm] = useState<any>()
  const [daiTokenBalance, setDaiTokenBalance] = useState<string>('0')
  const [dappTokenBalance, setDappTokenBalance] = useState<string>('0')
  const [stakingBalance, setStakingBalance] = useState<string>('0')
  const [isLoading, setIsLoading] = useState<Boolean>(true)
  const [web3, setWeb3] = useState<Web3 | null>(null)

  const loadBlockchainData = async (web3: Web3) => {
    const accounts = await web3.eth.getAccounts()
    const userAccount = accounts[0]
    setAccount(userAccount)

    const networkId = await web3.eth.net.getId()

    // load DAI
    const daiTokenData = DaiToken.networks[networkId.toString()]
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      setDaiToken(daiToken)
      const daiTokenBalance = await daiToken.methods.balanceOf(userAccount).call()
      setDaiTokenBalance(daiTokenBalance)
    } else {
      window.alert("DaiToken contract not found on network")
    }

    // load Dapp
    const dappTokenData = DappToken.networks[networkId.toString()]
    if (dappTokenData) {
      const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)
      setDappToken(dappToken)
      const dappTokenBalance = await dappToken.methods.balanceOf(userAccount).call()
      setDappTokenBalance(dappTokenBalance)
    } else {
      window.alert("DappToken contract not found on network")
    }

    // load tokenFarm
    const tokenFarmData = TokenFarm.networks[networkId.toString()]
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      setTokenFarm(tokenFarm)

      const stakingBalance = await tokenFarm.methods.stakingBalance(userAccount).call()
      setStakingBalance(stakingBalance)
    } else {
      window.alert("TokenFarm contract not found on network")
    }

  }

  useEffect(() => {
    setIsLoading(true)
    loadWeb3().then((web3: Web3) => {
      setWeb3(web3)
      loadBlockchainData(web3)
      setIsLoading(false)
    })
  }, [])

  const stakeTokens = (amount: string) => {
    setIsLoading(true)
    daiToken.methods.approve(tokenFarm._address, amount).send({ from: account }).on('transactionHash', (hash: string) => {
      console.log("approve hash", hash)
      tokenFarm.methods.stakeTokens(amount).send({ from: account }).on('transactionHash', (hash: string) => {
        if (web3) {
          loadBlockchainData(web3)
        }
        setIsLoading(false)
      })
    })
  }

  const unstakeTokens = (amount: string) => {
    setIsLoading(true)
    tokenFarm.methods.unstakeTokens(amount).send({ from: account }).on('transactionHash', (hash: string) => {
      console.log("unstake hash: ", hash)
      if (web3) {
        loadBlockchainData(web3)
      }
      setIsLoading(false)
    })
  }

  return (
    <div>
      <Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
            <div className="content mr-auto ml-auto">
              <a
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
              </a>

              {isLoading ?
                <h1>Loading...</h1>
                :
                <div>
                  <div>
                    Reward Balance: {fromWei(dappTokenBalance)} Dapp Tokens
                  </div>

                  <StakeForm
                    daiTokenBalance={daiTokenBalance}
                    stakeTokens={stakeTokens}
                    unstakeTokens={unstakeTokens}
                    stakingBalance={stakingBalance}
                  />
                </div>
              }
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
