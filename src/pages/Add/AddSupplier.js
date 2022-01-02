import { Button, Checkbox, FormControlLabel, Grid, IconButton,Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../apisConfig';
import InputField from '../../components/InputField';
import SpineerButton from '../../components/SpineerButton';
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

const AddSupplier = () => {
    const initialFields = {
        name:'',
        email:'',
        creditLimit:'',
        account_no:'',
        contact:'',
        opening_Balance:'',
        ref_id:'',
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


    async function fetchSuppiler(){
        return await axiosInstance.get('apis/Suppliers/')
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                alert(`Error Occures ${data['message']}`);
            }
            else{
                let Suppiler = data['data'];
                setRows(Suppiler);
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
        fetchSuppiler();
        setIsUpdate(false);
    }

    async function saveSupplier(){
        if (!isUpdate){
            return await axiosInstance.post('apis/Suppliers/',{...fields})
                .then(res=>{
                    let data  = res.data;
                    if (data['error'] === true){
                        let errors = data['error'];
                        for (let error in errors){
                            toast.error(`${error} - ${errors[error]}`)
                        }
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
        else{
            return await axiosInstance.put(`apis/Suppliers/${selectedObj.id}/`,{...fields})
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
        return await axiosInstance.delete(`apis/Suppliers/${selectedObj.id}/`)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                alert(`Error Occures ${data['message']}`);
            }
            else{
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

    async function GetSuppliersForUpdate(id = selectedObj.id){
        return await axiosInstance.get(`apis/Suppliers/${id}/`)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                alert(`Error Occures ${data['message']}`);
            }
            else{
                let setData = {
                    creditLimit:data.data.creditLimit,
                    name:data.data.name,
                    ref_id:data.data.ref_id,
                    email:data.data.email,
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
            alert(`Somethin wrong: ${error}`);
            setSuccess(false);
            setLoading(false);
        })
    }
    const handleButtonClick = () => {
        if (!loading) {
            setSuccess(false);
            setLoading(true);
            saveSupplier();
        }
    };

    const FiledChange = (event) => {
        
        setFields({
            ...fields,
            [event.target.name] : event.target.value,
        });
    };
    const UpdateSuppiler = (obj)=>{
        setSelectedObj(obj);
        GetSuppliersForUpdate(obj.id);
    }
    const columns = [
        { field: 'id', headerName: 'Sr#' },
        { field: 'ref_id', headerName: 'Id'},
        { field: 'account_no', headerName: 'Account #',width:140 },
        // info
        {field: 'name',headerName: 'Name',width:120},
        {field: 'contact',headerName: 'Contact #',width:150},
        {field: 'email',headerName: 'Email',width:200},
        {field: 'hide',headerName: 'Hiden',width:120},
        // Attachments
        {field: 'creditLimit',headerName: 'Credit Limit',width:200},
        {field: 'opening_Balance',headerName: 'Opening Balance',width:200},
       
        {field:'acion',headerName:'Action',width:200,
        headerAlign: 'center',
        editable: false,
        renderCell: (row)=>(
            <Grid container>
                <Grid item>
                    <IconButton  onClick={()=>{UpdateSuppiler(row)}}>
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
        fetchSuppiler();
        }, []);

   
    return (
        <Grid container spacing={2} className={classes.formRoot}>
            {/* Title */}
            <Grid item xs={10} lg={11}>     
                <Typography variant="h4" gutterBottom  color='primary'>Add Suppiler</Typography>
            </Grid>
            {/* Left */}
            <Grid item xs={2} lg={1}>
                <Button onClick={fetchSuppiler}>
                    <CachedIcon ></CachedIcon>
                </Button>     
            </Grid>
            
            <Grid item xs={12} md={3} lg={3}>
                {/* left */}
                <Grid container item  spacing={3}>
                    
                    <Grid item container spacing={3}>
                        <Grid item container spacing={3}>
                            <Grid item xs={6}>
                                <InputField  label='Credit Limit' 
                                    type='number' size='small' 
                                    name='creditLimit'
                                    required={true} 
                                    value={fields.creditLimit}
                                    onChange={FiledChange}
                                    />
                            </Grid>
                            
                            <Grid item xs={6}>
                                <InputField  label='Reference ID' 
                                    type='number' size='small' 
                                    name='ref_id'
                                    fullWidth
                                    required={true} 
                                    value={fields.ref_id}
                                    onChange={FiledChange}
                                    />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item container spacing={3}>
                        <Grid item xs={6}>
                            <InputField  label='Name' 
                                type='string' size='small' 
                                name='name'
                                required={true} 
                                value={fields.name}
                                onChange={FiledChange}
                                inputProps={{ style: {textTransform: "uppercase" }}}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <InputField  label='Email' type='email' size='small' 
                                name='email'
                                required={true} 
                                value={fields.email}
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
                    <Grid item xs>
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

export default AddSupplier;
