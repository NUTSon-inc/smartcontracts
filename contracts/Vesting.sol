// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IERC20Mintable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vesting is Ownable {
    event Released(uint256 amount);

    IERC20Mintable public immutable _token;
    uint256 public _released;
    address public immutable _beneficiary;
    uint256 public immutable _start;
    uint256 public immutable _duration;
    uint256 public immutable _cliff;

    constructor(
        address beneficiaryAddress,
        uint256 startTimestamp,
        uint256 durationSeconds,
        uint256 cliff,
        IERC20Mintable token
    ) {
        require(
            beneficiaryAddress != address(0),
            "beneficiary is zero address"
        );
        _beneficiary = beneficiaryAddress;
        _start = startTimestamp;
        _duration = durationSeconds;
        _cliff = cliff;
        _token = token;
    }

    function release() external {
        (uint256 _releasable, ) = releasable(uint256(block.timestamp));

        require(_releasable > 0, "Can't claim yet!");

        _released += _releasable;
        emit Released(_releasable);
        _token.transfer(_beneficiary, _releasable);
    }

    function releasable(uint256 timestamp)
        public
        view
        returns (uint256 canClaim, uint256 earnedAmount)
    {
        (canClaim, earnedAmount) = _vestingSchedule(
            _token.balanceOf(address(this)) + _released,
            timestamp
        );
        canClaim -= _released;
    }

    function vestedAmount(uint256 timestamp)
        public
        view
        virtual
        returns (uint256 vestedAmount, uint256 maxAmount)
    {
        maxAmount = _token.balanceOf(address(this)) + _released;
        (, vestedAmount) = _vestingSchedule(maxAmount, timestamp);
    }

    function _vestingSchedule(uint256 totalAllocation, uint256 timestamp)
        internal
        view
        virtual
        returns (uint256, uint256)
    {
        if (timestamp < _start) {
            return (0, 0);
        } else if (timestamp > _start + _duration) {
            return (totalAllocation, totalAllocation);
        } else {
            uint256 res = (totalAllocation * (timestamp - _start)) / _duration;

            if (timestamp < _start + _cliff) return (0, res);
            else return (res, res);
        }
    }

    function emergancyVest() external onlyOwner {
        _token.transfer(owner(), _token.balanceOf(address(this)));
    }
}
