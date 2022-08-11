import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";
import { exit } from "process";
import { NTS, Staking, Vesting } from "../typechain";
import { deployNTS, deployVesting } from "../utils/deployContracts"
import { currentTimestamp, increaseTime } from "../utils/helpers"

describe("Test", function () {
  let token: NTS
  let vesting: Vesting
  let owner: SignerWithAddress
  let receiver: SignerWithAddress

  before(async()=>{
    [owner, receiver] = await ethers.getSigners()
    token = await deployNTS()
    vesting = await deployVesting(receiver.address, await currentTimestamp(), 1000, 100, token.address)
    await token.mint(vesting.address, 1000)
  })

  it("Cliff works", async() => {
    await increaseTime(50)
    expect((await vesting.releasable(await currentTimestamp()))[0]).to.be.equal(0)
    expect((await vesting.releasable(await currentTimestamp()))[1]).to.be.equal(52)
    await increaseTime(50)
    expect((await vesting.releasable(await currentTimestamp()))[0]).to.be.equal(102)
    expect((await vesting.releasable(await currentTimestamp()))[1]).to.be.equal(102)

  })

  it("Releasable And VestedAmount works works", async() => {
    
    expect((await vesting.vestedAmount(await currentTimestamp()))[0]).to.be.equal(102)
    expect((await vesting.vestedAmount(await currentTimestamp()))[1]).to.be.equal(1000)

    await vesting.release()
    expect((await vesting.releasable(await currentTimestamp()))[0]).to.be.equal(0)
    expect((await vesting.releasable(await currentTimestamp()))[1]).to.be.equal(103)

    expect((await vesting.vestedAmount(await currentTimestamp()))[0]).to.be.equal(103)
    expect((await vesting.vestedAmount(await currentTimestamp()))[1]).to.be.equal(1000)
    expect(await token.balanceOf(await receiver.getAddress())).to.be.equal(103)  

    await increaseTime(899)
    expect((await vesting.releasable(await currentTimestamp()))[0]).to.be.equal(897)
    expect((await vesting.releasable(await currentTimestamp()))[1]).to.be.equal(1000)
    
    await increaseTime(1000)
    expect((await vesting.releasable(await currentTimestamp()))[0]).to.be.equal(897)
    expect((await vesting.releasable(await currentTimestamp()))[1]).to.be.equal(1000)    

    await vesting.release()
    expect((await vesting.releasable(await currentTimestamp()))[0]).to.be.equal(0)
    expect((await vesting.releasable(await currentTimestamp()))[1]).to.be.equal(1000)    
    expect((await vesting.vestedAmount(await currentTimestamp()))[0]).to.be.equal(1000)
    expect((await vesting.vestedAmount(await currentTimestamp()))[1]).to.be.equal(1000)

  })

})