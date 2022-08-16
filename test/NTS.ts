import { expect } from "chai";
import { Signer, BigNumber } from "ethers";
import { ethers } from "hardhat";
import { NTS } from "../typechain";
import { deployNTS } from "../utils/deployContracts"

describe("Test", function () {
  let nts: NTS
  let owner: Signer
  let user: Signer

  let maxValue = BigNumber.from("7000000000000000000000000000")

  beforeEach(async ()=>{
    [owner, user] = await ethers.getSigners()

    nts = await deployNTS()
  })

  it("mint and burn works", async() => {
    expect(await nts.balanceOf(await user.getAddress())).to.be.equal("0")
    await nts.mint(await user.getAddress(), "1000000000000000000000000000")
    expect(await nts.balanceOf(await user.getAddress())).to.be.equal("1000000000000000000000000000")
    await nts.burn(await user.getAddress(), "1000000000000000000000000000")
    expect(await nts.balanceOf(await user.getAddress())).to.be.equal("0")
  })
})