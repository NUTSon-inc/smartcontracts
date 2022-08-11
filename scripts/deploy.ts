import hre, { ethers } from "hardhat";
import { deployNTN, deployNTS, deployStaking, deployVesting } from "../utils/deployContracts";

let myaddr = "0x2ee51F0bCC1ece7B94091e5E250b08e8276256D9"
let gnosis = "0xf1aA2527830AFdCBA2fFcEdA422710Cc412527f8"
let ntn = "0xC2Ec00721E23C0a579FeF663B89E918A181668F9"

function timeNow() {
  return Math.floor(Date.now() / 1000)
}

function days(i: number) {
  return i * 86400
}

async function main() {
  console.log("Owner: ", await (await ethers.getSigners())[0].getAddress());
  
  // let ntn = await deployNTN()
  // let nts = await deployNTS()

  let time = timeNow()
  console.log(time);
  
  // let vesting1 = await deployVesting(myaddr, time, days(62), 0, ntn)
  // let vesting2 = await deployVesting(myaddr, time, days(31), days(10), ntn)

  // console.log(vesting1.address);
  // console.log(vesting2.address);

  // await new Promise(f => setTimeout(f, 20000));

  // await verify(vesting1.address, [myaddr, time, days(62), 0, ntn])
  // await verify(vesting2.address, [myaddr, time, days(31), days(10), ntn])
}

async function verify(address: any, args: any) {
  return hre.run("verify:verify", {address: address, constructorArguments: args,});
}

async function increaseTime(seconds: any) {
  await ethers.provider.send("evm_increaseTime", [seconds])
  await ethers.provider.send("evm_mine", [])
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
