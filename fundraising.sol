// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Fundraising{
    address public owner;
    uint256 public goal;

    uint256 public totalRaised;
    mapping (address => uint256) public donations;

    event Donated(address indexed donor, uint256 amount);

    event Withdrawn(uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    constructor(uint256 _goal){
        owner = msg.sender;
        goal = _goal;
    }

    function donate() external payable {
        require(msg.value > 0,"Donation amount should be greater than 0");
        donations[msg.sender] += msg.value;
        totalRaised += msg.value;
        emit Donated(msg.sender,msg.value);
    }

    function withdraw()external onlyOwner{
        require(totalRaised >= goal ,"Fundraising goal not yet reached");
        uint256 amount = address(this).balance;
        payable(owner).transfer(amount);
        emit Withdrawn(amount);
    }

    function getBalance() external view returns (uint256){
        return address(this).balance;
    }
}