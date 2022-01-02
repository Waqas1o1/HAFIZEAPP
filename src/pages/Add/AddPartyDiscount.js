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

const AddPartyDiscount = () => {
    const initialFields = {
        name:'',
       discount:'0'
    };
    const classes = useStyles();
    const [rows,setRows] = useState([]);
    const [fields,setFields] = useState(initialFields);
    const [isUpdate,setIsUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedObjId, setSelectedObjId] = useState(0);


    async function fetchDiscounts(){
        if (navigator.onLine){
            return await axiosInstance.get('apis/DiscountCategory/')
            .then(res=>{
                let data  = res.data;
                if (data['error'] === true){
                alert(`Error Occures ${data['message']}`);
                }
                else{
                    let discounts = data['data'];
                    setRows(discounts);
                }
            })
            .catch(error=>{
                alert(`Somethin wrong: ${error}`);
            })
        }
       
    }


    async function saveDiscount(){
        if (!isUpdate){
            return await axiosInstance.post('apis/DiscountCategory/',{...fields})
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
                        fetchDiscounts();
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
            return await axiosInstance.put(`apis/DiscountCategory/${selectedObjId}/`,{...fields})
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
                        fetchDiscounts();
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
        return await axiosInstance.delete(`apis/DiscountCategory/${selectedObjId}/`)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                toast.error(`Error Occures ${data['message']}`);
            }
            else{
                toast.success(data['message']);
                fetchDiscounts();
                setFields(initialFields);
                setOpenDialog(false);
            }
        })
        .catch(error=>{
            toast.error(`Somethin wrong: ${error}`);
            setOpenDialog(false);
        })
        
    
    }

    async function GetDiscountForUpdate(id){
        return await axiosInstance.get(`apis/DiscountCategory/${id}/`)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                toast.error(`Error Occures ${data['message']}`);
            }
            else{
                let setData = {
                    name:data.data.name,
                    discount:data.data.discount,
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
        saveDiscount();
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
        GetDiscountForUpdate(id);
    }

    const handleClose = () => {
        setOpenDialog(false);
    };
    
        
    useEffect(() => {
            fetchDiscounts();
        }, []);
    
    return (
        <Grid container spacing={2} >
            {/* Title */}
            <Grid item md={11}>     
                <Typography variant="h4" gutterBottom  color='primary'>Add Discount Category</Typography>
            </Grid>
            {/* Left */}
            <Grid item md={1}>
                <Button onClick={fetchDiscounts}>
                    <CachedIcon ></CachedIcon>
                </Button>     
            </Grid>
            
            <Grid item xs={12} md={3} lg={3}>
                <Grid container item direction='column' spacing={3}>
                    <Grid item xs>
                        <InputField  label='Name' type='string' size='small' 
                            name='name'
                            value={fields.name}
                            onChange={FiledChange}
                            inputProps={{ style: {textTransform: "uppercase" }}}
                            autoFocus
                        />
                    </Grid>
            

                    <Grid item xs>
                        <InputField  label='Discount (%)' 
                        type='number' 
                        size='small' 
                        name='discount'   
                        value={fields.discount}
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
           <Grid item xs={12} md={9} lg={9} className={classes.table}>
                <GetTable 
                    rows={rows} 
                    columns={['ID','Name','Discount(%)']}
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

export default AddPartyDiscount;
