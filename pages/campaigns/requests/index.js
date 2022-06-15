import React from 'react';
import {Button,Table} from 'semantic-ui-react';
import {Link} from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

const RequestIndex = (props)=>{

    const {Header,Row,HeaderCell,Body} = Table;

    const renderRows = ()=>{
        return props.requests.map((request,index)=>{
            return <RequestRow
                key={index}
                id={index}
                request={request}
                address={props.address}
                approversCount = {props.approversCount}
                />
        });
    }
    return (
        <Layout>
            <Link route={`/campaigns/${props.address}`}>
                <a>
                    Back
                </a>
            </Link>
            <h3>Requests List</h3>
            <Link route ={`/campaigns/${props.address}/requests/new`}>
                <a>
                    <Button primary floated='right' style={{marginBottom:10}}>
                        Add Request
                    </Button>
                </a>
            </Link>
            <Table>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Approval Count</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    {renderRows()}
                </Body>
            </Table>
            <div>Found {props.requestCount} requests.</div>
        </Layout>
    );
}
RequestIndex.getInitialProps = async(props)=>{
    const {address} = props.query;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    //console.log(requestCount);
    const requests = await Promise.all(
        Array(parseInt(requestCount)).fill().map((element,index)=>{
            return campaign.methods.requests(index).call();
        })
    );
    const approversCount = await campaign.methods.approversCount().call();
    //console.log(approvers);
    return {address,requestCount,requests,approversCount};
}
export default RequestIndex;