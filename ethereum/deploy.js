const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const compiledFactory = require('./build/CampaignFactory.json');


const provider = new HDWalletProvider(
   'mistake ask blade wing escape claim comfort battle actress below own error',
   'https://rinkeby.infura.io/v3/c9e027f46d244d778b1763236b8ad3de'
);
const web3 = new Web3(provider);

let accounts;
let result;
const deploy = async () =>{
    accounts = await web3.eth.getAccounts();
    console.log("attempting to deploy from",accounts[0]);
    result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data:compiledFactory.bytecode})
        .send({from:accounts[0],gas:'1000000'});
        
    console.log('Contract deployed to',result.options.address);
    provider.engine.stop(); // to prevent a hanging deployment
};
deploy();
