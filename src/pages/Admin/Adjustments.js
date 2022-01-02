import {FormControl, Grid, InputLabel, makeStyles, MenuItem, Paper, Select, TextareaAutosize, Typography } from '@material-ui/core';
import React, { useState } from 'react'
import axiosInstance from '../../apisConfig';
import MenuItems from '../../components/MenuItems';
import Selecter from '../../components/Selecter';
import InputField from '../../components/InputField';
import SpineerButton from '../../components/SpineerButton';
import CallMissedOutgoingIcon from '@material-ui/icons/CallMissedOutgoing';

const useStyles = makeStyles((theme) => ({
    root: {
        '@media only screen and (max-width: 600px)': {
          width:'340px',
         },
      },
      formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
      selectEmpty: {
        marginTop: theme.spacing(2),
      },
      textArea:{
        width: '100%',
        maxWidth:'400px',
        minHeight:'150px',
        maxHeight:'350px',
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius:'4px',
      },
  }));


function Adjustments() {
    const classes = useStyles();
     
    // Sender
    const [senderLgTypeOpen, setSenderLgTypeOpen] = useState(false);
    const [senderLgType,setSenderType] = useState('');
    const [senderHeaders,setSenderHeaders] = useState([]);
    const [senderHeaderTitle,setSenderHeaderTitle] = useState('Select Header');
    const [senderHdDisabled,setSenderHdDisabled] = useState(true);
    // Reciver
    const [reciverLgTypeOpen, setReciverLgTypeOpen] = useState(false);
    const [reciverLgType,setReciverType] = useState('');
    const [reciverHeaderTitle,setReciverHeaderTitle] = useState('Select Header');
    const [reciverHeaders,setReciverHeaders] = useState([]);
    const [ReciverHdDisabled,setReciverHdDisabled] = useState(true);
   

    // Genatric
    const initialFields = {
        senderheader: '',
        reciverheader:'',
        senderPaymentType : 'Credit',
        senderDescription:'',
        senderAmount:'',
        reciverPaymentType : 'Debit',
        reciverDescription:'',
        reciverAmount:'',
    }

    async function FetchSenderReleventHeader(type){
        let send_type = type;
        if (send_type === 'Cheque'){
            send_type = 'Bank';
        }
        return await axiosInstance.get(`apis/${send_type}/`)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                alert(`Error Occures ${data['message']}`);
            }
            else{
                let headers = data['data'];
                for (let h in headers){
                    delete headers[h].date;
                    delete headers[h].current_Balance;
                   
                }
                setSenderHeaders(headers);
                setSenderHdDisabled(false);
            }
        })
        .catch(error=>{
            alert(`Somethin wrong: ${error}`);
        })
    } 

    async function FetchReciverReleventHeader(type){
        let send_type = type;
        if (send_type === 'Cheque'){
            send_type = 'Bank';
        }
        return await axiosInstance.get(`apis/${send_type}/`)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                alert(`Error Occures ${data['message']}`);
            }
            else{
                let headers = data['data'];
                for (let h in headers){
                    delete headers[h].date;
                    delete headers[h].current_Balance;
                    
                }
                setReciverHeaders(headers);
                setReciverHdDisabled(false);
            }
        })
        .catch(error=>{
            alert(`Somethin wrong: ${error}`);
        })
    } 
    
    async function FormSubmit(e){
        setLoadind(true);
        e.preventDefault();
        let send_dict = {
            ...fields,
            reciverLgType:reciverLgType,
            senderLgType:senderLgType,
        }
        return await axiosInstance.post('apis/LedgerAdjustments/',send_dict)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                alert(`Error Occures ${data['message']}`);
                setLoadind(false);
            }
            else{
                setFields(initialFields);
                setSenderHeaderTitle('Select');
                setReciverHeaderTitle('Select');
                setLoadind(false);
                setSenderHdDisabled(true);
                setReciverHdDisabled(true);
                setSenderType('');
                setReciverType('');
                alert(`${data['message']}`);
            }
        })
        .catch(error=>{
            alert(`Somethin wrong: ${error}`);
            setLoadind(false);
        })
        
    }
    const [fields,setFields] = useState(initialFields);
    const [loading,setLoadind] = useState(false);
    const LedgersTitle = ['Party','SalesOfficer','Bank','Incentive','Cheque','Sales','Freight','Discount','Cash']
    
    const SenderTypeChange = (e) =>{
        setSenderType(e.target.value);
        if (e.target.value === 'Party' || e.target.value === 'SalesOfficer' || e.target.value === 'Bank' || e.target.value === 'Cheque'){
            FetchSenderReleventHeader(e.target.value);
        }
        else{
            setSenderHdDisabled(true);
        }
    }
    const ReciverTypeChange = (e) =>{
        setReciverType(e.target.value);
        if (e.target.value === 'Party' || e.target.value === 'SalesOfficer' || e.target.value === 'Bank' || e.target.value === 'Cheque'){
            FetchReciverReleventHeader(e.target.value);
        }
        else{
            setReciverHdDisabled(true);
        }
    }
    const senderFieldsChange = (event)=>{      
        setFields({
            ...fields,
            [event.target.name] : event.target.value
        })
    }
    const senderHeaderChange =(event)=>{
        const index = event.target.selectedIndex;
        const optionElement = event.target.childNodes[index];
        const optionElementId = optionElement.getAttribute('id');
        const obj = JSON.parse(optionElementId);
        setSenderHeaderTitle(obj.name);
        setFields({
            ...fields,
            senderheader:event.target.value
        })
    }
    const reciverHeaderChange =(event)=>{
        const index = event.target.selectedIndex;
        const optionElement = event.target.childNodes[index];
        const optionElementId = optionElement.getAttribute('id');
        const obj = JSON.parse(optionElementId);
        setReciverHeaderTitle(obj.name);
        setFields({
            ...fields,
            reciverheader:event.target.value
        })
    }
    const reciverFieldsChange = (event)=>{
        try{
            if (reciverLgType === 'Bank' || reciverLgType === 'Party' || reciverLgType === 'SalesOfficer' || reciverLgType === 'SalesOfficer'){
                const index = event.target.selectedIndex;
                const optionElement = event.target.childNodes[index];
                const optionElementId = optionElement.getAttribute('id');
                const obj = JSON.parse(optionElementId);
                setReciverHeaderTitle(obj.name);
            }
        }
        catch{

        }
        
        setFields({
            ...fields,
            [event.target.name] : event.target.value
        })
    }
   
    
    return (
        <form style={{display:'contents'}} onSubmit={FormSubmit}>
            <Grid container justifyContent='center' alignItems="center" spacing={4} className={classes.root} component={Paper}>
                {/* Left (Sender) */}
                <Grid item xs={12} md={3}>
                    <Grid container direction='column' spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant='h3' color='textSecondary'>
                                From
                            </Typography>
                        </Grid>
                        <Grid item>
                            <FormControl className={classes.formControl} fullWidth >
                                <InputLabel id="SenderLegder">Ledger Type</InputLabel>
                                    <Select
                                        labelId="SenderLegder"
                                        id="SenderLegder"
                                        className={classes.selectEmpty}
                                        open={senderLgTypeOpen}
                                        onClose={()=>setSenderLgTypeOpen(false)}
                                        onOpen={()=>setSenderLgTypeOpen(true)}
                                        value={senderLgType}
                                        variant='outlined'
                                        onChange={SenderTypeChange}
                                        required
                                    >
                                    
                                    {LedgersTitle.map((lg)=>(<MenuItem key={lg} value={lg}>{lg}</MenuItem>))}
                                        
                                    </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <Selecter
                                title={senderHeaderTitle}
                                onOpen={()=>''}
                                disabled={senderHdDisabled}
                                handleChange={senderHeaderChange}
                                value={fields.senderheader}
                                choises={senderHeaders}
                                name='header'
                                />
                        </Grid>
                        <Grid item >
                            <MenuItems
                            options={['Credit','Debit']}
                            title='Transaction Type'
                            handleChange={(e)=>{setFields({...fields,'senderPaymentType':e.target.value,'reciverPaymentType':(e.target.value === 'Credit'?'Debit':'Credit')})}}
                            selectedOption={fields.senderPaymentType}
                            />
                        </Grid>
                        <Grid item >    
                            <TextareaAutosize required value={fields.senderDescription} onChange={senderFieldsChange} name='senderDescription' placeholder="Enter Discription" maxRows={12} className={classes.textArea}/>
                        </Grid>
                        <Grid item >
                            <InputField  size='small'
                                label="Amount " 
                                type="number"
                                name='senderAmount'
                                value={fields.senderAmount}
                                onChange={senderFieldsChange} 
                                required
                                />
                        </Grid>
                    </Grid> 
                </Grid>
                {/* Right ( Reciver) */}
                <Grid item xs={12} md={3}>
                    <Grid container direction='column' spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant='h3' color='textSecondary'>
                                To
                            </Typography>
                        </Grid>
                        <Grid item>
                            <FormControl className={classes.formControl} fullWidth >
                                <InputLabel id="ReciverLegder">Ledger Type</InputLabel>
                                    <Select
                                        labelId="ReciverLegder"
                                        id="ReciverLegder"
                                        className={classes.selectEmpty}
                                        open={reciverLgTypeOpen}
                                        onClose={()=>setReciverLgTypeOpen(false)}
                                        onOpen={()=>setReciverLgTypeOpen(true)}
                                        value={reciverLgType}
                                        variant='outlined'
                                        onChange={ReciverTypeChange}
                                        required={true}
                                    >
                                    
                                    {LedgersTitle.map((lg)=>(<MenuItem key={lg} value={lg}>{lg}</MenuItem>))}
                                        
                                    </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <Selecter
                                title={reciverHeaderTitle}
                                onOpen={()=>''}
                                disabled={ReciverHdDisabled}
                                handleChange={reciverHeaderChange}
                                value={fields.reciverheader}
                                choises={reciverHeaders}
                                name='header'
                                />
                        </Grid>
                        <Grid item >
                            <MenuItems
                                options={['Credit','Debit']}
                                title='Transaction Type'
                                handleChange={(e)=>{setFields({...fields,'reciverPaymentType':e.target.value})}}
                                selectedOption={fields.reciverPaymentType}
                                disabled={true}
                                />
                        </Grid>
                        <Grid item >    
                            <TextareaAutosize required value={fields.reciverDescription} 
                                              onChange={reciverFieldsChange} 
                                              name='reciverDescription' 
                                              placeholder="Enter Discription" 
                                              maxRows={12} 
                                              className={classes.textArea}/>
                        </Grid>
                        <Grid item >
                            <InputField  size='small'
                                label="Amount" 
                                type="number"
                                name='reciverAmount'
                                value={fields.senderAmount}
                                disabled={true}
                                />
                        </Grid>
                    </Grid> 
                </Grid>
                {/* Submit */}
                <Grid item xs={12} md={12} lg={12} container justifyContent='center' >
                    <SpineerButton
                        handleButtonClick={()=>{}} 
                        type='submit'
                        style={{width:'100vh'}}
                        label={'Save'}
                        color='secondary'
                        loading={loading}
                        size="large"
                        startIcon={<CallMissedOutgoingIcon />}
                        />
                </Grid>
            </Grid>
        </form>
    )
}
  
  
export default Adjustments;
  
  