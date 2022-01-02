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
      
}))

const AddDispatchperson = () => {
    const initialFields = {
        name:'',
        username:'',
        email:'',
        password:'',
        repassword:'',
    };
    const classes = useStyles();
    const [rows,setRows] = useState([]);
    const [fields,setFields] = useState(initialFields);
    const [isUpdate,setIsUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedObjId, setSelectedObjId] = useState(0);


    async function fetchDispatcher(){
        if (navigator.onLine){
            return await axiosInstance.get('apis/Dispatcher/')
            .then(res=>{
                let data  = res.data;
                if (data['error'] === true){
                toast.error(`Error Occures ${data['message']}`);
                }
                else{
                    let d = data['data'];
                    for (var i in d){
                        delete d[i].password
                        d[i].last_login = new Date(d[i].last_login).toLocaleString()
                    }
                    setRows(d);
                }
            })
            .catch(error=>{
                toast.error(`Somethin wrong: ${error}`);
            })
        }
       
    }


    async function saveDispatcher(){
        if (!isUpdate){
            if (fields.password !== fields.repassword){
                toast.warning('Password Not Match');
                setLoading(false);
                return
            }
            return await axiosInstance.post('apis/Dispatcher/',{...fields})
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
                        setLoading(false);
                        fetchDispatcher();
                        setFields(initialFields);
                        // setFields(initialFields);
                    }
                })
                .catch(error=>{
                    toast.error(`Somethin wrong: ${error}`);
                    setSuccess(false);
                    setLoading(false);
                })
            }
        else{
            return await axiosInstance.put(`apis/SalesOfficer/${selectedObjId}/`,{...fields})
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
                        fetchDispatcher();
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
        return await axiosInstance.delete(`apis/Dispatcher/${selectedObjId}/`)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                toast.error(`Error Occures ${data['message']}`);
            }
            else{
                toast.info();
                fetchDispatcher();
                setFields(initialFields);
                setOpenDialog(false);
            }
        })
        .catch(error=>{
            toast.error(`Somethin wrong: ${error}`);
            setOpenDialog(false);
        })
        
    
    }

    async function GetDispatcherForUpdate(id){
        return await axiosInstance.get(`apis/Dispatcher/${id}/`)
        .then(res=>{
            let data  = res.data.data;
            if (data['error'] === true){
                toast.error(`Error Occures ${data['message']}`);
            }
            else{
                let setData = {
                    name:data.first_name,
                    email:data.email,
                    username:data.username
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
        saveDispatcher();
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
        GetDispatcherForUpdate(id);
    }

    const handleClose = () => {
        setOpenDialog(false);
    };
    
        
    useEffect(() => {
        fetchDispatcher();
        }, []);
    
    return (
        <Grid container spacing={2} className={classes.formRoot}>
            {/* Title */}
            <Grid item xs={11} >     
                <Typography variant="h4" gutterBottom  color='primary'>Add Dispatcher</Typography>
            </Grid>
            {/* Left */}
            <Grid item xs={1}>
                <Button onClick={fetchDispatcher}>
                    <CachedIcon ></CachedIcon>
                </Button>     
            </Grid>
            
            <Grid item xs={12} md={3} lg={3}>
                <Grid container item  spacing={3}>
                    <Grid item xs={12}>
                        <InputField  label='Name' type='string'  
                            name='name'
                            value={fields.name}
                            onChange={FiledChange}
                            autoFocus
                            fullWidth
                            inputProps={{ style: {textTransform: "uppercase" }}}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputField  label='Email @' type='string' 
                            name='email'
                            value={fields.email}
                            inputProps={{ style: {textTransform: "uppercase" }}}
                            onChange={FiledChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputField  label='User Name' type='string' 
                            name='username'
                            value={fields.username}
                            inputProps={{ style: {textTransform: "lowercase" }}}
                            onChange={FiledChange}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <InputField  label='Password' type='password'  
                            name='password'
                            disabled={isUpdate}
                            value={fields.password}
                            onChange={FiledChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputField  label='Confirm Password' type='password'  
                            name='repassword'
                            value={fields.repassword}
                            disabled={isUpdate}
                            onChange={FiledChange}
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
           <Grid item xs={12} md={9} lg={9} >
                <GetTable 
                    rows={rows} 
                    columns={['ID','Username','email','Name','Role','Last Login']}
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

export default AddDispatchperson;
