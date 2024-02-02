// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../../node_modules/@openzeppelin/contracts/utils/Counters.sol";

struct Comment {
    address user;
    string comment;
}

contract Image {
    using Counters for Counters.Counter;

    Counters.Counter private postIdCounter;

    uint public id;
    address public owner; // user
    string public imageUrl;
    string public timestamp;
    string public content; // post
    string public postType = "image"; // "image"
    address[] public likes;
    address[] public dislikes;
    Counters.Counter private commentIdCounter;
    mapping(uint => Comment) public comments;

    constructor(
        uint _id,
        string memory _timestamp,
        string memory _imageUrl,
        string memory _content
    ) {
        id = _id;
        timestamp = _timestamp;
        imageUrl = _imageUrl;
        content = _content;

        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    function addComment(string memory _comment) public {
        commentIdCounter.increment();
        comments[commentIdCounter.current()] = Comment(msg.sender, _comment);
    }

    function like() public {
        likes.push(msg.sender);
    }

    function dislike() public {
        dislikes.push(msg.sender);
    }

    function getLikes() public view returns (address[] memory) {
        return likes;
    }

    function getDislikes() public view returns (address[] memory) {
        return dislikes;
    }

    function getComments() public view returns (Comment[] memory) {
        Comment[] memory _comments = new Comment[](commentIdCounter.current());
        for (uint i = 0; i < commentIdCounter.current(); i++) {
            _comments[i] = comments[i];
        }
        return _comments;
    }

    function getImage()
        public
        view
        returns (
            uint,
            string memory,
            string memory,
            string memory,
            string memory,
            address[] memory,
            address[] memory,
            Comment[] memory
        )
    {
        return (
            id,
            timestamp,
            imageUrl,
            content,
            postType,
            likes,
            dislikes,
            getComments()
        );
    }
}
