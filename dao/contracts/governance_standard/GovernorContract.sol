// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../../node_modules/@openzeppelin/contracts/governance/Governor.sol";
import "../../node_modules/@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "../../node_modules/@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "../../node_modules/@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "../../node_modules/@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "../../node_modules/@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";

contract GovernorContract is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    uint256 private proposalId = 0;

    struct Proposal {
        uint256 id;
        string title;
        string description;
        string pullRequestUrl;
        address proposer;
        uint256 eta;
        uint256 startBlock;
        uint256 endBlock;
        address[] forVotes; // uint256 forVotes;
        address[] againstVotes; // uint256 againstVotes;
        address[] abstainVotes; // uint256 abstainVotes;
        bool canceled;
        bool executed;
    }
    mapping(uint256 => Proposal) public proposals;

    constructor(
        IVotes _token,
        TimelockController _timelock,
        uint256 _quorumPercentage,
        uint256 _votingPeriod,
        uint256 _votingDelay
    )
        Governor("GovernorContract")
        GovernorSettings(
            _votingDelay /* 1 block */, // voting delay
            _votingPeriod, // 45818, /* 1 week */ // voting period
            0 // proposal threshold
        )
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(_quorumPercentage)
        GovernorTimelockControl(_timelock)
    {}

    function votingDelay() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }

    // The following functions are overrides required by Solidity.

    function quorum(
        uint256 blockNumber
    ) public view override(IGovernor, GovernorVotesQuorumFraction) returns (uint256) {
        return super.quorum(blockNumber);
    }

    function getVotes(
        address account,
        uint256 blockNumber
    ) public view override(IGovernor, Governor) returns (uint256) {
        return super.getVotes(account, blockNumber);
    }

    function state(
        uint256 _proposalId
    ) public view override(Governor, GovernorTimelockControl) returns (ProposalState) {
        return super.state(_proposalId);
    }

    function createProposal(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory title,
        string memory pullRequestUrl,
        string memory description
    ) public returns (uint256) {
        Proposal memory proposal = Proposal({
            id: 0,
            proposer: msg.sender,
            title: title,
            description: description,
            pullRequestUrl: pullRequestUrl,
            eta: 0,
            startBlock: block.number,
            endBlock: block.number + votingPeriod(),
            forVotes: new address[](0),
            againstVotes: new address[](0),
            abstainVotes: new address[](0),
            canceled: false,
            executed: false
        });

        proposals[proposalId] = proposal;
        proposalId++;

        return super.propose(targets, values, calldatas, description);
    }

    function getAllProposals() public view returns (Proposal[] memory) {
        Proposal[] memory allProposals = new Proposal[](proposalId);
        for (uint256 i = 0; i < proposalId; i++) {
            allProposals[i] = proposals[i];
        }

        return allProposals;
    }

    function getProposal(uint256 _proposalId) public view returns (Proposal memory) {
        return proposals[_proposalId];
    }

    function voteProposal(
        uint256 _proposalId,
        uint8 support
    ) public virtual returns (uint256 balance) {
        // add vote to proposal
        Proposal storage proposal = proposals[_proposalId];

        if (support == 0) {
            proposal.againstVotes.push(msg.sender);
        } else if (support == 1) {
            proposal.forVotes.push(msg.sender);
        } else if (support == 2) {
            proposal.abstainVotes.push(msg.sender);
        }

        return support;
        // return super.castVote(_proposalId, support);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function executeProposal(
        uint256 _proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) public virtual returns (uint256) {
        Proposal storage proposal = proposals[_proposalId];
        proposal.executed = true;

        super._execute(_proposalId, targets, values, calldatas, descriptionHash);

        return _proposalId;
    }

    function _execute(
        uint256 _proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(_proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(Governor, GovernorTimelockControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
