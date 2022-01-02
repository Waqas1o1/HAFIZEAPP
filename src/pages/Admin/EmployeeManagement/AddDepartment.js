import { Button,Grid, IconButton,Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../apisConfig';
import InputField from '../../../components/InputField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import { DataGrid } from '@material-ui/data-grid';
import SpineerButton from '../../../components/SpineerButton';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
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

const AddDepartment = () => {
    const initialFields = {
        name:'',
    };
    const classes = useStyles();
    const [rows,setRows] = useState([]);
    const [fields,setFields] = useState(initialFields);
    const [isUpdate,setIsUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedObj, setSelectedObj] = useState([]);


    async function fetchDepartment(){
        return await axiosInstance.get('apis/Department/')
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                toast.error(`Error Occures ${data['message']}`);
            }
            else{
                let Vehical = data['data'];
                setRows(Vehical);
            }
        })
        .catch(error=>{
            toast.error(`Somethin wrong: ${error}`);
        })
      
    }
  
    function Reset(){
        setFields(initialFields);
        setLoading(false);
        fetchDepartment();
        setIsUpdate(false);
    }

    async function saveDepartment(){
        if (!isUpdate){
            return await axiosInstance.post('apis/Department/',{...fields})
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
        else{
            return await axiosInstance.put(`apis/Department/${selectedObj.id}/`,{...fields})
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
        return await axiosInstance.delete(`apis/Department/${selectedObj.id}/`)
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

    async function GetDepartmentFroUpdate(id = selectedObj.id){
        return await axiosInstance.get(`apis/Department/${id}/`)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                alert(`Error Occures ${data['message']}`);
            }
            else{
                let setData = {
                    name:data.data.name,
                }
                setFields(setData);
                setIsUpdate(true);
            }
        })
        .catch(error=>{
            alert(`Somethin wrong: ${error}`);
            setLoading(false);
        })
    }
    const handleButtonClick = () => {
        if (!loading) {
            setLoading(true);
            saveDepartment();
        }
    };

    const FiledChange = (event) => {
        
        setFields({
            ...fields,
            [event.target.name] : event.target.value,
        });
    };
    const UpdateDept = (obj)=>{
        setSelectedObj(obj);
        GetDepartmentFroUpdate(obj.id);
    }
    const columns = [
        { field: 'id', headerName: 'Sr#' },
        { field: 'name', headerName: 'Dept Name #',flex:1},
        {field:'acion',headerName:'Action',width:200,
        headerAlign: 'center',
        editable: false,
        renderCell: (row)=>(
            <Grid container>
                <Grid item>
                    <IconButton  onClick={()=>{UpdateDept(row)}}>
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
    

    useEffect(() => {
        fetchDepartment();
        }, []);

   
    return (
        <Grid container spacing={2} className={classes.formRoot}>
            {/* Title */}
            <Grid item xs={10} lg={11}>     
                <Typography variant="h4" gutterBottom  color='primary'>Add Department</Typography>
            </Grid>
            {/* Left */}
            <Grid item xs={2} lg={1}>
                <Button onClick={fetchDepartment}>
                    <CachedIcon ></CachedIcon>
                </Button>     
            </Grid>
            
                {/* left */}
            <Grid item container xs={12} md={3}  >
                <Grid item xs={12}>
                    <InputField  label='Department Name' 
                        type='string' size='small' 
                        name='name'
                        fullWidth
                        required={true} 
                        value={fields.name}
                        onChange={FiledChange}
                        inputProps={{ style: {textTransform: "uppercase" }}}
                    />
                </Grid>
                <Grid item xs={12} >
                    <SpineerButton
                        handleButtonClick={handleButtonClick} 
                        label={(isUpdate?'Update':'Save')}
                        loading={loading}
                        success={false}
                        fw={true}
                        size="large"
                        startIcon={(isUpdate? <EditIcon/>:<AddBoxOutlinedIcon />)}
                    />
                </Grid>
            </Grid>
            {/* Right */}
            <Grid item xs={12} md={9}>
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

export default AddDepartment;
