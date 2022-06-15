import React,{useState} from 'react';
import {Form,Button,Message, Input} from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import {Link, Router} from '../../../routes';

const RequestNew = (props)=>{
    const [inputs,setInputs]= useState({}); 
    const [errorMessage,setErrorMessage]=useState("");
    const [loading,setLoading] = useState(false);
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    };

    const onSubmit =async (event)=>{
        event.preventDefault();
        setErrorMessage('');
        const campaign = Campaign(props.address);
        setLoading(true);
        try{
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
            .createRequest(
                    inputs.Description,
                    web3.utils.toWei(inputs.value,'ether'),
                    inputs.recipient)
            .send({
                from:accounts[0]
            });
            setLoading(false);
            setInputs(values => ({...values, value: 0}));
            Router.pushRoute(`/campaigns/${props.address}/requests`);
        }catch(err){
            setErrorMessage(err.message);
            setLoading(false);
        }
    }
    return (
        <Layout>
            <Link route={`/campaigns/${props.address}/requests`}>
                <a>
                    Back
                </a>
            </Link>
            <h3>create a request</h3>
            <Form onSubmit={onSubmit} error={!!errorMessage}>
                <Form.Field>
                    <label>Description</label>
                    <Input 
                        name = "Description"
                        value = {inputs.Description||""}
                        onChange={handleChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Value in Ether</label>
                    <Input
                        name="value"
                        label = "ether"
                        labelPosition="right"
                        value={inputs.value||""}
                        onChange={handleChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Recipient</label>
                    <Input
                        name = "recipient"
                        value = {inputs.recipient||""}
                        onChange={handleChange}
                    />
                </Form.Field>
                <Message error header = "Oops!" content = {errorMessage}/>
                <Button primary loading={loading}>create request!</Button>
            </Form>
        </Layout>
    );
}

RequestNew.getInitialProps = async(props)=>{
    const address  = props.query.address;
    return {address};
}

export default RequestNew;