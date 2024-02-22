import { ethers, getChainId, network } from "hardhat"
import {
    developmentChains,
    VOTING_DELAY,
    proposalsFile,
    FUNC,
    PROPOSAL_DESCRIPTION,
    NEW_STORE_VALUE,
} from "../helper-hardhat-config"
import * as fs from "fs"
import { moveBlocks } from "../utils/move-blocks"

export async function getProposals() {
    const governor = await ethers.getContract("GovernorContract")
    const proposals = await governor.getAllProposals();

    // struct Proposal {
    //     uint256 id;
    //     string title;
    //     string description;
    //     string pullRequestUrl;
    //     address proposer;
    //     uint256 eta;
    //     uint256 startBlock;
    //     uint256 endBlock;
    //     address[] forVotes; // uint256 forVotes;
    //     address[] againstVotes; // uint256 againstVotes;
    //     address[] abstainVotes; // uint256 abstainVotes;
    //     bool canceled;
    //     bool executed;
    // }

    const formattedProposals = proposals.map((proposal: any) => {
        return {
            id: proposal.id.toString(),
            title: proposal.title,
            description: proposal.description,
            pullRequestUrl: proposal.pullRequestUrl,
            proposer: proposal.proposer,
            eta: proposal.eta.toString(),
            startBlock: proposal.startBlock.toString(),
            endBlock: proposal.endBlock.toString(),
            forVotes: proposal.forVotes.map((address: string) => address.toString()),
            againstVotes: proposal.againstVotes.map((address: string) => address.toString()),
            abstainVotes: proposal.abstainVotes.map((address: string) => address.toString()),
            canceled: proposal.canceled,
            executed: proposal.executed,
        }
    })

    console.log(formattedProposals);
}

getProposals()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    })
