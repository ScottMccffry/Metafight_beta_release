// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract BLPmetafight {
    event Deposit(address indexed user, uint amount);

    mapping (address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        payable(msg.sender).transfer(amount);
        balances[msg.sender] -= amount;
    }
}