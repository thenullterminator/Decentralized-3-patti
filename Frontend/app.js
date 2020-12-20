// import Portis from 'node_modules/@portis/web3';
// import Web3 from 'node_modules/web3';

const portis = new Portis('eb6a253e-14d9-470f-bff5-15ada95352d6', 'maticMumbai');
const web3 = new Web3(portis.provider);

console.log(web3.version)

const $connectPortis = document.getElementById('connectPortis');

$connectPortis.addEventListener('click',(e)=>{
	console.log("Here")
	portis.showPortis();
});

web3.eth.getAccounts((error, accounts) => {
	console.log(accounts);
});