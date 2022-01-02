import { Grid, makeStyles, Typography } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import Selecter from '../../components/Selecter'
import DateFnsUtils from '@date-io/date-fns';
import axiosInstance  from '../../apisConfig'
import SpineerButton from '../../components/SpineerButton';
import {MuiPickersUtilsProvider,KeyboardDatePicker,} from '@material-ui/pickers';
import HourglassFullRoundedIcon from '@material-ui/icons/HourglassFullRounded';
import StorageRoundedIcon from '@material-ui/icons/StorageRounded';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);
    

const useStyles = makeStyles((theme) => ({
    table:{
        marginTop:'20px',
        overflowX:'auto',
        '@media only screen and (max-width: 600px)': {
            width:'320px',
        },
    },
    filter:{
            '@media only screen and (max-width: 600px)': {
                width:'45vh !important',
            },
        
    }
}))

const columns = ['Date','Description','Debit','Credit','Net Balance']

export default function BankLedger() {
    var date = new Date();
    const initialFields = {
        bank:'Select Bank',
        FromDate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        ToDate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    }
    
    const classes = useStyles();
    const [fields,setFields] = useState(initialFields);    
    const [banks,setBanks] = useState([]);    
    const [loading,setLoading] = useState(false);    
    const [bankTitle,setBankTitle] = useState(initialFields.bank);
    const [rows,setRows] = useState([]);
    

    async function fetchBanks(){
        if (navigator.onLine){
            return await axiosInstance.get('apis/Bank/')
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
                    setBanks(d);
                    localStorage.removeItem('BankLedger');
                    localStorage.setItem('BankLedger',JSON.stringify(d));
                }
            })
            .catch(error=>{
                alert(`Somethin wrong: ${error}`);
            })
        }
        else{
            setBanks(JSON.parse(localStorage.getItem('BankLedger')));
        }
    }
    
    async function fetchLedger(){
        if (navigator.onLine){
            return await axiosInstance.get(`apis/BankLedger/${fields.bank}/${fields.FromDate}/${fields.ToDate}`)
            .then(res=>{
                let data  = res;
                if (data['error'] === true){
                    alert(`Error Occures ${data['message']}`);
                    setRows(data);
                }
                else{
                    let data = res.data;
                    for (var p in data){
                        data[p].bank = data[p].bank.name
                    }
                    setRows(data);
                    setLoading(false);
                    localStorage.removeItem('BankLedger');
                    localStorage.setItem('BankLedger',JSON.stringify(banks));
                }
            })
            .catch(error=>{
                setLoading(false);
                console.log(`${error}`);
            })
        }
        else{
            setRows(JSON.parse(localStorage.getItem('BankLedger')));
        }
    }

    const handleFromDateChange = (date) => {
        var d =  date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        setFields({
            ...fields,
            'FromDate' : String(d)
        })
    };

    const handleToDateChange = (date) => {
        var d =  date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        setFields({
            ...fields,
            'ToDate' : String(d)
        })
    };

    const handleButtonClick =()=>{
        setLoading(true);
        if (fields !== initialFields){
            fetchLedger();
        }
    }
    
    const FiledChange = (event) => {
        if (event.target.name === 'bank'){
            const index = event.target.selectedIndex;
            const optionElement = event.target.childNodes[index];
            const optionElementId = optionElement.getAttribute('id');
            const obj = JSON.parse(optionElementId);
            setBankTitle(obj.name);
        }
        setFields({
            ...fields,
            [event.target.name] : event.target.value,
        });
    };

    const selecterOpen = ()=>{

    }
    
    
   
    useEffect(() => {
        fetchBanks()
    }, [])

    return (
    <>
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            className={classes.filter}
        >
           {/* Title */}
           <Grid item xs={12} >     
                <Typography variant="h4" gutterBottom  color='primary'>Bank Ledger</Typography>
            </Grid>
            
           <Grid item  xs={12} md={3} lg={2} className={classes.selecter}>
                <Selecter
                    title={bankTitle}
                    handleChange={FiledChange}
                    value={fields.salesOfficer}
                    onOpen={selecterOpen}
                    choises={banks}
                    name='bank'
                />
           </Grid>
           
           <Grid item xs={6} md={3} lg={2}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    autoOk
                    format='yyyy-MM-dd'
                    id='FromDate'
                    name='FromDate'
                    value={fields.FromDate}
                    onChange={handleFromDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'Select From Date',
                        }}
                    />
                </MuiPickersUtilsProvider>
           </Grid>
          
           <Grid item xs={6} md={3} lg={2}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        autoOk
                        format='yyyy-MM-dd'
                        id='ToDate'
                        name='ToDate'
                        value={fields.ToDate}
                        onChange={handleToDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'Select ToDate',
                            }}
                        />
                </MuiPickersUtilsProvider>
           </Grid>
            
            <Grid item xs={12} md={3} lg={2}>
                    <SpineerButton
                    className={classes.selecter}
                     handleButtonClick={handleButtonClick} 
                     label={(loading?'Loadning':'Get Data')}
                     loading={loading}
                     success={false}
                     size="large"
                     startIcon={(loading? <HourglassFullRoundedIcon/>:<StorageRoundedIcon />)}
                    />
            </Grid>
            
       </Grid>
    {/* TAble */}     
    <TableContainer component={Paper} className={classes.table}>
    <Table className={classes.table} aria-label="customized table">
        <TableHead>
        <TableRow>
            {columns.map((column) => (
                    <StyledTableCell
                        key={column}
                        align="center"
                        // style={{ minWidth: column.minWidth }}
                        >
                        {column}
                    </StyledTableCell>
                ))}
        </TableRow>
        </TableHead>
        <TableBody>
        {rows.map((row) => (
            <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">{row.date}</StyledTableCell>
                <StyledTableCell align='center' >{row.description}</StyledTableCell>
                {row.transaction_type === 'Credit'?
                <>
                <StyledTableCell align='center' ></StyledTableCell>
                <StyledTableCell align='center' >{row.total_amount}</StyledTableCell>
                </>
                :
                <>
                <StyledTableCell align='center' >{row.total_amount}</StyledTableCell>
                <StyledTableCell align='center' ></StyledTableCell>
                </>
                }
                <StyledTableCell align='center' >{row.net_balance}</StyledTableCell>
            </StyledTableRow>
        ))}
        </TableBody>
    </Table>
    </TableContainer>
    </>)
}
