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
    


const columns = ['Date','Description','Transaction Type','Total Amount','Net Balance']

export default function SalesOfficerLedger() {
    var date = new Date();
    const initialFields = {
        salesOfficer:'Select Officer',
        FromDate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        ToDate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    }
    
    const [fields,setFields] = useState(initialFields);    
    const [salesOfficers,setSalesOfficers] = useState([]);    
    const [salesOfficerTitle,setSalesOfficerTitle] = useState('Select Sales Officer');
    const [loading,setLoading] = useState(false);    
    const [rows,setRows] = useState([]);
    

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
                    setSalesOfficers(d);
                    localStorage.removeItem('SalesOfficer');
                    localStorage.setItem('SalesOfficer',JSON.stringify(d));
                }
            })
            .catch(error=>{
                alert(`Somethin wrong: ${error}`);
            })
        }
        else{
            setSalesOfficers(JSON.parse(localStorage.getItem('SalesOfficer')));
        }
    }
    
    async function fetchLedger(){
        if (navigator.onLine){
            return await axiosInstance.get(`apis/SalesOfficerLedger/${fields.salesOfficer}/${fields.FromDate}/${fields.ToDate}`)
            .then(res=>{
                let data  = res;
                if (data['error'] === true){
                    alert(`Error Occures ${data['message']}`);
                    setRows(data);
                }
                else{
                    let data = res.data;
                    for (var p in data){
                        data[p].sales_officer = data[p].sales_officer.name
                    }
                    setRows(data);
                    setLoading(false);
                    localStorage.removeItem('SalesOfficerLedger');
                    localStorage.setItem('SalesOfficerLedger',JSON.stringify(salesOfficers));
                }
            })
            .catch(error=>{
                setLoading(false);
                console.log(`${error}`);
            })
        }
        else{
            setRows(JSON.parse(localStorage.getItem('SalesOfficerLedger')));
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
        if (event.target.name === 'salesOfficer'){
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
    };

    const selecterOpen = ()=>{

    }
    
    
   
    useEffect(() => {
        fetchSalesOfficers()
    }, [])

    return (
        <Grid
            container
            alignItems="center"
            spacing={2}
        >
           {/* Title */}
           <Grid item xs={12} >     
                <Typography variant="h4" gutterBottom  color='primary'>Sales-Officer Ledger</Typography>
            </Grid>
            
           <Grid item  xs={12} md={2} >
                <Selecter
                     title={salesOfficerTitle}
                     handleChange={FiledChange}
                     value={fields.salesOfficer}
                     onOpen={selecterOpen}
                     choises={salesOfficers}
                     name='salesOfficer'
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
            
            <Grid item xs={12} md={2}>
                    <SpineerButton
                     handleButtonClick={handleButtonClick} 
                     label={(loading?'Loadning':'Get Data')}
                     loading={loading}
                     success={false}
                     size="large"
                     startIcon={(loading? <HourglassFullRoundedIcon/>:<StorageRoundedIcon />)}
                    />
            </Grid>
            {/* TAble */}
            <Grid item xs={9} md={12}>
                <TableContainer component={Paper}>
                        <Table aria-label="customized table">
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
                                    <StyledTableCell align='center' >{row.transaction_type}</StyledTableCell>
                                    <StyledTableCell align='center' >{row.total_amount}</StyledTableCell>
                                    <StyledTableCell align='center' >{row.net_balance}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                            </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
       </Grid>
    )
}
