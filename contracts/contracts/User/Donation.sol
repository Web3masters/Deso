// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "../../node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Donation {
    using SafeMath for uint256; // For versions < 0.6

    mapping(address => uint256) public addressToFunded;
    address public owner;

    // Funders test is by array index
    address[] public funders;

    AggregatorV3Interface internal dataFeed;

     /**
     * Network: Sepolia
     * Aggregator: ETH/USD
     * Address: 0x694AA1769357215DE4FAC081bf1f309aDC325306
     */

    constructor() {
        dataFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        owner = msg.sender;
    }

    // Function that allows user to deposit 
    function transferFunds(address payable recipient) public payable {
        // Optional: minimum input value
        // uint256 minimumUSD = 1 * 10 ** 18;
        // require(convertETHToUSD(msg.value) >= minimumUSD, "The minimum value(1 U$) was not reached!");
        
        addressToFunded[msg.sender] += msg.value;
        funders.push(msg.sender);
        recipient.transfer(address(this).balance);
    }

    // Function that returns the balance of contract
    function balance() public view returns (uint256) {
        return address(this).balance;
    }
    
    // Function that converts get the price from data feed
    function getPriceData() public view returns (uint256) {
        (,int256 price,,,) = dataFeed.latestRoundData();
        return uint256(price *  100000000);
        // 190275000000 -> 8 decimals -> 1,902.75000000
    }

    // Function that get the version of data feed
    function getVersion() public view returns(uint256) {
        return dataFeed.version();
    }

    // Function that get the conversion rate ETH/USD
    function convertETHToUSD(uint256 ethAmount) public view returns (uint256) {
        uint256 ethPrice = getPriceData();
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1000000000000000000;
        
        return ethAmountInUsd;
        // 1 gwei(1000000000) to U$
    }

    // Function that get the conversion rate USD/ETH
    function convertUSDToETH(uint256 usdAmount) public view returns (uint256) {
        uint256 ethPrice = getPriceData();
        // uint256 ethAmount = (usdAmount * 10 **10)/ (ethPrice);
        uint256 ethAmount = (usdAmount  * 10 ** 18 / ethPrice);

        return ethAmount;
    }

    // Modifier that checks if the user is the contract owner
    modifier isOwner {
        require(msg.sender == owner, "You're not the contract owner");
        _;
    }

    // Function that withdraw the amount sent to the fund
    function withdraw() payable isOwner public {
        // Send the money deposited to the contract owner
        payable(msg.sender).transfer(address(this).balance);

        // Reseting all the variables
        for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToFunded[funder] = 0;
        }
        funders = new address[](0);
    }
}