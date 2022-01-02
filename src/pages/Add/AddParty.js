import { Button, Checkbox, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import Selecter from '../../components/Selecter';
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
import MenuItems from '../../components/MenuItems';     
import ToggleDays from '../../components/ToggleDays';
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

const AddParty = () => {
    const initialFields = {
        name:'',
        email:'',
        creditLimit:'',
        salesTarget:'',
        area:``,
        contact:'',
        opening_Balance:'',
        sale_officer:'',
        ref_id:'',
        active:true,
        hide:false,
        type:'Regular',
        recovery_days:[]
    };
    const classes = useStyles();
    const [rows,setRows] = useState([]);
    const [areas,setAreas] = useState([]);
    // const [areaTitle,setAreaTitle] = useState('Areas ?');
    const [areaBox,setAreaBox] = useState(false);
    const [fields,setFields] = useState(initialFields);
    const [isUpdate,setIsUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [salesOfficer, setSalesOfficers] = useState([]);
    const [salesOfficerTitle, setSalesOfficersTitle] = useState('S-Officer');
    const [selectedObj, setSelectedObj] = useState([]);

    
    async function fetchSalesOfficers(){
        if (navigator.onLine){
            return await axiosInstance.get('apis/SalesOfficer/')
            .then(res=>{
                let data  = res.data;
                if (data['error'] === true){
                    toast.error(`Error Occures ${data['message']}`);
                }
                else{
                    var d = data['data'];
                    for (let p in d){
                        delete d[p].date
                        delete d[p].current_Balance
                    }
                    setSalesOfficers(d);
                }
            })
            .catch(error=>{
                toast.error(`Somethin wrong: ${error}`);
            })
        }
        else{
            setSalesOfficers(JSON.parse(localStorage.getItem('SalesOfficer')));
        }
    }    

    async function fetchParties(){
        return await axiosInstance.get('apis/Party/')
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                toast.error(`Error Occures ${data['message']}`);
            }
            else{
                let parties = data['data'];
                for (let p in parties){
                    delete parties[p].current_Balance
                    parties[p].sale_officer = parties[p].sale_officer.name 
                    parties[p].area = parties[p].area.name 
                }
                setRows(parties);
            }
        })
        .catch(error=>{
            toast.error(`Somethin wrong: ${error}`);
        })
      
    }
    async function fetchAreas(){
        return await axiosInstance.get('apis/Areas/')
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                toast.error(`Error Occures ${data['message']}`);
            }
            else{
                setAreas(data.data);
            }
        })
        .catch(error=>{
            toast.error(`Somethin wrong: ${error}`);
        })
      
    }

    function Reset(){
        setSalesOfficersTitle('Select SalesOfficer');
        setFields(initialFields);
        setLoading(false);
        setSuccess(false);
        fetchParties();
        setIsUpdate(false);
    }

    async function saveParty(){
        if (!isUpdate){
            return await axiosInstance.post('apis/Party/',{...fields,recovery_days:days})
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
                        Reset();
                    }
                })
                .catch(error=>{
                    toast.error(`Somethin wrong: ${error}`);
                    Reset();
                })
            }
        else{
            return await axiosInstance.put(`apis/Party/${selectedObj.id}/`,{...fields,recovery_days:days})
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
                        Reset();
                    }
                })
                .catch(error=>{
                    toast.error(`Somethin wrong: ${error}`);
                    Reset();
                })
            }
    }

    async function ConfirmDelete(){
        return await axiosInstance.delete(`apis/Party/${selectedObj.id}/`)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                toast.error(`Error Occures ${data['message']}`);
            }
            else{
                toast.info(`SuccessFuly Seleted ${selectedObj.id}`)
                Reset();
                setOpenDialog(false);
            }
        })
        .catch(error=>{
            toast.error(`Somethin wrong: ${error}`);
            setOpenDialog(false);
            Reset();
        })
        
    
    }

    async function GetPartyForUpdate(id = selectedObj.id){
        return await axiosInstance.get(`apis/Party/${id}/`)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                toast.error(`Error Occures ${data['message']}`);
            }
            else{
                let setData = {
                    creditLimit:data.data.creditLimit,
                    salesTarget:data.data.salesTarget,
                    sale_officer:data.data.sale_officer.id,
                    name:data.data.name,
                    ref_id:data.data.ref_id,
                    email:data.data.email,
                    area:data.data.area.id,
                    contact:data.data.contact,
                    opening_Balance:data.data.opening_Balance,
                    type:data.data.type,
                    hide:data.data.hide,   
                    active:data.data.active,   
                }
                setDays(data.data.recovery_days);
                setFields(setData);
                setSalesOfficersTitle(data.data.sale_officer.name);
                setIsUpdate(true);
            }
        })
        .catch(error=>{
            toast.error(`Somethin wrong: ${error}`);
            setSuccess(false);
            setLoading(false);
        })
    }
    const handleButtonClick = (e) => {
        e.preventDefault();
        if (!loading) {
            setSuccess(false);
            setLoading(true);
            saveParty();
        }
    };

    const FiledChange = (event) => {
        if (event.target.name === 'sale_officer'){
            const index = event.target.selectedIndex;
            const optionElement = event.target.childNodes[index];
            const optionElementId = optionElement.getAttribute('id');
            const obj = JSON.parse(optionElementId);
            setSalesOfficersTitle(obj.name);
        }
        
        
        setFields({
            ...fields,
            [event.target.name] : event.target.value,
        });
    };
    const UpdateParty = (obj)=>{
        setSelectedObj(obj);
        GetPartyForUpdate(obj.id);
    }
    const columns = [
        { field: 'id', headerName: 'Sr#' },
        { field: 'ref_id', headerName: 'Id'},
        // info
        {field: 'name',headerName: 'Name',width:120},
        {field: 'contact',headerName: 'Contact #',width:150},
        {field: 'email',headerName: 'Email',width:200},
        {field: 'type',headerName: 'Type',width:110},
        {field: 'hide',headerName: 'Hiden',width:120},
        // Attachments
        {field: 'sale_officer',headerName: 'Sales Officer',width:200},
        {field: 'salesTarget',headerName: 'Sales Target',width:200},
        {field: 'creditLimit',headerName: 'Credit Limit',width:200},
        {field: 'opening_Balance',headerName: 'Opening Balance',width:200},
        {field: 'recovery_days',headerName: 'R Days',
        renderCell: (row)=>(`${row.value}`)
        },
        {field:'acion',headerName:'Action',width:200,
        headerAlign: 'center',
        editable: false,
        renderCell: (row)=>(
            <Grid container>
                <Grid item>
                    <IconButton  onClick={()=>{UpdateParty(row)}}>
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
    const handleAreaClose = () => {
        setAreaBox(false);
    };
    const handleAreaOpen = () => {
        setAreaBox(true);
    };
    
    const handleCheckBoxChange = (event) => {
        setFields({ ...fields, [event.target.name]: event.target.checked });
    };
    
    const [days, setDays] = useState();

    useEffect(() => {
        fetchParties();
        fetchAreas();
        }, []);

   
    return (
        <Grid container spacing={2} className={classes.formRoot}>
            {/* Title */}
            <Grid item xs={10} lg={11}>     
                <Typography variant="h4" gutterBottom  color='primary'>Add Party</Typography>
            </Grid>
            {/* Left */}
            <Grid item xs={2} lg={1}>
                <Button onClick={fetchParties}>
                    <CachedIcon ></CachedIcon>
                </Button>     
            </Grid>
            
            <Grid item xs={12} md={3} lg={3}>
                {/* left */}
              <form onSubmit={handleButtonClick} style={{display:'contents'}}>
                <Grid container item  spacing={3}>
                    <Grid item xs>
                        <Selecter
                            title={salesOfficerTitle}
                            handleChange={FiledChange}
                            value={fields.sale_officer}
                            onOpen={fetchSalesOfficers}
                            choises={salesOfficer}
                            name='sale_officer'
                            fw={true}
                        />
                    </Grid>
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
                            <InputField  label='Sales Target' 
                                type='number' size='small' 
                                name='salesTarget'
                                required={true} 
                                value={fields.salesTarget}
                                onChange={FiledChange}
                                />
                        </Grid>
                        <Grid item xs={12}>
                            <InputField  label='Reference ID' 
                                type='number' size='small' 
                                name='ref_id'
                                fullWidth
                                value={fields.ref_id}
                                onChange={FiledChange}
                                />
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
                        <InputField  size='small' label="Contact"
                        type="string"
                        name='contact'
                        fullWidth
                        required={true} 
                        value={fields.contact}
                        onChange={FiledChange}
                        />  
                    </Grid>
                    <Grid item container spacing={3}>
                        <Grid item xs={12}  md={6} >
                            <MenuItems
                                title={fields.type}
                                required={true} 
                                options={['Regular','Defaulter','Nil']}
                                handleChange={(e)=>{setFields({...fields,type:e.target.value})}}
                                selectedOption={fields.type}
                            />
                        </Grid>   
                        <Grid item xs={12} md={6}>
                            <FormControl  fullWidth style={{margin:'7px'}} required>
                                <InputLabel id="method">Area</InputLabel>
                                <Select
                                    required
                                    open={areaBox}
                                    onClose={handleAreaClose}
                                    onOpen={handleAreaOpen}
                                    value={fields.area}
                                    name='area'
                                    onChange={FiledChange}
                                >
                                
                                {areas.map((a)=>(     
                                    <MenuItem value={a.id} key={a.id}>{a.name}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Grid>             
                    </Grid>     
                    <Grid item >
                        <Typography variant='body2'>Recovery Days</Typography>
                        <ToggleDays days={days} setDays={setDays} />
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
                            type="submit"
                            label={(isUpdate?'Update':'Save')}
                            loading={loading}
                            success={success}
                            fw={true}
                            size="large"
                            startIcon={(isUpdate? <EditIcon/>:<AddBoxOutlinedIcon />)}
                        />
                    </Grid>
                </Grid>
              </form>
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

export default AddParty;
