import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import GetTable from '../../components/GetTable';
import CachedIcon from '@material-ui/icons/Cached';
import axiosInstance from '../../apisConfig';
import InputField from '../../components/InputField';
import SpineerButton from '../../components/SpineerButton';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
    formRoot: {
        marginRight:theme.spacing(-8)
      },
      table:{
          width:'100vh',
          '@media only screen and (max-width: 600px)': {
              width:'100%',
          },
      },
}))

const AddBank = () => {
    const initialFields = {
        name:'',
        account_no:0,
        opening_Balance:'',
    
    };
    const classes = useStyles();
    const [rows,setRows] = useState([]);
    const [fields,setFields] = useState(initialFields);
    const [isUpdate,setIsUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedObjId, setSelectedObjId] = useState(0);


    async function fetchBank(){
        if (navigator.onLine){
            return await axiosInstance.get('apis/Bank/')
            .then(res=>{
                let data  = res.data;
                if (data['error'] === true){
                    toast.error(`Error Occures ${data['message']}`);
                }
                else{
                    let bank = data['data'];
                    for (let b in bank){
                        delete bank[b].date
                        delete bank[b].current_Balance
                    }
                    setRows(bank);
                    localStorage.removeItem('Bank');
                    localStorage.setItem('Bank',JSON.stringify(bank));
                }
            })
            .catch(error=>{
                toast.error(`Somethin wrong: ${error}`);
            })
        }
        else{
            setRows(JSON.parse(localStorage.getItem('Parties')));
        }
    }

    async function saveBank(){
        if (!isUpdate){
            return await axiosInstance.post('apis/Bank/',{...fields})
                .then(res=>{
                    let data  = res.data;
                    if (data['error'] === true){
                        let errors = data['message'];
                        for (let err in errors){
                            toast.info(`${err}->${errors[err]}`);
                       }
                       setLoading(false);
                    }
                    else{
                        toast.success(data['message']);
                        setLoading(false);
                        fetchBank();
                        setFields(initialFields);
                    }
                })
                .catch(error=>{
                    toast.error(`Somethin wrong: ${error}`);
                    setSuccess(false);
                    setLoading(false);
                })
            }
        else{
            return await axiosInstance.put(`apis/Bank/${selectedObjId}/`,{...fields})
                .then(res=>{
                    let data  = res.data;
                    if (data['error'] === true){
                        let errors = data['message'];
                        for (let err in errors){
                            toast.info(`${err}->${errors[err]}`);
                       }
                       setLoading(false);
                    }
                    else{
                        toast.success(data['message']);
                        fetchBank();
                        setFields(initialFields);
                        setLoading(false);
                        setIsUpdate(false);
                    }
                })
                .catch(error=>{
                    toast.error(`Somethin wrong: ${error}`);
                    setSuccess(false);
                    setLoading(false);
                })
            }
    }

    async function ConfirmDelete(e){
        return await axiosInstance.delete(`apis/Bank/${selectedObjId}/`)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                toast.error(`Error Occures ${data['message']}`);
            }
            else{
                toast.info('Successfuly Deleted')
                fetchBank();
                setFields(initialFields);
                setOpenDialog(false);
            }
        })
        .catch(error=>{
            toast.error(`Somethin wrong: ${error}`);
            setOpenDialog(false);
        })
        
    
    }

    async function GetBankForUpdate(){
        return await axiosInstance.get(`apis/Bank/${selectedObjId}/`)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                toast.error(`Error Occures ${data['message']}`);
            }
            else{
                let setData = {
                    name:data.data.name,
                    account_no:data.data.account_no,
                    opening_Balance:data.data.opening_Balance,
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
        saveBank();
        }
    };

    const FiledChange = (event) => {
        setFields({
            ...fields,
            [event.target.name] : event.target.value,
        });
    };

    const onDelete = (event)=>{
        let id  = event.currentTarget.getAttribute('id');
        setSelectedObjId(id);
        setOpenDialog(true);
    }

    const onUpdate = (event)=>{
        let id  = event.currentTarget.getAttribute('id');
        setSelectedObjId(id);
        setIsUpdate(true);
        GetBankForUpdate();
    }
    const handleClose = () => {
        setOpenDialog(false);
    };
    
        
    useEffect(() => {
            fetchBank();
        }, []);
    
    return (
        <Grid container spacing={2} className={classes.formRoot}>
            {/* Title */}
            <Grid item xs={10} md={11} >     
                <Typography variant="h4" gutterBottom  color='primary'>Add Bank</Typography>
            </Grid>
            {/* Left */}
            <Grid item xs={1} >
                <Button onClick={fetchBank}>
                    <CachedIcon ></CachedIcon>
                </Button>     
            </Grid>
            
            <Grid item xs={12} md={3} lg={3}>
                <Grid container item direction='column' spacing={3}>
                    <Grid item xs>
                        <InputField  label='Name' tyep='string' size='small' 
                        name='name' type="string" 
                        required={true} 
                        value={fields.name}
                        onChange={FiledChange}
                        inputProps={{ style: {textTransform: "uppercase" }}}
                        autoFocus
                        />
                    </Grid>
                    <Grid item xs>
                        <InputField  size='small' label="Account #"
                        type="string"
                        name='account_no'
                        inputProps={{ style: {textTransform: "uppercase" }}}
                        required={true}
                        value={fields.account_no}
                        onChange={FiledChange}
                        />  
                    </Grid>
                    <Grid item xs>
                        <InputField  size='small' label="Opening Balance" 
                        type="number" required={true}
                        onChange={FiledChange} 
                        name='opening_Balance'
                        value={(isUpdate?0:fields.opening_Balance)}
                        disabled={(isUpdate? true:false)}
                        />
                    </Grid>
                
                    <Grid item container  >
                        <SpineerButton
                        handleButtonClick={handleButtonClick} 
                        label={(isUpdate?'Update':'Save')}
                        loading={loading}
                        success={success}
                        size="large"
                        startIcon={(isUpdate? <EditIcon/>:<AddBoxOutlinedIcon />)}
                        />
                    </Grid>
                </Grid>
           </Grid>
            {/* Right */}
           <Grid item xs={12} md={9} lg={9} className={classes.table}>
                <GetTable 
                    rows={rows} 
                    columns={['ID','Name','Account #','Opening Balance']}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
           </Grid>
        
        {/* // Model */}
            <Dialog
                    open={openDialog}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure want to Delete {selectedObjId}
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

export default AddBank;
