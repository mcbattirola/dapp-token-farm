
# 🧑‍🌾 Dapp Token Farm

## About
A DAI staking token farm with an React front-end.
The contract owner receives mDAI (a mock DAI implementation) tokens and can issue DAPP tokens as rewards.
The code includes the contracts (Solidity code), as well as an React front-end application to interact with it.
It also includes scripts to deploy and test the contracts.

The objective of this project is to learn about **Solidity** and **blockchain** development, it's not meant to be production code.

### Features
- Stake mDAI (mock DAI) tokens
- Unstake mDAI tokens
- The contract owner can issue DAPP tokens to reward stakers.

## Layout
<p>
<img src="https://github.com/mcbattirola/defi-token-farm/blob/main/layout.png" alt="project layout" />
</p>

## Running the project
Requirements:
- Local blockchain (Ganache)
- Yarn or npm
```bash
# install dependencies
yarn install

# run the web app, will run on port 3000
yarn start 

# deploy the contracts
truffle deploy

# issue tokens to currently staking accounts
truffle exec scripts/issue-tokens.js
```
### Run tests
```bash
truffle test
```

## Technologies
- Solidity
- React
- Truffle
