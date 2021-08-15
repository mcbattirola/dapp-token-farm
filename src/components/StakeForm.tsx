import React from 'react'
import { useRef } from 'react'
import dai from '../dai.png'
import { fromWei, toWei } from '../utils/web3'

export interface StakeFormProps {
    daiTokenBalance: string,
    stakeTokens: (amount: string) => void,
    unstakeTokens: (amount: string) => void,
    stakingBalance: string,
}

const StakeForm = ({ daiTokenBalance, stakeTokens, stakingBalance, unstakeTokens }: StakeFormProps) => {
    const stakeInputRef = useRef<HTMLInputElement>(null)
    const unstakeInputRef = useRef<HTMLInputElement>(null)

    const handleStakeSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault()
        if (stakeInputRef.current) {
            const amount = toWei(stakeInputRef.current.value, 'Ether')

            stakeTokens(amount)
        }
    }

    const handleUnstakeSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault()
        if (unstakeInputRef.current) {
            const amount = toWei(unstakeInputRef.current.value, 'Ether')

            unstakeTokens(amount)
        }
    }

    return (
        <div>
            <div className="card mb-4" >

                <div className="card-body">

                    <form className="mb-3" onSubmit={handleStakeSubmit} >
                        <div>
                            <label className="float-left"><b>Stake Tokens</b></label>
                            <span className="float-right text-muted">
                                Balance: {fromWei(daiTokenBalance)}
                            </span>
                        </div>
                        <div className="input-group mb-4">
                            <input
                                ref={stakeInputRef}
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="0"
                                name="amount"
                                required />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <img src={dai} height='32' alt="" />
                                    &nbsp;&nbsp;&nbsp; mDAI
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block btn-lg">STAKE!</button>
                    </form>

                </div>
            </div>

            <div className="card mb-4" >
                <div className="card-body">

                    <form onSubmit={handleUnstakeSubmit}>
                        <div>
                            <label className="float-left"><b>Unstake Tokens</b></label>
                            <span className="float-right text-muted">
                                Staking Balance: {fromWei(stakingBalance)}
                            </span>
                        </div>
                        <div className="input-group mb-4">
                            <input
                                ref={unstakeInputRef}
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="0"
                                name="amount"
                                required />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <img src={dai} height='32' alt="" />
                                    &nbsp;&nbsp;&nbsp; mDAI
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-secondary btn-block btn-lg">
                            UN-STAKE...
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default StakeForm