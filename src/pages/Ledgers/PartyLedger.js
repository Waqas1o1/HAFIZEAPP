import { Grid, Typography } from '@material-ui/core'
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
    


const columns = ['Date','Description','Freight','Debit','Credit','Net Balance']

export default function PartyLedger() {
    var date = new Date();
    const initialFields = {
        party:'Select Party',
        FromDate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        ToDate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    }
    
    const [fields,setFields] = useState(initialFields);    
    const [parties,setParties] = useState([]);    
    const [loading,setLoading] = useState(false);    
    const [partyTitle,setPartyTitle] = useState('Select Party');
    const [rows,setRows] = useState([]);
    

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
                        delete parties[p].date
                        delete parties[p].current_Balance
                    }
                    setParties(parties);
                    localStorage.removeItem('Parties');
                    localStorage.setItem('Parties',JSON.stringify(parties));
                }
            })
            .catch(error=>{
                alert(`Somethin wrong: ${error}`);
            })
        }
        else{
            setParties(JSON.parse(localStorage.getItem('Parties')));
        }
    }
    
    async function fetchLedger(){
        if (navigator.onLine){
            return await axiosInstance.get(`apis/PartyLedger/${fields.party}/${fields.FromDate}/${fields.ToDate}`)
            .then(res=>{
                let data  = res.data;
                if (data['error'] === true){
                    alert(`Error Occures ${data['message']}`);
                    setRows(parties);
                }
                else{
                    let parties = data;
                    for (var p in parties){
                        parties[p].party = parties[p].party.name 
                        parties[p].sales_officer = parties[p].sales_officer.name
                    }
                    setRows(parties);
                    setLoading(false);
                    localStorage.removeItem('PartyLedger');
                    localStorage.setItem('PartyLedger',JSON.stringify(parties));
                }
            })
            .catch(error=>{
                setLoading(false);
                console.log(`${error}`);
            })
        }
        else{
            setRows(JSON.parse(localStorage.getItem('PartyLedger')));
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
        if (event.target.name === 'party'){
            const index = event.target.selectedIndex;
            const optionElement = event.target.childNodes[index];
            const optionElementId = optionElement.getAttribute('id');
            const obj = JSON.parse(optionElementId);
            setPartyTitle(obj.name);
        }
        setFields({
            ...fields,
            [event.target.name] : event.target.value,
        });
    };

    const selecterOpen = ()=>{

    }
    
    useEffect(() => {
        fetchParties()
    }, [])

    return (
        <>
        <Grid container alignItems="center" spacing={2}>
           {/* Title */}
           <Grid item xs={12} >     
                <Typography variant="h4" gutterBottom  color='primary'>Parties Ledger</Typography>
            </Grid>
            
           <Grid item  xs={12} md={1} >
                <Selecter
                     title={partyTitle}
                     handleChange={FiledChange}
                     value={fields.party}
                     onOpen={selecterOpen}
                     choises={parties}
                     name='party'
                />
           </Grid>
           
           <Grid item xs={4} md={2}>
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
          
           <Grid item xs={4} md={2}>
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
            
            <Grid item xs={12}>
                    <SpineerButton
                     handleButtonClick={handleButtonClick} 
                     label={(loading?'Loadning':'Get Data')}
                     loading={loading}
                     success={false}
                     size="large"
                     startIcon={(loading? <HourglassFullRoundedIcon/>:<StorageRoundedIcon />)}
                    />
            </Grid>
            <Grid item xs={8} md={12}>
            <TableContainer component={Paper} >
            <Table  aria-label="customized table" >
                <TableHead>
                <TableRow>
                    {columns.map((column) => (
                            <StyledTableCell
                                key={column}
                                align="center"
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
                        <StyledTableCell align='center' >{row.freight}</StyledTableCell>
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
            </Grid>
       </Grid>
    {/* TAble */}
   
    </>
    )
}
