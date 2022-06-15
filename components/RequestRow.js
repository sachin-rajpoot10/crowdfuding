import React,{useState,useEffect} from 'react';
import {Button,Table} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import {Link, Router} from '../routes';

const RequestRow = (props)=>{
    const [loadingApprove,setLoadingApprove] = useState(false);
    const [loadingFinalize,setLoadingFinalize] = useState(false);
    const [accounts,setAccounts] = useState([]);
    const {Row,Cell} = Table;
    const {id,request,approversCount} = props;
    const readyToFinalize = request.approvalCount > approversCount/2;
    const campaign = Campaign(props.address);
    const [isManager,setIsManager]=useState(false);
    useEffect(async()=>{
        setAccounts(await web3.eth.getAccounts());
        const mngr = await campaign.methods.manager().call();
        setIsManager((accounts[0]== mngr));
    });
    const onApprove = async ()=>{
        setAccounts(await web3.eth.getAccounts());
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(id).send({
            from:accounts[0]
        });
        setLoadingApprove(false);
        Router.replaceRoute(`/campaigns/${props.address}/requests`);
    }
    const onFinalize = async ()=>{
        setLoadingFinalize(true);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(id).send({
            from:accounts[0]
        });
        setLoadingFinalize(false);
        Router.replaceRoute(`/campaigns/${props.address}/requests`);
    }
    return (
        <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
            <Cell>{id}</Cell>
            <Cell>{request.description}</Cell>
            <Cell>{web3.utils.fromWei(request.value,'ether')}</Cell>
            <Cell>{request.recipient}</Cell>
            <Cell>{request.approvalCount}/{approversCount}</Cell>
            <Cell>
                {request.complete ? null:(
                    <Button 
                        color="green" 
                        basic onClick={onApprove} 
                        loading={loadingApprove}
                    >
                        Approve
                    </Button>
                )}
            </Cell>
            <Cell>
                {!request.complete && isManager  ? (
                <Button color="orange" basic onClick={onFinalize} loading={loadingFinalize}>Finalize</Button>
                ):null}
            </Cell>
        </Row>
    );
}

export default RequestRow;