// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NTN is ERC20, Ownable {
    uint256 constant MAX_VALUE = 7_000_000_000 ether;

    uint256[] emission = [
        0, 
        1750000000 ether,
        3150000000 ether,
        4550000000 ether,
        5600000000 ether,
        6300000000 ether,
        MAX_VALUE
    ];

    uint256[] daysIncremented = [ //lets assume start date is 01.september
        0,
        30,
        61,
        91,
        122,
        153,
        type(uint).max
    ];

    uint256 immutable createDate;
    uint256 constant daysIncrementedLength = 7;

    constructor(uint256 _createDate) ERC20("NTN", "NTN") {
        createDate = _createDate;
    }

    function mint(address _to, uint256 _amount) external onlyOwner {
        require(totalSupply() + _amount <= maxSupply(block.timestamp), "Can't mint more then total amount");
        _mint(_to, _amount);
    }

    function canMint(uint256 timestamp) external view onlyOwner returns(uint256) {
        return maxSupply(timestamp) - totalSupply();
    }

    function burn(address _from, uint256 _amount) external onlyOwner {
        _burn(_from, _amount);
    }

    function maxSupply(uint256 currentTimestamp) public view returns (uint256) {
        uint256 _secondsPassed = secondsPassed(currentTimestamp);
        uint256 dayNow = _secondsPassed / 86400;
        uint256 index = findUpperBound(dayNow);
        uint256 timePassed;
        uint256 interval;

        if (index == daysIncrementedLength - 1)
            return MAX_VALUE;

        else if (index > 0) {
            timePassed = _secondsPassed - daysIncremented[index - 1] * 86400;
            interval = (daysIncremented[index] - daysIncremented[index - 1]) * 86400;
        }
        else {
            index = 1;
            timePassed = _secondsPassed;
            interval = daysIncremented[index] * 86400;
        }

        return emission[index - 1] + ((emission[index] - emission[index - 1]) * timePassed) / interval;
    }

    function findUpperBound(uint256 element) internal view returns (uint256) {
        uint256 low = 0;
        uint256 high = daysIncrementedLength;
        uint256 mid;

        while (low < high) {
            mid = (low + high) / 2;

            if (daysIncremented[mid] > element) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }

        if (low > 0 && daysIncremented[low - 1] == element) {
            return low - 1;
        } else {
            return low;
        }
    }

    function secondsPassed(uint256 currentTimestamp) public view returns (uint256) {
        return currentTimestamp - createDate;
    }
}
