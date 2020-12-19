
const getAccountsButton = document.getElementById('getAccounts');
const getAccountsResults = document.getElementById('getAccountsResult');
const onboardButton = document.getElementById('connectMetamaskButton');

function initialize_metamask() {
        
        const isMetaMaskInstalled = () => {
                const { ethereum } = window;
                return Boolean(ethereum && ethereum.isMetaMask);
        };

        const MetamaskClientCheck = () => {
                
                if (!isMetaMaskInstalled()) {
                        
                        onboardButton.innerText = 'Click here to install MetaMask!';
                        
                } else {
                        onboardButton.innerText = 'Connect';
                        onboardButton.onclick = onClickConnect;
                        onboardButton.disabled = false;
                }
        };
        MetamaskClientCheck();

};

async function onClickConnect  ()  {
        try {
                //Will Start the MetaMask Extension
                await ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
                console.error(error);
        }
};

getAccountsButton.addEventListener('click', async () => {
        
        const accounts = await ethereum.request({ method: 'eth_accounts' })
        console.log(accounts)
});

initialize();