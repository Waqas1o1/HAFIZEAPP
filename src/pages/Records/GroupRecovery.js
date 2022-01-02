import { Button,Checkbox,FormControlLabel,Grid,Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import Selecter from '../../components/Selecter';
import axiosInstance from '../../apisConfig';
import InputField from '../../components/InputField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItems from '../../components/MenuItems';

const useStyles = makeStyles((theme) => ({
    formRoot: {
      flexGrow: 1,
      padding : theme.spacing(2),
      '@media only screen and (max-width: 600px)': {
        width:'45vh'
        }
    },
    table: {
        '& .MuiDataGrid-columnHeader': {
            backgroundColor: theme.palette.primary.dark,
            cursor: 'pointer',
        },
        width:'100vh',
        '@media only screen and (max-width: 600px)': {
            width:'100%',
        },
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    chip: {
    margin: 2,
    },
}))

var selectedvalue= [];
const GroupRecovery = () => {
    const initialFields = {
        party_orders:[],
        sale_officer:'',
        payment_method:'Cash',
        bank: '',
        party:'',
        description: '',
        freight:0,
    };

    
    const classes = useStyles();
    const [amount,setAmount] = useState(0);
    const [fields,setFields] = useState(initialFields);
    const [partyOrders,setPartyOrders] = useState([]);
    // Bank
    const [banks,setBanks] = useState([]);
    const [bankTitle,setBankTitle] = useState('Select Bank');
    // Sales Officer
    const [salesOfficer,setSalesOfficer] = useState([]);
    const [salesOfficerTitle,setSalesOfficerTitle] = useState('Sales Officer');
    const [salesOfficerDisabled,setSalesOfficerDisabled] = useState(false);
    // Sales Officer
    const [parties,setParties] = useState([]);
    const [partyTitle,setPartyTitle] = useState('Select Party');
    // Remaing Recovery
    const [recoveryTotal,setRecoveryTotal] = useState(0);
    const [disabledAmount,setDisabledAmount] = useState(true);

    const [openDialog, setOpenDialog] = useState(false);
    const [bankDisabled,setBankDisabled] = useState(true);
    const [selectedOption,setSelectedOption] = useState(fields.payment_method);
        

    const handleSelect = (event) => {
        let item = JSON.parse(event.target.name);
        let total;
        if(event.target.checked){
            selectedvalue.push(event.target.value);
            total = recoveryTotal + parseInt(item.recoveryAmount);
        }else{
            total = recoveryTotal - parseInt(item.recoveryAmount);
            selectedvalue = selectedvalue.filter(value=>value !== event.target.value)
        }
        setRecoveryTotal(total);
        let p = [...partyOrders];
        for (let partyorder in p){
            if (p[partyorder].id === parseInt(event.target.value)){
                p[partyorder].disabled = event.target.checked;
            }
        }
        setPartyOrders(p);
    };

    const handleRecoveryAmountChange = (e) =>{
        setDisabledAmount(true);
        let p = partyOrders;
        for (let i in p){
            if (p[i].id === parseInt(e.target.name)){
                p[i].recoveryAmount = e.target.value
            }
        }
        setPartyOrders(p);
    }
    
   const Reset = () =>{
       setSalesOfficerTitle('Select SalesOfficer');
       setPartyTitle('Select Party');
       setAmount(0);
       setFields(initialFields);
   }

    async function fetchParties(){
        if (navigator.onLine){
            return await axiosInstance.get('apis/Party/')
            .then(res=>{
                let data  = res.data;
                if (data['error'] === true){
                    alert(`Error Occures ${data['message']}`);
                }
                else{
                    let parties = data['data'];
                    for (let p in parties){
                        parties[p].discount = parties[p].discount.discount;
                        delete parties[p].date
                        delete parties[p].current_Balance
                    }
                    setParties(parties);
                    localStorage.removeItem('Parties');
                    localStorage.setItem('Parties',JSON.stringify(parties));
                }
            })
            .catch(error=>{
                // alert(`Somethin wrong: ${error}`);
            })
        }
        else{
            setParties(JSON.parse(localStorage.getItem('Parties')));
        }
    }

    async function fetchBank(){
        if (navigator.onLine){
            return await axiosInstance.get('apis/Bank/')
            .then(res=>{
                let data  = res.data;
                if (data['error'] === true){
                    alert(`Error Occures ${data['message']}`);
                }
                else{
                    let bank = data['data'];
                    for (let b in bank){
                        delete bank[b].date
                        delete bank[b].current_Balance
                    }
                    setBanks(bank);
                    localStorage.removeItem('Bank');
                    localStorage.setItem('Bank',JSON.stringify(bank));
                }
            })
            .catch(error=>{
                alert(`Somethin wrong: ${error}`);
            })
        }
        else{
            setBanks(JSON.parse(localStorage.getItem('Bank')));
        }
    }

    async function fetchSalesOfficers(){
        if (navigator.onLine){
            return await axiosInstance.get('apis/SalesOfficer/')
            .then(res=>{
                let data  = res.data;
                if (data['error'] === true){
                    alert(`Error Occures ${data['message']}`);
                }
                else{
                    var d = data['data'];
                    for (let p in d){
                        delete d[p].date
                        delete d[p].current_Balance
                    }
                    setSalesOfficer(d);
                    localStorage.removeItem('SalesOfficer');
                    localStorage.setItem('SalesOfficer',JSON.stringify(d));
                }
            })
            .catch(error=>{
                alert(`Somethin wrong: ${error}`);
            })
        }
        else{
            setSalesOfficer(JSON.parse(localStorage.getItem('SalesOfficer')));
        }
    }

    async function ConfirmDelete(e){
        return await axiosInstance.delete(`apis/Recovery/`)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                alert(`Error Occures ${data['message']}`);
            }
            else{
                setFields(initialFields);
                setOpenDialog(false);
            }
        })
        .catch(error=>{
            alert(`Somethin wrong: ${error}`);
            setOpenDialog(false);
        })
        
    
    }

  
    const selecterOpen = (event)=>{
        // fetchDiscounts();
        
    }

   
    const FiledChange = (event) => {
        if (event.target.name === 'bank'){
            const index = event.target.selectedIndex;
            const optionElement = event.target.childNodes[index];
            const optionElementId = optionElement.getAttribute('id');
            const obj = JSON.parse(optionElementId);
            setBankTitle(obj.name);

        }
        if (event.target.name === 'party'){
            const index = event.target.selectedIndex;
            const optionElement = event.target.childNodes[index];
            const optionElementId = optionElement.getAttribute('id');
            const obj = JSON.parse(optionElementId);
            if (event.target.value !== undefined && event.target.value !== null && obj){
                setPartyTitle(obj.name);
                setDisabledAmount(false);
            }
        }
        if (event.target.name === 'sale_officer'){
            const index = event.target.selectedIndex;
            const optionElement = event.target.childNodes[index];
            const optionElementId = optionElement.getAttribute('id');
            const obj = JSON.parse(optionElementId);
            setSalesOfficerTitle(obj.name);
        }
      
        setFields({
            ...fields,
            [event.target.name] : event.target.value,
        });
        if (event.target.name === 'party'){
            setAmount(0);
            fetchReleventOrders(0,event.target.value);
        }
    };

    async function fetchReleventOrders(a=0,party=fields.party){
        setPartyOrders([]);
        return await axiosInstance.get(`apis/GetPartyOrderByAmount/${party}/${a}/`)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                alert(`Error Occures ${data['message']}`);
            }
            else{
                selectedvalue = [];
                let d = data.data;
                let remaining = a;
                for (let i in d){
                    if (remaining >= d[i].pandding_amount){
                        d[i].recoveryAmount = d[i].pandding_amount;
                        remaining -= d[i].pandding_amount ;
                    }
                    else if(remaining < d[i].pandding_amount && remaining > 0){
                        d[i].recoveryAmount = remaining;
                        remaining -= d[i].pandding_amount ;
                    }
                    else {
                        d[i].recoveryAmount = 0;
                    }
                }
                setPartyOrders(d);
            }
        })
        .catch(error=>{
            alert(`Somethin wrong: ${error}`);
            setOpenDialog(false);
        })

    }

    const handleAmountChange = (e)=>{
        var a;
        if (!e.target.value){
            a = 0;;
        }
        else{
            a = e.target.value;
        }
        setAmount(e.target.value);
        fetchReleventOrders(a);
    }
    const hanldeAmountChange = (e)=>{
        console.log(e.target.name)
    }

    function checkIsAdmin(){
        let u = localStorage.getItem('salesofficer');
        if(u === 'undefined' || u !== null ){
          let so = JSON.parse(u);
          setSalesOfficerDisabled(true);
          setSalesOfficerTitle(so.name);
          setFields({
            ...fields,
            sale_officer:so.id
          });
        }
      }

    const handleClose = () => {
        setOpenDialog(false);
    };
    const handleMenuChange = (event) => {
        setSelectedOption(event.target.value);
        setFields({
            ...fields,
            'payment_method' : event.target.value,
        });
        if (event.target.value === 'Bank'){
            setBankDisabled(false);
        }
        else{
            setBankDisabled(true);
        }
      };
    const handleSubmit = async (event) =>{
        if (selectedvalue.length === 0){
            alert('Please select one of the "Order"')
            return 
        }
        let payment_method = fields.payment_method;
        let bank = fields.bank;
        let sale_officer = fields.sale_officer;
        
        for (let i in selectedvalue){
            let party = '';
            let send_amount = 0;
            for (let p in partyOrders){
                if (partyOrders[p].id === parseInt(selectedvalue[i])){
                    party = partyOrders[p].party.id
                    send_amount = partyOrders[p].recoveryAmount
                }
            }
            let send_dict = {
                'party': party,
                'party_order':selectedvalue[i],
                'sale_officer':sale_officer,
                'payment_method':payment_method,
                'bank':bank,
                'amount':send_amount,
                'description':'Group Recovery'
            }
            await axiosInstance.post('apis/Recovery/',{...send_dict})
            .then(res=>{
                let data = res.data;
                if (data['error'] === true){
                    alert('SomeThing Wrong');
                }
                else{
                    if (recoveryTotal < amount ){
                        setAmount(amount - recoveryTotal);
                        fetchReleventOrders(amount,fields.party);
                        setRecoveryTotal(0);
                    }
                    else{
                        Reset();
                    }
                    alert('Suucess');
                }
            })
            

        }
        setPartyOrders([]);
    }
        
    useEffect(() => {
            fetchBank();
            fetchSalesOfficers();
            fetchParties();
            checkIsAdmin();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

  
    return (
        <Grid container spacing={2} className={classes.formRoot}>
            {/* Title */}
            <Grid item xs={11} >     
                <Typography variant="h4" gutterBottom  color='primary'>Group Recovery</Typography>
            </Grid>
           
            
            <Grid item xs={12} md={3} lg={3}>
                <Grid container item direction='column' spacing={3}>
                    {/* Sales Ofiicer Select */}
                    <Grid container item xs spacing={2}>
                        <Grid item xs>
                            <Selecter
                                title={salesOfficerTitle}
                                disabled={salesOfficerDisabled}
                                handleChange={FiledChange}
                                value={fields.sale_officer}
                                onOpen={selecterOpen}
                                choises={salesOfficer}
                                name='sale_officer'
                                />
                        </Grid>
                        <Grid item xs>
                            <Selecter
                                title={partyTitle}
                                handleChange={FiledChange}
                                value={fields.party}
                                onOpen={selecterOpen}
                                choises={parties}
                                name='party'
                                />
                        </Grid>
                    </Grid>
                    
                    <Grid item xs>
                        <InputField  size='small'
                            label="Recovery Amount" 
                            type="number" 
                            fullWidth
                            disabled={disabledAmount}
                            onChange={handleAmountChange} 
                            name='RecoveryAmount'
                            value={amount}
                            autoComplete='off'
                            />
                    </Grid>
                     
                    {/* Payment Method */}
                    <Grid item >
                        <MenuItems
                            options={['Cash','Clearing','Bank']}
                            title='Payment Method'
                            handleChange={handleMenuChange}
                            selectedOption={selectedOption}
                        />
                    </Grid>
                    
                    {/* Banks */}
                    <Grid item xs>
                     <Selecter
                        title={bankTitle}
                        handleChange={FiledChange}
                        value={fields.bank}
                        onOpen={selecterOpen}
                        choises={banks}
                        name='bank'
                        disabled={bankDisabled}
                     />
                    </Grid>
                   
                    <Grid item xs>
                     <Button color='primary'variant="contained" fullWidth onClick={handleSubmit}>
                        Submit
                     </Button>
                    </Grid>
                   
                </Grid>
           </Grid>
            {/* Right */}
           <Grid item xs={12} md={9} lg={9}>
                <TableContainer component={Paper}>
                    <Table  aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Check</TableCell>
                            <TableCell >Date</TableCell>
                            <TableCell >ID</TableCell>
                            <TableCell >Party</TableCell>
                            <TableCell >Cotact</TableCell>
                            <TableCell >Total Amount</TableCell>
                            <TableCell >Pending Amount</TableCell>
                            <TableCell  style={{color:'red'}} align='center'>Recovery Added</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {partyOrders.map((row)=>{
                            return(
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                        <FormControlLabel control={<Checkbox name={JSON.stringify(row)} onChange={handleSelect} value={row.id} />}/>:
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.date}
                                    </TableCell>
                                    <TableCell component="th">
                                        {row.id}
                                    </TableCell>
                                    <TableCell component="th">
                                        {row.party.name}
                                    </TableCell>
                                    <TableCell component="th">
                                        {row.party.contact}
                                    </TableCell>
                                    <TableCell component="th">
                                        {row.total_amount}
                                    </TableCell>
                                    <TableCell component="th">
                                        {row.pandding_amount}
                                    </TableCell>
                                   
                                    <TableCell component="th">
                                        <InputField  size='small'
                                                    type="string" 
                                                    fullWidth
                                                    disabled={true}
                                                    onChange={handleRecoveryAmountChange} 
                                                    name={`${row.id}`}
                                                    color='secondary'
                                                    value={row.recoveryAmount}
                                                    autoComplete='off'
                                                    />
                                    </TableCell>
                                </TableRow>
                            )
                            })}
                            <TableRow>
                                <TableCell component="th" colSpan={3}><b>Total Amount</b></TableCell>
                                <TableCell component="th"></TableCell>
                                <TableCell component="th"></TableCell>
                                <TableCell component="th"></TableCell>
                                <TableCell component="th"></TableCell>
                                <TableCell component="th" align='center' style={{color:'red',fontSize:'16px'}}><b>{recoveryTotal}.Rs</b></TableCell>
                            
                            </TableRow>
                            </TableBody>
                        </Table>
            </TableContainer>
           </Grid>
        
        {/* // Model */}
            <Dialog
                open={openDialog}
                onClose={handleClose}
                >
                <DialogTitle id="Dialog">Enter Recovery Amount</DialogTitle>
                <DialogContent>
                <DialogContentText id="DialogText">
                    <Grid container justifyContent='center'>
                        <Grid item>
                            <InputField  size='small'
                                label="Recovery Amount" 
                                type="number" 
                                fullWidth
                                onChange={hanldeAmountChange} 
                                name='RecoveryAmount'
                                value={fields.description}
                                />
                        </Grid>
                    </Grid> 
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="default" >
                        Cancel
                    </Button>
                    <Button onClick={ConfirmDelete} color="secondary" autoFocus>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}

export default GroupRecovery;
