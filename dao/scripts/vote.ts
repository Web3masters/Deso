import * as fs from "fs"
import { network, ethers, getChainId } from "hardhat"
import { proposalsFile, developmentChains, VOTING_PERIOD } from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"


async function main() {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
  // Get the last proposal for the network. You could also change it for your index
  const chainID = await getChainId()
  const lastProposalId = proposals[chainID].at(-1)
  // const proposalId = proposals[network.config.chainId!][0];

  // 0 = Against, 1 = For, 2 = Abstain for this example
  const voteWay = 1;

  console.log({
    lastProposalId,
    voteWay,
  })

  await vote("0", voteWay, 1000000)
}

export async function vote(proposalId: string, voteWay: number, gasLimit: number) {
  console.log("Voting...")

  const governor = await ethers.getContract("GovernorContract")
  console.log("\nGovernorContract deployed")

  const voteTx = await governor.voteProposal(proposalId, voteWay, { gasLimit })
  console.log("\nVote tx sent")
  console.log(voteTx)

  const voteTxReceipt = await voteTx.wait(1)
  console.log("\nVote tx mined")
  console.log(voteTxReceipt)

  const proposalState = await governor.state(proposalId)

  console.log(`\nCurrent Proposal State: ${proposalState}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
