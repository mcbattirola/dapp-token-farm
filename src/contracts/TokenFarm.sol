pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    address public owner;

    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // Stake tokens (Deposit)
    function stakeTokens(uint256 _amount) public {
        // Require amount greater than 0
        require(_amount > 0, "amount cannot be 0");

        // Transfer (mock) Dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // add user to stakers array only if they haven't staked already
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    // Unstaking Tokens (withdraw)
    function unstakeTokens(uint256 _amount) public {
        require(_amount > 0, "amount cannot be 0");

        uint balance = stakingBalance[msg.sender];

        require(balance >= _amount, "cannot unstake more than balance");
        
        daiToken.transfer(msg.sender, _amount);
        uint newBalance = stakingBalance[msg.sender] - _amount;
        stakingBalance[msg.sender] = newBalance;

        if (newBalance > 0) {
            isStaking[msg.sender] = false;
        }
        
    }

    // Issuing Tokens
    function issueTokens() public {
        require(msg.sender == owner, "only owner can call");

        // Issue tokens to all stakers
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }
}
