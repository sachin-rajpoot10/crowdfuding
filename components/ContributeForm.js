import {Router} from '../routes';
import React,{useState} from 'react';
import {Form,Input,Message,Button} from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

const ContributeForm = (props)=>{

    const [inputs,setInputs] = useState({});
    const [errorMessage,setErrorMessage]=useState("");
    const [loading,setLoading] = useState(false);
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    };

    const onSubmit = async (event)=>{
        event.preventDefault();
        setErrorMessage('');
        const campaign = Campaign(props.address);
        setLoading(true);
        try{
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from:accounts[0],
                value:web3.utils.toWei(inputs.value,'ether')
            });
            setLoading(false);
            setInputs(values => ({...values, value: 0}));
            Router.replaceRoute(`/campaigns/${props.address}`);
        }catch(err){
            setErrorMessage(err.message);
        }
        setLoading(false);
        
    }
    return (
        <Form onSubmit={onSubmit} error={!!errorMessage}>
            <Form.Field>
                <label>Amount to ContributeForm</label>
                <Input 
                    name="value"
                    label = "ether"
                    labelPosition="right"
                    value={inputs.value || ""}
                    onChange={handleChange}
                />
            </Form.Field>
            <Message error header = "Oops!" content = {errorMessage}/>
            <Button primary loading={loading}>Contribute!</Button>
        </Form>
    )
}

export default ContributeForm;