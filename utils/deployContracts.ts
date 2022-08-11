import { ethers } from "hardhat";

export async function deployNTN(creationTime: number) {
    const Contract = await ethers.getContractFactory("NTN");
    const contract = await Contract.deploy(creationTime);
    await contract.deployed();
    return contract
}

export async function deployNTS() {
    const Contract = await ethers.getContractFactory("NTS");
    const contract = await Contract.deploy();
    await contract.deployed();
    return contract
}

export async function deployStaking(token: any) {
    const Contract = await ethers.getContractFactory("Staking");
    const contract = await Contract.deploy(token);
    await contract.deployed();
    return contract
}

export async function deployVesting(beneficiaryAddress: any, startTimestamp: any, durationSeconds: any, cliff: any, token: any) {
    const Contract = await ethers.getContractFactory("Vesting");
    const contract = await Contract.deploy(beneficiaryAddress, startTimestamp, durationSeconds, cliff, token);
    await contract.deployed();
    return contract
}
