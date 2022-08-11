// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NTS is ERC20, Ownable {
    uint256 public constant maxAmount =  1000000000 * 10**18;

    constructor() ERC20("NTS", "NTS") {}

    function mint(address _to, uint256 _amount) external onlyOwner {
        require(totalSupply() + _amount <= maxAmount, "Max amount exceeded");
        _mint(_to, _amount);
    }

    function burn(address _from, uint256 _amount) external onlyOwner {
        _burn(_from, _amount);
    }
}
