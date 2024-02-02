// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "../../node_modules/@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../../node_modules/@openzeppelin/contracts/utils/Counters.sol";


contract ProfileDNFT is ERC721, ERC721URIStorage, AutomationCompatibleInterface {
    using Counters for Counters.Counter;

    Counters.Counter public tokenIdCounter;
 
    string[] IpfsUri;


    uint public immutable interval;
    uint public lastTimeStamp;


    constructor(uint updateInterval) ERC721("UserImages", "Photo") {
        interval = updateInterval;
        lastTimeStamp = block.timestamp;
        safeMint(msg.sender);
    }


    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        if ((block.timestamp - lastTimeStamp) > interval ) {
            uint256 tokenId = tokenIdCounter.current() - 1;
            if (imageStage(tokenId) < IpfsUri.length) {
                upkeepNeeded = true;
            }
        }
    }


    function performUpkeep(bytes calldata /* performData */) external override {
        if ((block.timestamp - lastTimeStamp) > interval ) {
            uint256 tokenId = tokenIdCounter.current() - 1;
            if (imageStage(tokenId) < IpfsUri.length) {
                lastTimeStamp = block.timestamp;            
                updateImage(tokenId);
            }
        }
    }


    function safeMint(address to) public {
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, IpfsUri[0]);
    }


    function updateImage(uint256 _tokenId) public {
        if(imageStage(_tokenId) >= IpfsUri.length){return;}
        // Get the current stage of the image and add 1
        uint256 newVal = imageStage(_tokenId) + 1;
        // store the new URI
        string memory newUri = IpfsUri[newVal];
        // Update the URI
        _setTokenURI(_tokenId, newUri);
        IpfsUri.push(tokenURI(_tokenId));
    }

    function imageStage(uint256 _tokenId) public view returns (uint256 stage) {
        string memory _uri = tokenURI(_tokenId);
        for (uint256 i = 0; i < IpfsUri.length; i++) {
            if (compareStrings(_uri, IpfsUri[i])) {
                return i;
            }
        }
        return IpfsUri.length;
    }

    // helper function to compare strings
    function compareStrings(string memory a, string memory b)
        public pure returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }


    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}