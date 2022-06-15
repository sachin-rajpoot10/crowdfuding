import web3 from "./web3";
import campaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(campaignFactory.interface),
    '0xb09b73410e808262F30A0Eb07c3890Eb20cd67C1'
);

export default instance;