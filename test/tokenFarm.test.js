const { assert } = require('chai');

const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require("TokenFarm");

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'Ether')
}

contract('TokenFarm', ([owner, investor]) => {
    let daiToken, dappToken, tokenFarm

    before(async () => {
        // Load contracts
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        // Transfer all Dapp Tokens to farm (1 million)
        await dappToken.transfer(tokenFarm.address, tokens('1000000'))

        // Send tokens to investor
        await daiToken.transfer(investor, tokens('100'), { from: owner })
    })

    describe('Mock DAI deployment', async () => {
        it('has a name', async () => {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })

    describe('Dapp Token deployment', async () => {
        it('has a name', async () => {
            const name = await dappToken.name()
            assert.equal(name, 'DApp Token')
        })
    })

    describe('Token Farm deployment', async () => {
        it('has a name', async () => {
            const name = await tokenFarm.name()
            assert.equal(name, 'Dapp Token Farm')
        })

        it('has tokens', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('Farming tokens', async () => {
        it('rewards investors for staking mDai tokens', async () => {
            let investorBalance

            // Check investor balance before staking
            investorBalance = await daiToken.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')

            // Stake Mock DAI tokens
            await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
            await tokenFarm.stakeTokens(tokens('100'), { from: investor })

            // Check staking result
            investorBalance = await daiToken.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking')

            let farmBalance = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(farmBalance.toString(), tokens('100'), 'Token Farm Mock DAI wallet balance correct after staking')

            investorBalance = await tokenFarm.stakingBalance(investor)
            assert.equal(investorBalance.toString(), tokens('100'), 'investor stakign balance correct after staking')

            let isStaking = await tokenFarm.isStaking(investor)
            assert.equal(isStaking.toString(), 'true', 'investor staking status correct after staking')

            // Issue Tokens
            await tokenFarm.issueTokens({ from: owner })

            // Check balances after issuance
            investorBalance = await dappToken.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'), 'investor DApp Token wallet balance correct after issuance')

            // Ensure that only owner can issue tokens
            await tokenFarm.issueTokens({ from: investor }).should.be.rejected

            // Withdrawn tokens
            await tokenFarm.unstakeTokens(tokens('20'), { from: investor })

            // Investor tokens
            investorBalance = await daiToken.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('20'), 'investor DAI wallet balance correct after withdrawn')
            // Check if correct amount will be issued now
            await tokenFarm.issueTokens({ from: owner })
            investorBalance = await dappToken.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('180'), 'investor DApp Token wallet balance correct after withdrawn and issuance')

            // Farm tokens
            farmBalance = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(farmBalance.toString(), tokens('80'), 'Token Farm Mock DAI balance correct after investor withdrawn')

            // Withdrawn remaining tokens
            await tokenFarm.unstakeTokens(tokens('80'), { from: investor })
            investorBalance = await daiToken.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'), 'investor DAI wallet balance correct after withdrawn')
            isStaking = await tokenFarm.isStaking(investor)
            assert(isStaking.toString(), 'false', 'investor staking status correct after unstaking')
        })
    })
})
