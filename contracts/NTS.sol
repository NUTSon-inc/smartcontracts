// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract NTS is ERC20, Ownable, ERC20Permit, ERC20Votes {
    uint256 public constant maxAmount =  1000000000 * 10**18;

    constructor() ERC20("NTS", "NTS") ERC20Permit("NTS") {}

    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address _to, uint256 _amount) internal override(ERC20, ERC20Votes) onlyOwner {
        super._mint(_to, _amount);
    }

    function _burn(address _from, uint256 _amount) internal override(ERC20, ERC20Votes) onlyOwner {
        super._burn(_from, _amount);
    }

    function mint(address _to, uint256 _amount) external onlyOwner {
        require(totalSupply() + _amount <= maxAmount, "Max amount exceeded");
        _mint(_to, _amount);
    }

    function burn(address _from, uint256 _amount) external onlyOwner {
        _burn(_from, _amount);
    }
}
