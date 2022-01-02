import { Button, Checkbox, FormControlLabel, Grid, IconButton,Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../apisConfig';
import InputField from '../../../components/InputField';
import SpineerButton from '../../../components/SpineerButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import { DataGrid } from '@material-ui/data-grid';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
    formRoot:{
        marginRight:theme.spacing(-8)
    },
    table:{
        width:'100vh',
        '@media only screen and (max-width: 600px)': {
            width:'100%',
        },
    },
    dataGrid:{
        '& .MuiDataGrid-columnsContainer':{
            backgroundColor: theme.palette.primary.dark
        }
    },
   
    
}));

const AddVehical = () => {
    const initialFields = {
        driver_name:'',
        account_no:'',
        vehical_no:'',
        contact:'',
        cnic:'',
        running:'',
        running_limit:'',
        opening_Balance:'',
        active:true,
        hide:false,
    };
    const classes = useStyles();
    const [rows,setRows] = useState([]);
    const [fields,setFields] = useState(initialFields);
    const [isUpdate,setIsUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedObj, setSelectedObj] = useState([]);


    async function fetchVehicals(){
        return await axiosInstance.get('apis/Vehicals/')
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                alert(`Error Occures ${data['message']}`);
            }
            else{
                let Vehical = data['data'];
                setRows(Vehical);
            }
        })
        .catch(error=>{
            alert(`Somethin wrong: ${error}`);
        })
      
    }
  
    function Reset(){
        setFields(initialFields);
        setLoading(false);
        setSuccess(false);
        fetchVehicals();
        setIsUpdate(false);
    }

    async function saveParty(){
        if (!isUpdate){
            return await axiosInstance.post('apis/Vehicals/',{...fields})
                .then(res=>{
                    let data  = res.data;
                    if (data['error'] === true){
                        let errors = data['error'];
                        for(let error in errors){
                            toast.error(errors[error]);
                        }
                    }
                    else{
                        Reset();
                    }
                })
                .catch(error=>{
                    toast.error(`Somethin wrong: ${error}`);
                    Reset();
                })
            }
        else{
            return await axiosInstance.put(`apis/Vehicals/${selectedObj.id}/`,{...fields})
                .then(res=>{
                    let data  = res.data;
                    if (data['error'] === true){
                        alert(`Error Occures ${data['message']}`);
                        Reset();
                    }
                    else{
                        Reset();
                    }
                })
                .catch(error=>{
                    alert(`Somethin wrong: ${error}`);
                    Reset();
                })
            }
    }

    async function ConfirmDelete(){
        return await axiosInstance.delete(`apis/Vehicals/${selectedObj.id}/`)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                toast.error(`Error Occures ${data['message']}`);
            }
            else{
                toast.info(data['message']);
                Reset();
                setOpenDialog(false);
            }
        })
        .catch(error=>{
            alert(`Somethin wrong: ${error}`);
            setOpenDialog(false);
            Reset();
        })
        
    
    }

    async function GetVehicalsForUpdate(id = selectedObj.id){
        return await axiosInstance.get(`apis/Vehicals/${id}/`)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                toast.error(`Error Occures ${data['message']}`);
            }
            else{
                let setData = {
                    driver_name:data.data.driver_name,
                    cnic:data.data.cnic,
                    running:data.data.running,
                    running_limit:data.data.running_limit,
                    vehical_no:data.data.vehical_no,
                    account_no:data.data.account_no,
                    contact:data.data.contact,
                    opening_Balance:data.data.opening_Balance,
                    hide:data.data.hide,   
                    active:data.data.active,   
                }
                setFields(setData);
                setIsUpdate(true);
            }
        })
        .catch(error=>{
            toast.error(`Somethin wrong: ${error}`);
            setSuccess(false);
            setLoading(false);
        })
    }
    const handleButtonClick = () => {
        if (!loading) {
            setSuccess(false);
            setLoading(true);
            saveParty();
        }
    };

    const FiledChange = (event) => {
        
        setFields({
            ...fields,
            [event.target.name] : event.target.value,
        });
    };
    const UpdateVehicals = (obj)=>{
        setSelectedObj(obj);
        GetVehicalsForUpdate(obj.id);
    }
    const columns = [
        { field: 'id', headerName: 'Sr#' },
        { field: 'driver_name', headerName: 'Driver Name #',width:150 },
        { field: 'account_no', headerName: 'Account #',width:140 },
        // info
        {field: 'driver_name',headerName: 'Name',width:120},
        {field: 'contact',headerName: 'Contact #',width:150},
        {field: 'cnic',headerName: 'CNIC',width:200},
        {field: 'hide',headerName: 'Hiden',width:120},
        {field: 'running',headerName: 'Running',width:200},
        {field: 'running_limit',headerName: 'Running Limit',width:200},
        {field: 'hide',headerName: 'Hiden',width:120},
        // Attachments
        {field: 'opening_Balance',headerName: 'Opening Balance',width:150},
       
        {field:'acion',headerName:'Action',width:200,
        headerAlign: 'center',
        editable: false,
        renderCell: (row)=>(
            <Grid container>
                <Grid item>
                    <IconButton  onClick={()=>{UpdateVehicals(row)}}>
                        <EditIcon color='primary'/>
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton  onClick={()=>{setSelectedObj(row);setOpenDialog(true)}}>
                        <DeleteIcon color='secondary'/>
                    </IconButton>
                </Grid>
            </Grid>
        )}
    ];
    const handleClose = () => {
        setOpenDialog(false);
    };
    
    
    const handleCheckBoxChange = (event) => {
        setFields({ ...fields, [event.target.name]: event.target.checked });
    };
    

    useEffect(() => {
        fetchVehicals();
        }, []);

   
    return (
        <Grid container spacing={2} className={classes.formRoot}>
            {/* Title */}
            <Grid item xs={10} lg={11}>     
                <Typography variant="h4" gutterBottom  color='primary'>Add Vehicals</Typography>
            </Grid>
            {/* Left */}
            <Grid item xs={2} lg={1}>
                <Button onClick={fetchVehicals}>
                    <CachedIcon ></CachedIcon>
                </Button>     
            </Grid>
            
            <Grid item xs={12} md={3} lg={3}>
                {/* left */}
                <Grid container item  spacing={3}>

                    <Grid item container spacing={3}>
                        <Grid item xs={6}>
                            <InputField  label='Driver Name' 
                                type='string' size='small' 
                                name='driver_name'
                                required={true} 
                                value={fields.driver_name}
                                onChange={FiledChange}
                                inputProps={{ style: {textTransform: "uppercase" }}}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <InputField  label='Vehical #' type='string' size='small' 
                                name='vehical_no'
                                required={true} 
                                value={fields.vehical_no}
                                onChange={FiledChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs>
                        <InputField  size='small' label="Account #"
                        type="string"
                        name='account_no'
                        fullWidth
                        value={fields.account_no}
                        onChange={FiledChange}
                        />  
                    </Grid>
                    <Grid item xs>
                        <InputField  size='small' label="Contact"
                        type="string"
                        name='contact'
                        fullWidth
                        value={fields.contact}
                        onChange={FiledChange}
                        />  
                    </Grid>
                       
                         
                    <Grid item container>
                        <Grid item>
                            <FormControlLabel
                                label="Hide Party?"
                                control={
                                <Checkbox
                                    checked={fields.hide}
                                    onChange={handleCheckBoxChange}
                                    name="hide"
                                    indeterminate
                                />
                                }
                                
                            />
                        </Grid>
                    
                        <Grid item>
                            <FormControlLabel
                                label="Is Active"
                                control={
                                <Checkbox
                                    checked={fields.active}
                                    onChange={handleCheckBoxChange}
                                    name="active"
                                />
                                }
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <InputField  size='small' label="Runing" 
                            type="number" 
                            required={true}
                            fullWidth
                            onChange={FiledChange}
                            name='running'
                            value={fields.running}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputField  size='small' label="Runing Limit" 
                            type="number" 
                            required={true}
                            fullWidth
                            onChange={FiledChange}
                            name='running_limit'
                            value={fields.running_limit}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputField  size='small' label="CNIC" 
                            type="string" 
                            required={true}
                            fullWidth
                            onChange={FiledChange}
                            name='cnic'
                            value={fields.cnic}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputField  size='small' label="Opening Balance" 
                            type="number" required={true}
                            onChange={FiledChange}
                            fullWidth
                            name='opening_Balance'
                            value={(isUpdate?0:fields.opening_Balance)}
                            disabled={(isUpdate? true:false)}
                        />
                    </Grid>
                  
                    <Grid item xs={12}  >
                        <SpineerButton
                            handleButtonClick={handleButtonClick} 
                            label={(isUpdate?'Update':'Save')}
                            loading={loading}
                            success={success}
                            fw={true}
                            size="large"
                            startIcon={(isUpdate? <EditIcon/>:<AddBoxOutlinedIcon />)}
                        />
                    </Grid>
                </Grid>
            </Grid>
            {/* Right */}
            <Grid item xs={12} md={9} lg={9} >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    className={classes.dataGrid}
                    autoPageSize
                    autoHeight
                    disableSelectionOnClick
                    loading={loading}
                />
            </Grid>
        
        {/* // Model */}
            <Dialog
                    open={openDialog}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">{"Are you Sure?"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure want to Delete {selectedObj.id}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="default" >
                        No
                    </Button>
                    <Button onClick={ConfirmDelete} color="secondary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}

export default AddVehical;
