import { expect } from "chai";
import { Signer, BigNumber } from "ethers";
import { ethers } from "hardhat";
import { NTN } from "../typechain";
import { deployNTN } from "../utils/deployContracts"
import { currentTimestamp, increaseTime,increaseTimeDays } from "../utils/helpers"

describe("Test", function () {
  let ntn: NTN
  let owner: Signer
  let user: Signer
  let timestamp: number

  let maxValue = BigNumber.from("10500000000000000000000000000")

  beforeEach(async ()=>{
    [owner, user] = await ethers.getSigners()
    timestamp = await currentTimestamp() + 10
    ntn = await deployNTN(timestamp);

    await ethers.provider.send("evm_setNextBlockTimestamp", [timestamp])
    await ethers.provider.send("evm_mine", []) 
  })

  it("Test max supply", async()=>{   
    expect(await ntn.maxSupply(timestamp)).to.be.equal("0")
    expect(await ntn.maxSupply(timestamp+=1)).to.be.equal("1161085641018552120")
    expect(await ntn.maxSupply(timestamp+=1)).to.be.equal("2322171282037104241")
    expect(await ntn.maxSupply(timestamp+=1)).to.be.equal("3483256923055656362")

    expect(await ntn.maxSupply(timestamp += 31 * 24 * 60 * 60 - 3)).to.be.equal("3109851780904090000000000")
    expect(await ntn.maxSupply(timestamp += 31 * 24 * 60 * 60)).to.be.equal("6249641714442770000000000")
    expect(await ntn.maxSupply(timestamp += 30 * 24 * 60 * 60)).to.be.equal("10084889952511700000000000")
    expect(await ntn.maxSupply(timestamp += 2980 * 24 * 60 * 60) < maxValue).to.be.equal(true)

    let num = await ntn.maxSupply(timestamp += 1 * 24 * 60 * 60)
    expect(num.toString() == maxValue.toString())
  
    num = await ntn.maxSupply(timestamp += 1 * 24 * 60 * 60)
    expect(num.toString() == maxValue.toString())
  })

});
