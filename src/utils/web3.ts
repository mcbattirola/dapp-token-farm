import Web3 from 'web3'

export const loadWeb3 = async (): Promise<Web3> => {
  if ((window as any).ethereum) {
    (window as any).web3 = new Web3((window as any).ethereum)
    await (window as any).ethereum.enable()
  } else if ((window as any).web3) {
    (window as any).web3 = new Web3((window as any).web3.currentProvider)
  } else {
    (window as any).alert('Non-Ethereum browser detected. You should consider trying MetaMask')
  }

  return (window as any).web3
}

export const fromWei = (value: string): string => {
  return (window as any).web3.utils.fromWei(value)
}

export const toWei = (value: string, from: string): string => {
  return (window as any).web3.utils.toWei(value, from)
}