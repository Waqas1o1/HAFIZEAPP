import { Grid, Typography } from '@material-ui/core'
import React, { useState } from 'react'
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
    


const columns = ['Date','Description','Debit','Credit','Net Balance']

export default function SalesLedger() {
    var date = new Date();
    const initialFields = {
        FromDate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        ToDate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    }
    const [fields,setFields] = useState(initialFields);        
    const [loading,setLoading] = useState(false);    
    const [rows,setRows] = useState([]);
    


    async function fetchLedger(){
        if (navigator.onLine){
            return await axiosInstance.get(`apis/SalesLedger/${fields.FromDate}/${fields.ToDate}`)
            .then(res=>{
                let data  = res;
                if (data['error'] === true){
                    alert(`Error Occures ${data['message']}`);
                    setRows(data);
                }
                else{
                    let data = res.data;
                    setRows(data);
                    setLoading(false);
                    localStorage.removeItem('SalesLedger');
                }
            })
            .catch(error=>{
                setLoading(false);
                console.log(`${error}`);
            })
        }
        else{
            setRows(JSON.parse(localStorage.getItem('SalesLedger')));
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
        else{
            setLoading(false);
        }
    }
    
    
    return (
        <Grid
            container
            alignItems="center"
            spacing={2}
        >
           {/* Title */}
           <Grid item xs={12} >     
                <Typography variant="h4" gutterBottom  color='primary'>Sales Ledger</Typography>
            </Grid>
            
           
           <Grid item xs={5} md={2}>
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
          
           <Grid item xs={5} md={2}>
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
            
            <Grid item >
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
            <Grid item xs={10} md={12}>
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
    )
}
