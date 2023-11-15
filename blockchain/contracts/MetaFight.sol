// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


// MetaFight is an ERC721Enumerable and Ownable contract
contract MetaFight is ERC721Enumerable, Ownable {
  using Strings for uint256;

  // Contract variables
  string public baseURI;
  string public baseExtension = ".json";
  uint256 public nftPerAddressLimit = 20;
  bool public onlyWhitelisted = true;
  bool public paused = false;
  bool public revealed = false;
  address[] public whitelistedAddresses;
  mapping(address => uint256) public addressMintedBalance;
  mapping(uint256 => string) private _tokenURIs;
  event MintConfirmed(uint256 indexed tokenId, address owner, uint256 pending_id);

  // Constructor function
  constructor(
    string memory _name,
    string memory _symbol,
    string memory _initBaseURI
  ) ERC721(_name, _symbol) {
    setBaseURI(_initBaseURI);
  }

  // Internal function to get the base URI
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  // Public function to mint NFTs
    // Public function to mint NFTs
    function mint(uint256 _nftPrice, string calldata _metadataURI, uint256 _pending_id) public payable {
        require(!paused, "the contract is paused");
        uint256 supply = totalSupply();
        
        if (msg.sender != owner()) {
            require(msg.value >= _nftPrice, "insufficient funds");
        }
        
        // Mint the NFT
        addressMintedBalance[msg.sender]++;
        uint256 tokenId = supply + 1;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _metadataURI);

        // Emit the MintConfirmed event
        emit MintConfirmed(tokenId, msg.sender,_pending_id);
    }

  // Internal function to set token URI
  function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
    require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
    _tokenURIs[tokenId] = _tokenURI;
  }
  
 
  // Function to get all token IDs of a specific owner
  function walletOfOwner(address _owner) public view returns (uint256[] memory){
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        // Function to get all token IDs of a specific owner
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  // Function to get the token URI
  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

    string memory ipfsHash = _tokenURIs[tokenId];
    return string(abi.encodePacked("https://ipfs.io/ipfs/", ipfsHash));
  }

  // Only owner function to reveal the NFTs
  function reveal() public onlyOwner {
      revealed = true;
  }
  
  // Only owner function to set NFTs per address limit
  function setNftPerAddressLimit(uint256 _limit) public onlyOwner {
    nftPerAddressLimit = _limit;
  }

  // Only owner function to set the base URI
  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  // Only owner function to set the base extension
  function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
    baseExtension = _newBaseExtension;
  }

  // Only owner function to pause or unpause the contract
  function pause(bool _state) public onlyOwner {
    paused = _state;
  }
  
  // Only owner function to withdraw the contract balance
  function withdraw() public payable onlyOwner {
    (bool os, ) = payable(owner()).call{value: address(this).balance}("");
    require(os);
  }
}
