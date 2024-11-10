// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./ProfileImage.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";


contract ProfileImageFactory is IERC721Receiver{
    address[] public userPhotoContracts;

    function createUserPhoto(uint updateInterval) public returns (address) {
        ProfileDNFT newUserPhoto = new ProfileDNFT(updateInterval);
        userPhotoContracts.push(address(newUserPhoto));
        return userPhotoContracts[userPhotoContracts.length - 1];
    }

    function getUserPhotoContracts() public view returns (address[] memory) {
        return userPhotoContracts;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes memory data
    ) public virtual override returns (bytes4) {
        // Implemente a lógica para receber o token ERC721 aqui
        // e retorne o valor correto da função
        return this.onERC721Received.selector;
    }
}