pragma solidity ^0.5.0;

contract Token{
    
    string  public name = "Coin";
    string  public symbol = "C";
    string  public standard = "Coin v1.0";
    uint256 private totalSupply;
    uint256 public tokenPrice;
    uint256 public etherAmount;
    address payable owner;


    // address to balance
    mapping (address => uint256) public balanceOf;
    
    uint256 public count;
    event Transfer(
        address indexed _from,
        address _to,
        uint256 _numberOfTokens
    );
   
    constructor (uint256 initialSupply,uint256 pricePerToken) public {
        owner = msg.sender;
        totalSupply = initialSupply;
        balanceOf[owner] = totalSupply;
        tokenPrice = pricePerToken;
    }
    
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }
    
    function buyTokens(uint256 numberOfTokens) public payable returns (bool){
        
        require(msg.value == multiply(numberOfTokens, tokenPrice),"Insufficient ether for required amount of tokens");
        
        require(balanceOf[owner] > numberOfTokens,"Insufficient Liquidity for this token");

        balanceOf[owner] -= numberOfTokens;

        balanceOf[msg.sender] += numberOfTokens;    
        
        etherAmount += msg.value;

        return true;
    }

    function transfer(address pot, uint256 numberOfTokens) public returns (bool){
        
        require(balanceOf[msg.sender] > numberOfTokens,"Insufficient balance");

        balanceOf[msg.sender] -= numberOfTokens;
    
        balanceOf[pot] += numberOfTokens;

        emit Transfer(msg.sender, pot, numberOfTokens);

        return true;
    }

    
    function winnerTransfer(address pot,address to) public returns (bool){
        uint256 numberOfTokens=balanceOf[pot];
        balanceOf[pot]-=numberOfTokens;
        balanceOf[to]+=numberOfTokens;

        return true;
    }

    function winnerTransferTie(address pot,address to1,address to2) public returns (bool){
        uint256 numberOfTokens=balanceOf[pot]/2;
        balanceOf[pot]-=numberOfTokens;
        balanceOf[to1]+=numberOfTokens;

        balanceOf[pot]-=numberOfTokens;
        balanceOf[to2]+=numberOfTokens;
        return true;
    }

    function getBalance() public view returns (uint256) {
        return balanceOf[msg.sender];
    }

    function getBalanceOther(address id) public view returns (uint256) {
        return balanceOf[id];
    }
    
    function getContractBalance() public view returns (uint256) {
        return etherAmount;
    }
    
    function sendContractAmountToOwner() public payable {
        require(msg.sender == owner);
        owner.transfer(address(this).balance);
    }
}