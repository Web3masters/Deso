// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../node_modules/@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract ProfileDNFTFactory {
    using Counters for Counters.Counter;

    Counters.Counter private profileIdCounter;
    mapping(address => address) private userToProfile;

    event ProfileCreated(address indexed user, address indexed profile);

    function createProfileDNFT(uint _updateInterval) external {
        require(
            userToProfile[msg.sender] == address(0),
            "ProfileDNFTFactory: Profile already exists"
        );

        ProfileDNFT profile = new ProfileDNFT(_updateInterval);
        profile.safeMint(msg.sender);

        userToProfile[msg.sender] = address(profile);

        emit ProfileCreated(msg.sender, address(profile));
    }

    function getUserProfile(address user) public view returns (address) {
        return userToProfile[user];
    }
}

contract ProfileDNFT is
    ERC721,
    ERC721URIStorage,
    AutomationCompatibleInterface
{
    using Counters for Counters.Counter;

    Counters.Counter private tokenIdCounter;
    string[] private ipfsUri;
    uint private immutable interval;
    uint private lastUpdateTime;

    constructor(uint _updateInterval) ERC721("UserImages", "Photo") {
        interval = _updateInterval;
        lastUpdateTime = block.timestamp;
        _safeMint(msg.sender, tokenIdCounter.current());
        _setTokenURI(tokenIdCounter.current(), "");
        tokenIdCounter.increment();
    }

    function checkUpkeep(
        bytes calldata
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        if (
            block.timestamp - lastUpdateTime > interval &&
            imageStage() < ipfsUri.length
        ) {
            upkeepNeeded = true;
        }
    }

    function performUpkeep(bytes calldata) external override {
        if (
            block.timestamp - lastUpdateTime > interval &&
            imageStage() < ipfsUri.length
        ) {
            _setTokenURI(tokenIdCounter.current() - 1, ipfsUri[imageStage()]);
            lastUpdateTime = block.timestamp;
        }
    }

    function safeMint(address to) public {
        _safeMint(to, tokenIdCounter.current());
        _setTokenURI(tokenIdCounter.current(), ipfsUri[0]);
        tokenIdCounter.increment();
    }

    function updateImage(
        string memory _newImageUri
    ) public returns (string[] memory) {
        ipfsUri.push(_newImageUri);
        return ipfsUri;
    }

    function imageStage() public view returns (uint) {
        return ipfsUri.length;
    }

    function getIpfsUri() public view returns (string[] memory) {
        return ipfsUri;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
