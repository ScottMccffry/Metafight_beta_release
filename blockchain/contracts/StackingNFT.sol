// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTStaking {
    IERC721 public nftToken;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public isStaking;

    event Staked(address indexed user, uint256 tokenId);
    event Unstaked(address indexed user, uint256 tokenId);

    constructor(address _nftAddress) {
        nftToken = IERC721(_nftAddress);
    }

    function stakeNFT(uint256 _tokenId) public {
        require(nftToken.ownerOf(_tokenId) == msg.sender, "You do not own this token");
        nftToken.transferFrom(msg.sender, address(this), _tokenId);
        stakingBalance[msg.sender] = _tokenId;
        isStaking[msg.sender] = true;
        emit Staked(msg.sender, _tokenId);
    }

    function unstakeNFT() public {
        uint256 tokenId = stakingBalance[msg.sender];
        require(tokenId != 0, "You do not stake any token");
        nftToken.transferFrom(address(this), msg.sender, tokenId);
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
        emit Unstaked(msg.sender, tokenId);
    }
}
