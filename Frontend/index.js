
const $container = document.getElementById('container');
const $home_page = document.getElementById('home_page');
const $name_input_create_game = document.getElementById('name_input_create_game');
const $create_game_div = document.getElementById('create_game_div');
const $name_input_join_game = document.getElementById('name_input_join_game');
const $room_id_input = document.getElementById('room_id_input');
const $join_game_div = document.getElementById('join_game_div');
const $start_page = document.getElementById('start_page');
const $room_id_display = document.getElementById('room_id_display');
const $active_users = document.getElementById('active_users');
const $start_game_div = document.getElementById('start_game_div');
const $game_content = document.getElementById('game_content');
const $table_container = document.getElementById('table_container');
const $topbar = document.getElementById('topbar');
const $chat_messages_display = document.getElementById('chat_messages_display');
const $chat_input = document.getElementById('chat_input');
const $score_board_list = document.getElementById('score_board_list');
const $last_move_list = document.getElementById('last_move_list');
const $winnerTitle = document.getElementById('winnerTitle');
const $winnerDislplayContainer = document.getElementById('winnerDislplayContainer');
const $name_required_1 = document.getElementById('name_required_1');
const $name_required_2 = document.getElementById('name_required_2');
const $room_id_required = document.getElementById('room_id_required');

const $buy_tokens_div = document.getElementById('buy_tokens_div');
const $connect_metamask_button = document.getElementById('connect_metamask_button');
const $wallet_ad_display = document.getElementById('wallet_ad_display');
const $token_amount = document.getElementById('token_amount');
const $connect_portis_button = document.getElementById('connect_portis_button');


var game_chips_contract = undefined;
var game_chips = undefined;

// Metamask ...................

const isMetaMaskInstalled = () => {
        const { ethereum } = window;
        return Boolean(ethereum && ethereum.isMetaMask);
};

const MetamaskClientCheck = () => {

        if (!isMetaMaskInstalled()) {

                $connect_metamask_button.innerText = 'Click here to install MetaMask!';
                $connect_metamask_button.onclick = redirect_to_web_store();
                // $connect_metamask_button.disabled = false;

        } else {
                $connect_metamask_button.innerText = 'Connect Metamask';
                $connect_metamask_button.onclick = onClickConnectMetamask;
                // $connect_metamask_button.disabled = false;
        }
};


function redirect_to_web_store() {
        console.log("Clicked here");
        // window.open('http://stackoverflow.com', '_blank');
};

MetamaskClientCheck();

async function onClickConnectMetamask() {

        try {
                //Will Start the MetaMask Extension
                await ethereum.request({ method: 'eth_requestAccounts' });
                request_account();
                console.log("Metamask Button disabled");
                $connect_metamask_button.disabled = true;

        } catch (error) {
                console.error(error);
        }
        return false;
};

async function request_account() {

        const accounts = await ethereum.request({ method: 'eth_accounts' })
        web3.eth.defaultAccount = accounts[0];
        $wallet_ad_display.value = web3.eth.defaultAccount;
        console.log("Metamask Add: " + web3.eth.defaultAccount);

        // Smart Contract ABI .....

        game_chips_contract = await web3.eth.contract([
                {
                        "constant": false,
                        "inputs": [
                                {
                                        "internalType": "uint256",
                                        "name": "numberOfTokens",
                                        "type": "uint256"
                                }
                        ],
                        "name": "buyTokens",
                        "outputs": [
                                {
                                        "internalType": "bool",
                                        "name": "",
                                        "type": "bool"
                                }
                        ],
                        "payable": true,
                        "stateMutability": "payable",
                        "type": "function"
                },
                {
                        "constant": false,
                        "inputs": [],
                        "name": "sendContractAmountToOwner",
                        "outputs": [],
                        "payable": true,
                        "stateMutability": "payable",
                        "type": "function"
                },
                {
                        "constant": false,
                        "inputs": [
                                {
                                        "internalType": "string",
                                        "name": "pot",
                                        "type": "string"
                                },
                                {
                                        "internalType": "uint256",
                                        "name": "numberOfTokens",
                                        "type": "uint256"
                                },
                                {
                                        "internalType": "string",
                                        "name": "clientId",
                                        "type": "string"
                                },
                                {
                                        "internalType": "string",
                                        "name": "viaEvent",
                                        "type": "string"
                                }
                        ],
                        "name": "transfer",
                        "outputs": [
                                {
                                        "internalType": "bool",
                                        "name": "",
                                        "type": "bool"
                                }
                        ],
                        "payable": false,
                        "stateMutability": "nonpayable",
                        "type": "function"
                },
                {
                        "inputs": [
                                {
                                        "internalType": "uint256",
                                        "name": "initialSupply",
                                        "type": "uint256"
                                },
                                {
                                        "internalType": "uint256",
                                        "name": "pricePerToken",
                                        "type": "uint256"
                                }
                        ],
                        "payable": false,
                        "stateMutability": "nonpayable",
                        "type": "constructor"
                },
                {
                        "anonymous": false,
                        "inputs": [
                                {
                                        "indexed": true,
                                        "internalType": "address",
                                        "name": "_from",
                                        "type": "address"
                                },
                                {
                                        "indexed": false,
                                        "internalType": "address",
                                        "name": "_to",
                                        "type": "address"
                                },
                                {
                                        "indexed": false,
                                        "internalType": "uint256",
                                        "name": "_numberOfTokens",
                                        "type": "uint256"
                                }
                        ],
                        "name": "Transfered",
                        "type": "event"
                },
                {
                        "anonymous": false,
                        "inputs": [
                                {
                                        "indexed": true,
                                        "internalType": "address",
                                        "name": "_from",
                                        "type": "address"
                                },
                                {
                                        "indexed": false,
                                        "internalType": "string",
                                        "name": "_to",
                                        "type": "string"
                                },
                                {
                                        "indexed": false,
                                        "internalType": "string",
                                        "name": "_clientId",
                                        "type": "string"
                                },
                                {
                                        "indexed": false,
                                        "internalType": "string",
                                        "name": "_viaEvent",
                                        "type": "string"
                                },
                                {
                                        "indexed": false,
                                        "internalType": "uint256",
                                        "name": "_numberOfTokens",
                                        "type": "uint256"
                                }
                        ],
                        "name": "TransferedToPot",
                        "type": "event"
                },
                {
                        "constant": false,
                        "inputs": [
                                {
                                        "internalType": "string",
                                        "name": "pot",
                                        "type": "string"
                                },
                                {
                                        "internalType": "address",
                                        "name": "to",
                                        "type": "address"
                                }
                        ],
                        "name": "winnerTransfer",
                        "outputs": [
                                {
                                        "internalType": "bool",
                                        "name": "",
                                        "type": "bool"
                                }
                        ],
                        "payable": false,
                        "stateMutability": "nonpayable",
                        "type": "function"
                },
                {
                        "constant": false,
                        "inputs": [
                                {
                                        "internalType": "string",
                                        "name": "pot",
                                        "type": "string"
                                },
                                {
                                        "internalType": "address",
                                        "name": "to1",
                                        "type": "address"
                                },
                                {
                                        "internalType": "address",
                                        "name": "to2",
                                        "type": "address"
                                }
                        ],
                        "name": "winnerTransferTie",
                        "outputs": [
                                {
                                        "internalType": "bool",
                                        "name": "",
                                        "type": "bool"
                                }
                        ],
                        "payable": false,
                        "stateMutability": "nonpayable",
                        "type": "function"
                },
                {
                        "constant": true,
                        "inputs": [
                                {
                                        "internalType": "address",
                                        "name": "",
                                        "type": "address"
                                }
                        ],
                        "name": "balanceOf",
                        "outputs": [
                                {
                                        "internalType": "uint256",
                                        "name": "",
                                        "type": "uint256"
                                }
                        ],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                },
                {
                        "constant": true,
                        "inputs": [
                                {
                                        "internalType": "string",
                                        "name": "",
                                        "type": "string"
                                }
                        ],
                        "name": "balanceOfPot",
                        "outputs": [
                                {
                                        "internalType": "uint256",
                                        "name": "",
                                        "type": "uint256"
                                }
                        ],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                },
                {
                        "constant": true,
                        "inputs": [],
                        "name": "count",
                        "outputs": [
                                {
                                        "internalType": "uint256",
                                        "name": "",
                                        "type": "uint256"
                                }
                        ],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                },
                {
                        "constant": true,
                        "inputs": [],
                        "name": "etherAmount",
                        "outputs": [
                                {
                                        "internalType": "uint256",
                                        "name": "",
                                        "type": "uint256"
                                }
                        ],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                },
                {
                        "constant": true,
                        "inputs": [],
                        "name": "getBalance",
                        "outputs": [
                                {
                                        "internalType": "uint256",
                                        "name": "",
                                        "type": "uint256"
                                }
                        ],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                },
                {
                        "constant": true,
                        "inputs": [
                                {
                                        "internalType": "address",
                                        "name": "id",
                                        "type": "address"
                                }
                        ],
                        "name": "getBalanceOther",
                        "outputs": [
                                {
                                        "internalType": "uint256",
                                        "name": "",
                                        "type": "uint256"
                                }
                        ],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                },
                {
                        "constant": true,
                        "inputs": [
                                {
                                        "internalType": "string",
                                        "name": "id",
                                        "type": "string"
                                }
                        ],
                        "name": "getBalancePot",
                        "outputs": [
                                {
                                        "internalType": "uint256",
                                        "name": "",
                                        "type": "uint256"
                                }
                        ],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                },
                {
                        "constant": true,
                        "inputs": [],
                        "name": "getContractBalance",
                        "outputs": [
                                {
                                        "internalType": "uint256",
                                        "name": "",
                                        "type": "uint256"
                                }
                        ],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                },
                {
                        "constant": true,
                        "inputs": [],
                        "name": "name",
                        "outputs": [
                                {
                                        "internalType": "string",
                                        "name": "",
                                        "type": "string"
                                }
                        ],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                },
                {
                        "constant": true,
                        "inputs": [],
                        "name": "standard",
                        "outputs": [
                                {
                                        "internalType": "string",
                                        "name": "",
                                        "type": "string"
                                }
                        ],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                },
                {
                        "constant": true,
                        "inputs": [],
                        "name": "symbol",
                        "outputs": [
                                {
                                        "internalType": "string",
                                        "name": "",
                                        "type": "string"
                                }
                        ],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                },
                {
                        "constant": true,
                        "inputs": [],
                        "name": "tokenPrice",
                        "outputs": [
                                {
                                        "internalType": "uint256",
                                        "name": "",
                                        "type": "uint256"
                                }
                        ],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                }
        ]);

        // Set the contract address 
        game_chips = await game_chips_contract.at('0x681f6aF0c05e1a667FDd336d5dE6f14CFDa2b3fd');

        // 1 CHP = 1000000000000 wei.

        // Smart Contract ABI .....

        web3_required()

        game_chips.getBalance((e, r) => {
                if (e) {
                        console.log("Error in balance request : " + e);
                }
                else {
                        console.log("Current balance : " + r);
                }
        });
        // Buy tokens event listenr and smart contract interaction.
        $buy_tokens_div.addEventListener('click', (e) => {

                var token_amount = $token_amount.value;
                var ether_required = 1000000000000 * token_amount

                game_chips.buyTokens(token_amount, { value: ether_required }, (e, r) => {
                        if (e) {
                                console.log("Error while Buying :" + e);
                        }
                        else {
                                console.log("Purchase successfull: " + r);
                        }
                });
        });
        // some other stuff...
};

// Metamask ...................



// Portis .....................
$connect_portis_button.addEventListener('click', (e) => {

        const portis = new Portis('eb6a253e-14d9-470f-bff5-15ada95352d6', 'maticMumbai');
        const web3 = new Web3(portis.provider);
        portis.showPortis();
        console.log("Portis Button disabled");
        $connect_portis_button.disabled = true;

        web3.eth.getAccounts(async (error, accounts) => {
                web3.eth.defaultAccount = accounts[0];
                $wallet_ad_display.value = web3.eth.defaultAccount;
                console.log(" PostisAdd: " + web3.eth.defaultAccount);

                // Smart Contract ABI .....

                game_chips_contract = await web3.eth.contract([
                        {
                                "constant": false,
                                "inputs": [
                                        {
                                                "internalType": "uint256",
                                                "name": "numberOfTokens",
                                                "type": "uint256"
                                        }
                                ],
                                "name": "buyTokens",
                                "outputs": [
                                        {
                                                "internalType": "bool",
                                                "name": "",
                                                "type": "bool"
                                        }
                                ],
                                "payable": true,
                                "stateMutability": "payable",
                                "type": "function"
                        },
                        {
                                "constant": false,
                                "inputs": [],
                                "name": "sendContractAmountToOwner",
                                "outputs": [],
                                "payable": true,
                                "stateMutability": "payable",
                                "type": "function"
                        },
                        {
                                "constant": false,
                                "inputs": [
                                        {
                                                "internalType": "string",
                                                "name": "pot",
                                                "type": "string"
                                        },
                                        {
                                                "internalType": "uint256",
                                                "name": "numberOfTokens",
                                                "type": "uint256"
                                        },
                                        {
                                                "internalType": "string",
                                                "name": "clientId",
                                                "type": "string"
                                        },
                                        {
                                                "internalType": "string",
                                                "name": "viaEvent",
                                                "type": "string"
                                        }
                                ],
                                "name": "transfer",
                                "outputs": [
                                        {
                                                "internalType": "bool",
                                                "name": "",
                                                "type": "bool"
                                        }
                                ],
                                "payable": false,
                                "stateMutability": "nonpayable",
                                "type": "function"
                        },
                        {
                                "inputs": [
                                        {
                                                "internalType": "uint256",
                                                "name": "initialSupply",
                                                "type": "uint256"
                                        },
                                        {
                                                "internalType": "uint256",
                                                "name": "pricePerToken",
                                                "type": "uint256"
                                        }
                                ],
                                "payable": false,
                                "stateMutability": "nonpayable",
                                "type": "constructor"
                        },
                        {
                                "anonymous": false,
                                "inputs": [
                                        {
                                                "indexed": true,
                                                "internalType": "address",
                                                "name": "_from",
                                                "type": "address"
                                        },
                                        {
                                                "indexed": false,
                                                "internalType": "address",
                                                "name": "_to",
                                                "type": "address"
                                        },
                                        {
                                                "indexed": false,
                                                "internalType": "uint256",
                                                "name": "_numberOfTokens",
                                                "type": "uint256"
                                        }
                                ],
                                "name": "Transfered",
                                "type": "event"
                        },
                        {
                                "anonymous": false,
                                "inputs": [
                                        {
                                                "indexed": true,
                                                "internalType": "address",
                                                "name": "_from",
                                                "type": "address"
                                        },
                                        {
                                                "indexed": false,
                                                "internalType": "string",
                                                "name": "_to",
                                                "type": "string"
                                        },
                                        {
                                                "indexed": false,
                                                "internalType": "string",
                                                "name": "_clientId",
                                                "type": "string"
                                        },
                                        {
                                                "indexed": false,
                                                "internalType": "string",
                                                "name": "_viaEvent",
                                                "type": "string"
                                        },
                                        {
                                                "indexed": false,
                                                "internalType": "uint256",
                                                "name": "_numberOfTokens",
                                                "type": "uint256"
                                        }
                                ],
                                "name": "TransferedToPot",
                                "type": "event"
                        },
                        {
                                "constant": false,
                                "inputs": [
                                        {
                                                "internalType": "string",
                                                "name": "pot",
                                                "type": "string"
                                        },
                                        {
                                                "internalType": "address",
                                                "name": "to",
                                                "type": "address"
                                        }
                                ],
                                "name": "winnerTransfer",
                                "outputs": [
                                        {
                                                "internalType": "bool",
                                                "name": "",
                                                "type": "bool"
                                        }
                                ],
                                "payable": false,
                                "stateMutability": "nonpayable",
                                "type": "function"
                        },
                        {
                                "constant": false,
                                "inputs": [
                                        {
                                                "internalType": "string",
                                                "name": "pot",
                                                "type": "string"
                                        },
                                        {
                                                "internalType": "address",
                                                "name": "to1",
                                                "type": "address"
                                        },
                                        {
                                                "internalType": "address",
                                                "name": "to2",
                                                "type": "address"
                                        }
                                ],
                                "name": "winnerTransferTie",
                                "outputs": [
                                        {
                                                "internalType": "bool",
                                                "name": "",
                                                "type": "bool"
                                        }
                                ],
                                "payable": false,
                                "stateMutability": "nonpayable",
                                "type": "function"
                        },
                        {
                                "constant": true,
                                "inputs": [
                                        {
                                                "internalType": "address",
                                                "name": "",
                                                "type": "address"
                                        }
                                ],
                                "name": "balanceOf",
                                "outputs": [
                                        {
                                                "internalType": "uint256",
                                                "name": "",
                                                "type": "uint256"
                                        }
                                ],
                                "payable": false,
                                "stateMutability": "view",
                                "type": "function"
                        },
                        {
                                "constant": true,
                                "inputs": [
                                        {
                                                "internalType": "string",
                                                "name": "",
                                                "type": "string"
                                        }
                                ],
                                "name": "balanceOfPot",
                                "outputs": [
                                        {
                                                "internalType": "uint256",
                                                "name": "",
                                                "type": "uint256"
                                        }
                                ],
                                "payable": false,
                                "stateMutability": "view",
                                "type": "function"
                        },
                        {
                                "constant": true,
                                "inputs": [],
                                "name": "count",
                                "outputs": [
                                        {
                                                "internalType": "uint256",
                                                "name": "",
                                                "type": "uint256"
                                        }
                                ],
                                "payable": false,
                                "stateMutability": "view",
                                "type": "function"
                        },
                        {
                                "constant": true,
                                "inputs": [],
                                "name": "etherAmount",
                                "outputs": [
                                        {
                                                "internalType": "uint256",
                                                "name": "",
                                                "type": "uint256"
                                        }
                                ],
                                "payable": false,
                                "stateMutability": "view",
                                "type": "function"
                        },
                        {
                                "constant": true,
                                "inputs": [],
                                "name": "getBalance",
                                "outputs": [
                                        {
                                                "internalType": "uint256",
                                                "name": "",
                                                "type": "uint256"
                                        }
                                ],
                                "payable": false,
                                "stateMutability": "view",
                                "type": "function"
                        },
                        {
                                "constant": true,
                                "inputs": [
                                        {
                                                "internalType": "address",
                                                "name": "id",
                                                "type": "address"
                                        }
                                ],
                                "name": "getBalanceOther",
                                "outputs": [
                                        {
                                                "internalType": "uint256",
                                                "name": "",
                                                "type": "uint256"
                                        }
                                ],
                                "payable": false,
                                "stateMutability": "view",
                                "type": "function"
                        },
                        {
                                "constant": true,
                                "inputs": [
                                        {
                                                "internalType": "string",
                                                "name": "id",
                                                "type": "string"
                                        }
                                ],
                                "name": "getBalancePot",
                                "outputs": [
                                        {
                                                "internalType": "uint256",
                                                "name": "",
                                                "type": "uint256"
                                        }
                                ],
                                "payable": false,
                                "stateMutability": "view",
                                "type": "function"
                        },
                        {
                                "constant": true,
                                "inputs": [],
                                "name": "getContractBalance",
                                "outputs": [
                                        {
                                                "internalType": "uint256",
                                                "name": "",
                                                "type": "uint256"
                                        }
                                ],
                                "payable": false,
                                "stateMutability": "view",
                                "type": "function"
                        },
                        {
                                "constant": true,
                                "inputs": [],
                                "name": "name",
                                "outputs": [
                                        {
                                                "internalType": "string",
                                                "name": "",
                                                "type": "string"
                                        }
                                ],
                                "payable": false,
                                "stateMutability": "view",
                                "type": "function"
                        },
                        {
                                "constant": true,
                                "inputs": [],
                                "name": "standard",
                                "outputs": [
                                        {
                                                "internalType": "string",
                                                "name": "",
                                                "type": "string"
                                        }
                                ],
                                "payable": false,
                                "stateMutability": "view",
                                "type": "function"
                        },
                        {
                                "constant": true,
                                "inputs": [],
                                "name": "symbol",
                                "outputs": [
                                        {
                                                "internalType": "string",
                                                "name": "",
                                                "type": "string"
                                        }
                                ],
                                "payable": false,
                                "stateMutability": "view",
                                "type": "function"
                        },
                        {
                                "constant": true,
                                "inputs": [],
                                "name": "tokenPrice",
                                "outputs": [
                                        {
                                                "internalType": "uint256",
                                                "name": "",
                                                "type": "uint256"
                                        }
                                ],
                                "payable": false,
                                "stateMutability": "view",
                                "type": "function"
                        }
                ]);

                // Set the contract address 
                game_chips = await game_chips_contract.at('0x681f6aF0c05e1a667FDd336d5dE6f14CFDa2b3fd');

                // 1 CHP = 1000000000000 wei.

                // Smart Contract ABI .....

                web3_required()

                game_chips.getBalance((e, r) => {
                        if (e) {
                                console.log("Error in balance request : " + e);
                        }
                        else {
                                console.log("Current balance : " + r);
                        }
                });

                // Buy tokens event listenr and smart contract interaction.
                $buy_tokens_div.addEventListener('click', (e) => {

                        var token_amount = $token_amount.value;
                        var ether_required = 1000000000000 * token_amount

                        game_chips.buyTokens(token_amount, { value: ether_required }, (e, r) => {
                                if (e) {
                                        console.log("Error while Buying :" + e);
                                }
                                else {
                                        console.log("Purchase successfull: " + r);
                                }
                        });
                });
        });
});
// Portis .....................

function web3_required() {

        game_chips.allEvents({
                fromBlock: 'latest',
                toBlock: 'latest'
        }, function (error, event) {

                if (event.args._clientId == current_user.client_id) {
                        console.log(event);
                        let action = event.args._viaEvent;
                        socket.emit(action, current_user.room_id, current_user.client_id);
                        console.log(action);
                }
        });


        // Gameplay Events....
        function transactionHandler(amount, action) {
                let toContract = current_user.room_id;
                let client_id = current_user.client_id;

                game_chips.transfer(toContract, amount, client_id, action, (e, r) => {
                        if (e) console.log(JSON.stringify(e));
                        else console.log(action + " Tx Hash " + r);
                });
        }
        // Make bet...
        // get amount to be transferred to pot by player : pidx (for BET)
        function getAmountBet(pidx) {
                let betValue = gamePlayData['betValue'];
                let transferAmount = 0;
                if (gamePlayData['user'][pidx]['blind'] == true)
                        transferAmount += betValue / 2;
                else
                        transferAmount += betValue;

                return transferAmount;
        }

        $bet.addEventListener('click', function () {
                // if it is the user's turn
                let pidx = gamePlayData['turn'];
                if (current_user.name == game_data["users"][pidx].username) {
                        let amount = getAmountBet(pidx);
                        let action = "make bet";
                        transactionHandler(amount, action);
                }
        })
        // Make bet...

        // Raise bet...
        // get amount to be transferred to pot by player : pidx (for BET)
        function getAmountRaise(pidx) {
                let betValue = 2 * gamePlayData['betValue'];
                let transferAmount = 0;
                if (gamePlayData['user'][pidx]['blind'] == true)
                        transferAmount += betValue / 2;
                else
                        transferAmount += betValue;

                return transferAmount;
        }
        $raise.addEventListener('click', function () {
                // if it is the user's turn
                let pidx = gamePlayData['turn'];
                if (current_user.name == game_data["users"][pidx].username) {
                        let amount = getAmountRaise(pidx);
                        let action = "raise bet";
                        transactionHandler(amount, action);
                }
        })
        // Raise bet...

        // request side show...
        $sideShow.addEventListener('click', function () {
                removeGameplayButtonsDOM();
                // if it is the user's turn
                let pidx = gamePlayData['turn'];
                if (current_user.name == game_data["users"][pidx].username && gamePlayData['livePlayers'] > 2) {
                        let amount = getAmountBet(pidx);
                        let action = 'request side show';
                        transactionHandler(amount, action);
                }
        })
        // request side show...

        // request show...
        $show.addEventListener('click', function () {
                // if it is the user's turn
                let pidx = gamePlayData['turn'];
                if (current_user.name == game_data["users"][pidx].username) {
                        let amount = getAmountBet(pidx);
                        let action = "request show";
                        transactionHandler(amount, action);
                }
        })
        // request show...

};



var welcome_deck = undefined;
const JOKER_ID = 54;
var distribution_turn = 0;
const socket = io('http://localhost:3000');

const current_user = {
        name: "",
        room_id: "",
        client_id: "",
        admin: false
};


$create_game_div.addEventListener('click', (e) => {

        const name = $name_input_create_game.value;

        if (name == "") {
                name_required_1.style.display = "block"
                return;
        }

        current_user.name = name;

        socket.emit('create new game', name);
        current_user.admin = true;
        $start_game_div.style.display = 'block';

        // options only for the person who created game.
        // $topbar.appendChild($flip);
        // $topbar.appendChild($shuffle);
        // $topbar.appendChild($bysuit);
        // $topbar.appendChild($fan);
        // $topbar.appendChild($sort);
        /**
         * admin is the first user to start the game, so admin is the only one who has distribute button
         * enabled, this distribute button is also toggled when starting next round.
         */
        $topbar.appendChild($distribute);
});

$join_game_div.addEventListener('click', (e) => {

        const name = $name_input_join_game.value;

        if (name == "") {
                name_required_2.style.display = "block";
                return;
        } else {
                name_required_2.style.display = "none";
        }

        const room_id = $room_id_input.value;

        if (room_id == "") {
                room_id_required.style.display = "block";
                return;
        } else {
                room_id_required.style.display = "none";
        }

        current_user.name = name;

        socket.emit('join game', name, room_id);
});

$start_game_div.addEventListener('click', (e) => {

        socket.emit('start new game');
});

socket.on('start game for all users', (users) => {

        welcome_deck.unmount($container);
        $start_page.style.display = "none";
        $game_content.style.display = "block";
        // add list of users to game data for avatar
        game_data["users"] = users;
        game_start_animation();
        draw_avatars();
        highlight_current_player(0);
});

socket.on('new room id', (room_id, client_id) => {

        $room_id_display.value = room_id;

        current_user.room_id = room_id;
        current_user.client_id = client_id;

        $home_page.style.display = "none";
        $start_page.style.display = "flex";
});

socket.on('new users', (users) => {

        var user_list = "";

        for (var i = 0; i < users.length; i++) {
                user_list += '<input value="' + users[i].username + '" class="input100" type="text" name="username" placeholder="Enter display name" readonly />';
        }

        $active_users.innerHTML = user_list;

        // user_list = "";
        // for (var i = 0; i < users.length; i++) {
        //         user_list += '<tr><td>'+(i+1).toString()+'</td><td>'+users[i].username+'</td><td>'+'0'+'</td><td>'+'0'+'</td></tr>';
        // }


        // $score_board_list.innerHTML = user_list;
});

socket.on('new message', (messages) => {

        if (messages === undefined || messages.length === 0) {
                return;
        }

        var msg_list = "";
        for (var i = 0; i < messages.length; i++) {
                if (i % 2 === 0) {
                        msg_list += '<div class="' + 'msg-send' + '">' + '<b>' + messages[i].sender + ': ' + '</b>' + messages[i].message + '</div>';
                }
                else {
                        msg_list += '<div class="' + 'msg-receive' + '">' + '<b>' + messages[i].sender + ': ' + '</b>' + messages[i].message + '</div>';
                }

        }

        $chat_messages_display.innerHTML = msg_list;
});

socket.on('room_id does not exist', () => {

        console.log("Invalid room id");
        room_id_required.innerHTML = "Room ID invalid";
        room_id_required.style.display = "block";
});

// Explosion JS ...........................
function welcome_animation() {

        // create Deck
        welcome_deck = Deck();

        // add to DOM
        welcome_deck.mount($container);

        var counter = 0;
        function finished() {
                counter++;
                if (counter === 52) {

                        // setTimeout(function(){ document.getElementById('home_page').style.display='none'; welcome_deck.unmount($container); }, 3000);
                        document.getElementById('home_page').style.display = 'flex';
                }

        };

        welcome_deck.cards.forEach(function (card, i) {
                card.setSide('front');

                // explode
                card.animateTo({
                        delay: 1000 + i * 2, // wait 1 second + i * 2 ms
                        duration: 500,
                        ease: 'quartOut',

                        x: Math.random() * window.innerWidth - window.innerWidth / 2,
                        y: Math.random() * window.innerHeight - window.innerHeight / 2,
                        onComplete: finished
                });
        });

}
// Explosion JS ...........................

welcome_animation();

var images = {};

function draw_avatars() {
        var players = [];
        for (var i = 0; i < game_data["users"].length; i++) {
                players.push(game_data["users"][i].username);
        }

        var startAngle = -Math.PI / (players.length);
        var arc = Math.PI / (players.length / 2);

        var ctx;

        var center = 500;

        var AVATAR_BASE_URL = "https://avatars.dicebear.com/api/avataaars/";

        for (var i = 0; i < players.length; i++) {
                var uri = AVATAR_BASE_URL + players[i] + ".svg";
                images[i] = new Image();
                images[i].src = uri;
        }

        var canvas = document.getElementById("canvas");
        if (canvas.getContext) {
                var imgRadius = 425;
                var textRadius = imgRadius + 0;

                ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, 1000, 1000);

                ctx.font = 'bold 16px Athiti, Arial';

                for (var i = 0; i < players.length; i++) {
                        var angle = startAngle + i * arc + (3 * Math.PI / 180);

                        ctx.save();

                        ctx.shadowOffsetX = -1;
                        ctx.shadowOffsetY = -1;
                        ctx.shadowBlur = 0;
                        ctx.shadowColor = "rgb(220,220,220)";
                        ctx.fillStyle = "black";
                        ctx.translate(center + Math.cos(angle + arc / 2) * textRadius,
                                center + Math.sin(angle + arc / 2) * textRadius);
                        var text = players[i];
                        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);

                        var img = new Image();
                        angle -= 6 * Math.PI / 180;
                        img.setAtX = center + Math.cos(angle + arc / 2) * imgRadius - 30;
                        img.setAtY = center + Math.sin(angle + arc / 2) * imgRadius - 30;
                        img.onload = function () {
                                ctx.drawImage(this, this.setAtX, this.setAtY, 60, 60);
                        };
                        var uri = AVATAR_BASE_URL + text + ".svg";
                        img.src = uri;

                        ctx.restore();
                }
        }

}


function highlight_current_player(turn) {
        var players = [];
        for (var i = 0; i < game_data["users"].length; i++) {
                players.push(game_data["users"][i].username);
        }

        var startAngle = -Math.PI / (players.length);
        var arc = Math.PI / (players.length / 2);

        var ctx;

        var center = 500;

        var AVATAR_BASE_URL = "https://avatars.dicebear.com/api/avataaars/";

        for (var i = 0; i < players.length; i++) {
                var uri = AVATAR_BASE_URL + players[i] + ".svg";
                images[i] = new Image();
                images[i].src = uri;
        }

        var canvas = document.getElementById("canvas");
        if (canvas.getContext) {
                var imgRadius = 425;
                var textRadius = imgRadius + 0;

                ctx = canvas.getContext("2d");
                // ctx.clearRect(0, 0, 1000, 1000);

                ctx.font = 'bold 16px Athiti, Arial';

                for (var i = 0; i < players.length; i++) {
                        var angle = startAngle + i * arc + (3 * Math.PI / 180);

                        ctx.save();

                        ctx.shadowOffsetX = -1;
                        ctx.shadowOffsetY = -1;
                        ctx.shadowBlur = 0;
                        ctx.shadowColor = "rgb(220,220,220)";
                        if (i == turn) {
                                ctx.fillStyle = "red";
                        } else {
                                ctx.fillStyle = "black";
                        }
                        ctx.translate(center + Math.cos(angle + arc / 2) * textRadius,
                                center + Math.sin(angle + arc / 2) * textRadius);
                        var text = players[i];
                        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);

                        var img = new Image();
                        angle -= 6 * Math.PI / 180;
                        img.setAtX = center + Math.cos(angle + arc / 2) * imgRadius - 30;
                        img.setAtY = center + Math.sin(angle + arc / 2) * imgRadius - 30;
                        img.onload = function () {
                                ctx.drawImage(this, this.setAtX, this.setAtY, 60, 60);
                        };
                        var uri = AVATAR_BASE_URL + text + ".svg";
                        img.src = uri;

                        ctx.restore();
                }
        }
}



// Chat Box JS..................
$(function () {

        var arrow = $('.chat-head img');
        var textarea = $('.chat-text textarea');

        arrow.on('click', function () {
                var src = arrow.attr('src');

                $('.chat-body').slideToggle('fast');
                if (src == 'https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_down-16.png') {
                        arrow.attr('src', 'https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_up-16.png');
                }
                else {
                        arrow.attr('src', 'https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_down-16.png');
                }
        });

        textarea.keypress(function (event) {
                var $this = $(this);

                if (event.keyCode == 13) { // enter key

                        var msg = $this.val();
                        $this.val('');
                        const room_id = current_user.room_id;
                        const sender = current_user.name;

                        socket.emit('send message', msg, sender, room_id);
                        // $('.msg-insert').append("<div class='msg-send'>" + msg + "</div>");
                        return false;
                }
        });
});
// Chat Box Js ...................



// Game Deck .....................
var prefix = Deck.prefix
var transform = prefix('transform')
var translate = Deck.translate

var $sort = document.createElement('button')
var $shuffle = document.createElement('button')
var $bysuit = document.createElement('button')
var $fan = document.createElement('button')
var $poker = document.createElement('button')
var $flip = document.createElement('button')
var $distribute = document.createElement('button')
var $view = document.createElement('button')
var $new_round = document.createElement('button')

// Gameplay Buttons....
var $bet = document.createElement('button')
var $raise = document.createElement('button')
var $sideShow = document.createElement('button')
var $show = document.createElement('button')
var $fold = document.createElement('button')
var $new_round = document.createElement('button')
var $sideShowYes = document.createElement('button')
var $sideShowNo = document.createElement('button')
// Gameplay Buttons....

// $sort.disabled = true;
// $shuffle.disabled = true;
// $bysuit.disabled = true;
// $fan.disabled = true;
// $poker.disabled = true;
// $flip.disabled = true;
// $distribute.disabled = true;
// $view.disabled = true;

$shuffle.textContent = 'Shuffle'
$sort.textContent = 'Sort'
$bysuit.textContent = 'By suit'
$fan.textContent = 'Fan'
$poker.textContent = 'Poker'
$flip.textContent = 'Flip'
$distribute.textContent = 'Distribute'
$view.textContent = 'View'
$new_round.textContent = 'New Round'


// TextContent Set of gameplay buttons.....
$bet.textContent = 'Bet'
$raise.textContent = 'Raise'
$sideShow.textContent = 'Side Show'
$show.textContent = 'Show'
$fold.textContent = 'Fold'
$sideShowYes.textContent = 'Accept'
$sideShowNo.textContent = 'Decline'
// TextContent Set of gameplay buttons.....


// $topbar.appendChild($flip)
// $topbar.appendChild($shuffle)
// $topbar.appendChild($bysuit)
// $topbar.appendChild($fan)
// $topbar.appendChild($poker)
// $topbar.appendChild($sort)
// $topbar.appendChild($distribute)
// $topbar.appendChild($view)

// Game play Deck ............
var deck = Deck();
// stores all information about card distribution i.e which player has which cards
var game_data = {};
var gamePlayData = {};
// Game play Deck ............

$shuffle.addEventListener('click', function () {
        deck.shuffle()
        deck.shuffle()
})
$sort.addEventListener('click', function () {
        deck.sort()
})
$bysuit.addEventListener('click', function () {
        deck.sort(true) // sort reversed
        deck.bysuit()
})
$fan.addEventListener('click', function () {
        deck.fan()
})
$flip.addEventListener('click', function () {
        deck.flip()
})
$poker.addEventListener('click', function () {
        deck.queue(function (next) {
                deck.cards.forEach(function (card, i) {
                        setTimeout(function () {
                                card.setSide('back')
                        }, i * 7.5)
                })
                next()
        })
        deck.shuffle()
        deck.shuffle()
        deck.poker()
})

$distribute.addEventListener('click', function () {


        deck.shuffle();

        console.log("deck sent =>");
        console.log(deck.cards);

        const room_id = current_user.room_id;
        const sender = current_user.name;
        socket.emit('distribute', deck.cards, sender, room_id);
})

$view.addEventListener('click', function () {
        socket.emit('request own card data', current_user.room_id, current_user.client_id);
})

// // Gameplay Events....
// function transactionHandler(amount, action) {
//         let toContract = current_user.room_id;
//         let client_id = current_user.client_id;

//         game_chips.transfer(toContract, amount, client_id, action, (e, r) => {
//                 if (e) console.log(JSON.stringify(e));
//                 else console.log(action + " Tx Hash " + r);
//         });
// }
// // Make bet...
// // get amount to be transferred to pot by player : pidx (for BET)
// function getAmountBet(pidx) {
//         let betValue = gamePlayData['betValue'];
//         let transferAmount = 0;
//         if (gamePlayData['user'][pidx]['blind'] == true)
//                 transferAmount += betValue / 2;
//         else
//                 transferAmount += betValue;

//         return transferAmount;
// }

// $bet.addEventListener('click', function () {
//         // if it is the user's turn
//         let pidx = gamePlayData['turn'];
//         if (current_user.name == game_data["users"][pidx].username) {
//                 let amount = getAmountBet(pidx);
//                 let action = "make bet";
//                 transactionHandler(amount, action);
//         }
// })
// // Make bet...

// // Raise bet...
// // get amount to be transferred to pot by player : pidx (for BET)
// function getAmountRaise(pidx) {
//         let betValue = 2 * gamePlayData['betValue'];
//         let transferAmount = 0;
//         if (gamePlayData['user'][pidx]['blind'] == true)
//                 transferAmount += betValue / 2;
//         else
//                 transferAmount += betValue;

//         return transferAmount;
// }
// $raise.addEventListener('click', function () {
//         // if it is the user's turn
//         let pidx = gamePlayData['turn'];
//         if (current_user.name == game_data["users"][pidx].username) {
//                 let amount = getAmountRaise(pidx);
//                 let action = "raise bet";
//                 transactionHandler(amount, action);
//         }
// })
// // Raise bet...

// // request side show...
// $sideShow.addEventListener('click', function () {
//         removeGameplayButtonsDOM();
//         // if it is the user's turn
//         let pidx = gamePlayData['turn'];
//         if (current_user.name == game_data["users"][pidx].username && gamePlayData['livePlayers'] > 2) {
//                 let amount = getAmountBet(pidx);
//                 let action = 'request side show';
//                 transactionHandler(amount, action);
//         }
// })
// // request side show...

// side show response...
function addGamePlayButtonsDOM() {
        if (!$topbar.contains($view))
                $topbar.appendChild($view);
        if (!$topbar.contains($bet))
                $topbar.appendChild($bet);
        if (!$topbar.contains($raise))
                $topbar.appendChild($raise);
        if (!$topbar.contains($sideShow))
                $topbar.appendChild($sideShow);
        if (!$topbar.contains($show))
                $topbar.appendChild($show);
        if (!$topbar.contains($fold))
                $topbar.appendChild($fold);
}
function removeGameplayButtonsDOM() {
        if ($topbar.contains($view))
                $topbar.removeChild($view);
        if ($topbar.contains($bet))
                $topbar.removeChild($bet);
        if ($topbar.contains($raise))
                $topbar.removeChild($raise);
        if ($topbar.contains($sideShow))
                $topbar.removeChild($sideShow);
        if ($topbar.contains($show))
                $topbar.removeChild($show);
        if ($topbar.contains($fold))
                $topbar.removeChild($fold);
}
$sideShowYes.addEventListener('click', function () {
        $topbar.removeChild($sideShowYes);
        $topbar.removeChild($sideShowNo);
        // add buttons removed earlier
        addGamePlayButtonsDOM();
        socket.emit('sideshow response', current_user.room_id, current_user.client_id, 1);
})
$sideShowNo.addEventListener('click', function () {
        $topbar.removeChild($sideShowYes);
        $topbar.removeChild($sideShowNo);
        // add buttons removed earlier
        addGamePlayButtonsDOM();
        socket.emit('sideshow response', current_user.room_id, current_user.client_id, 0);
})
// side show response...

// request show...
$show.addEventListener('click', function () {
        // if it is the user's turn
        let pidx = gamePlayData['turn'];
        if (current_user.name == game_data["users"][pidx].username) {
                let amount = getAmountBet(pidx);
                let action = "request show";
                transactionHandler(amount, action);
        }
})
// request show...

// fold...
$fold.addEventListener('click', function () {
        socket.emit('fold', current_user.room_id, current_user.client_id);
})
// fold...
// Gameplay Events....

deck.cards.forEach(function (card, i) {
        // card.enableFlipping();
        // card.enableDragging();
});

function game_start_animation() {
        deck.mount($container)
        deck.intro();
        deck.sort();
}

// Game Deck .....................


// Card distribution ..............

// when the server distributes all cards mount the new deck of cards recieved
socket.on('distribution done', (data, gamePlayDataServer) => {

        // remove distribute button from previous distribution_turn
        if (game_data["users"][distribution_turn].username == current_user.name)
                $topbar.removeChild($distribute);

        gamePlayData = gamePlayDataServer;

        // invalidate all data
        for (let i = 0; i < deck.cards.length; i++) {
                deck.cards[i].i = JOKER_ID;
                deck.cards[i].pos = -1;
                deck.cards[i].rank = -1;
                deck.cards[i].suit = -1;
        }

        // distribute cards to respective position
        deck.queue(animate_distribution);

        console.log("Distribution")
        // Gameplay addition....
        addGamePlayButtonsDOM();
        // Gameplay addition....

        highlight_current_player(distribution_turn);
        update_score_board(gamePlayData);
})

function update_score_board(gamePlayData) {

        // if(!gamePlayData  || !gamePlayData.user){
        //         return ;
        // }
        console.log("Score board")
        console.log(gamePlayData);

        var users_obj = gamePlayData.user;

        var users = Object.keys(users_obj).map((key) => {
                return users_obj[key];
        });


        users.sort((a, b) => {
                return b.value - a.value;

        });

        user_list = "";
        for (var i = 0; i < users.length; i++) {
                user_list += '<tr><td>' + (i + 1).toString() + '</td><td>' + users[i].username + '</td><td>' + users[i].currentBet.toString() + '</td><td>' + users[i].value.toString() + '</td></tr>';
        }

        $score_board_list.innerHTML = user_list;

};

/*
the player with index "idx" is sent to the position at an angle of 
theta = idx * 360 / N;
where N is number of players
idx = index in the stored array of server 
i.e index in users[room_id]
 */
function animate_distribution() {

        var counter2 = 0;

        let outer_radius = 325;
        let inner_radius = outer_radius - 50;

        let delay = 0;
        let N = game_data["users"].length;

        for (let j = 0; j < 3; j++) {

                // card distribution starts from the upper-most card i.e of index 51
                let pidx = distribution_turn;
                do {

                        let rot = pidx * 360 / N;
                        let radius = 0;
                        let card_rot = 0;
                        let card_idx = 51 - (N * j + pidx);
                        delay = delay + 1;

                        if (j == 0)
                                radius = outer_radius;
                        else
                                radius = inner_radius;

                        if (j == 1)
                                card_rot = +5;
                        else if (j == 2)
                                card_rot = -5;

                        rot = rot + card_rot;

                        deck.cards[card_idx].animateTo({

                                delay: 500 * delay, // wait 1 second + i * 2 ms
                                duration: 500,
                                ease: 'quartOut',

                                x: Math.cos(rot * Math.PI / 180) * radius,
                                y: Math.sin(rot * Math.PI / 180) * radius,
                                rot: 720 + card_rot
                        });
                        pidx = (pidx + 1) % N;
                } while (pidx != distribution_turn);
        }
}
// Card distribution ...............

// View cards .........................
socket.on("view own cards", (data) => {

        console.log("View request")

        // modifying cards 
        var num_cards = data.length;
        for (var j = 0; j < data.length; j++) {

                var i = data[j].card_idx;
                var rank = i % 13 + 1;
                var suit = i / 13 | 0;

                deck.cards[data[j].deck_idx].i = i;
                deck.cards[data[j].deck_idx].rank = rank;
                deck.cards[data[j].deck_idx].suit = suit;
                deck.cards[data[j].deck_idx].enableDragging();
                deck.cards[data[j].deck_idx].setSide('front');
        }

})
// View cards .........................

// Gameplay events....
socket.on('its not your turn', () => {
        console.log("its not your turn");
})

socket.on('cannot show until exactly 2 players left', () => {
        console.log("cannot show until exactly 2 players left");
})

socket.on('cannot request side show without more than 2 players', () => {
        console.log("cannot request side show without more than 2 players");
})

socket.on('side show requested', (request_client_id) => {
        console.log('side show requested' + request_client_id);
        $topbar.appendChild($sideShowYes);
        $topbar.appendChild($sideShowNo);
        // remove unnecessary buttons for space
        removeGameplayButtonsDOM();
})

socket.on('No side show request to respond to', () => {
        console.log('No side show request to respond to');
})

socket.on('side show declined', () => {
        addGamePlayButtonsDOM();
        console.log('side show declined');
})
socket.on('side show accepted', () => {
        addGamePlayButtonsDOM();
        console.log('side show accepted');
})
socket.on('recieved final show data', (cards1, cards2) => {

        for (var j = 0; j < 3; j++) {

                var i, rank, suit;

                i = cards1[j].card_idx;
                rank = i % 13 + 1;
                suit = i / 13 | 0;

                deck.cards[cards1[j].deck_idx].i = i;
                deck.cards[cards1[j].deck_idx].rank = rank;
                deck.cards[cards1[j].deck_idx].suit = suit;
                deck.cards[cards1[j].deck_idx].enableDragging();
                deck.cards[cards1[j].deck_idx].setSide('front');

                i = cards2[j].card_idx;
                rank = i % 13 + 1;
                suit = i / 13 | 0;

                deck.cards[cards2[j].deck_idx].i = i;
                deck.cards[cards2[j].deck_idx].rank = rank;
                deck.cards[cards2[j].deck_idx].suit = suit;
                deck.cards[cards2[j].deck_idx].enableDragging();
                deck.cards[cards2[j].deck_idx].setSide('front');

        }
})

socket.on('turn complete', (gamePlayDataServer, move) => {

        let previousTurn = gamePlayData["turn"];

        gamePlayData = gamePlayDataServer;

        let currentTurn = gamePlayData["turn"];

        console.log('previousTurn : ' + previousTurn + "\n currentTurn : " + currentTurn);
        update_turn_ui(previousTurn, currentTurn);

        let split_array = move.split("$");
        if (split_array.length == 2) {
                move = split_array[0];
                console.log('folding cards of ' + split_array[1] + ' in side show');
                deck.queue(fold_cards_animation(parseInt(split_array[1])));
        }

        console.log('Move made : ' + move);
        display_move_ui(previousTurn, move);

        // move cards of player previousTurn to deck.
        if (move == 'Fold')
                deck.queue(fold_cards_animation(previousTurn));
        /* 
        Note that when 2 players are left in the game, and one of them folds
        we don't show the cards of winning player, this is done to prevent others 
        from observing if the winning player was bluffing or not.
        */

        // request show data for p1, p2 and flip respective indexes
        else if (move == 'Show')
                socket.emit('request final show data', current_user.room_id, previousTurn, currentTurn);

})

socket.on('game completed', (gamePlayDataServer, win_indexes) => {
        var winner_text = ""
        if (win_indexes.length == 2) {
                winner_text = "Game Drawn!"
        } else {
                winner_text = game_data["users"][win_indexes[0]].username + " won the game!";
        }

        winner_text += "<span style=\"font-size:18px\"><br> The admin can start a new round by clicking the \"new round\" button at the bottom.<span>"

        winnerTitle.innerHTML = winner_text;

        winnerDislplayContainer.style.display = "block";

        gamePlayData = gamePlayDataServer;
        for (let i = 0; i < win_indexes.length; i++)
                console.log("game won by : " + win_indexes[i]);

        removeGameplayButtonsDOM();
        // NOTE : may need modifications
        // only admin has the permission for starting the next round
        if (current_user.admin)
                $topbar.appendChild($new_round);

        display_move_ui(-1, -1);

});
// Gameplay events....

// Gameplay UI updates ...............

function update_turn_ui(previousTurn, currentTurn) {
        // change font colors according to turn
        highlight_current_player(currentTurn)
}

function display_move_ui(previousTurn, move) {
        // display move made by player previousTurn
        var last_move = "";

        if (previousTurn !== -1) {
                var previousPlayerName = game_data["users"][previousTurn].username;
                last_move += "<tr><td style=\"text-align: left; font-size: 18px\">Previous move made by: " + previousPlayerName + "</td></tr>"
                last_move += "<tr><td style=\"text-align: left; font-size: 18px\">Move: " + move + "</td></tr>";
        }

        last_move += "<tr><td style=\"text-align: left; font-size: 18px\">Current Bet: " + '<b>' + gamePlayData.betValue + '</b>' + "</td></tr>";
        last_move += "<tr><td style=\"text-align: left; font-size: 18px\">Pot Amount: " + '<b>' + gamePlayData.pot + '</b>' + "</td></tr>";

        last_move_list.innerHTML = last_move;
        update_score_board(gamePlayData);
}

function refresh_game_ui() {
        deck.unmount($container);
        deck = Deck();
        deck.mount($container);
        // change deck and other necessary things to start next round
        // Note : DO not animate cards until the next round is started
}
function fold_cards_animation(playerIdx) {
        let N = game_data["users"].length;
        console.log("Folding cards " + playerIdx)
        if (current_user.name == game_data["users"][playerIdx].username)
                removeGameplayButtonsDOM();
        for (let j = 0; j < 3; j++) {
                let card_idx = 51 - (N * j + playerIdx);
                console.log(card_idx);
                deck.cards[card_idx].setSide('back');
                deck.cards[card_idx].disableDragging();
                deck.cards[card_idx].animateTo({

                        delay: 500 * j,
                        duration: 500,
                        ease: 'quartOut',

                        x: -0.25 * card_idx,
                        y: -0.25 * card_idx,
                        z: 0.25 * (card_idx + 1),
                        rot: 0
                });
        }
}

// Gameplay UI updates ...............

// New round .........................
$new_round.addEventListener('click', function () {
        socket.emit('inform server about new round', current_user.room_id);
});
socket.on('start new round', (gamePlayDataServer) => {

        winnerDislplayContainer.style.display = "none";

        if (current_user.admin)
                $topbar.removeChild($new_round);

        gamePlayData = gamePlayDataServer;
        distribution_turn = (distribution_turn + 1) % game_data["users"].length;
        highlight_current_player(distribution_turn);
        // add distribute button for the next user starting the round.
        if (game_data["users"][distribution_turn].username == current_user.name)
                $topbar.appendChild($distribute);

        // perform other necessary UI updates
        display_move_ui(-1, -1);
        refresh_game_ui();
})
// New round .........................