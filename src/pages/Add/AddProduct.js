import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import GetTable from '../../components/GetTable';
import CachedIcon from '@material-ui/icons/Cached';
import Selecter from '../../components/Selecter';
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

const useStyles = makeStyles((theme) => ({
      table:{
          width:'100vh',
          '@media only screen and (max-width: 600px)': {
              width:'100%',
          },
      },
}))

const AddProduct = () => {
    const initialFields = {
        name:'',
        type:'',
        pakage_weight:'',
        sales_price:'',
        cost_price:'',
        category:'',
        unit:'',
    };
    const classes = useStyles();
    const [rows,setRows] = useState([]);
    const [fields,setFields] = useState(initialFields);
    const [isUpdate,setIsUpdate] = useState(false);
    const [category, setCategory] = useState([]);
    const [categoryTitle, setCategoryTitle] = useState('Select Category');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedObjId, setSelectedObjId] = useState(0);

    const Reset = () =>{
        setFields(initialFields);
        setLoading(false);
        setSuccess(false);
        setIsUpdate(false);
        setCategoryTitle('Select Category');
        fetchProduct();
    }

    async function fetchCategory(){
        if (navigator.onLine){
            return await axiosInstance.get('apis/Category/')
            .then(res=>{
                let data  = res.data;
                if (data['error'] === true){
                alert(`Error Occures ${data['message']}`);
            }
            else{
                setCategory(data['data']);
                localStorage.removeItem('Category');
                localStorage.setItem('Category',JSON.stringify(data['data']));
            }
            })
            .catch(error=>{
                alert(`Somethin wrong: ${error}`);
            })
        }
        else{
            setCategory(JSON.parse(localStorage.getItem('Category')));
        }
    }

    async function fetchProduct(){
        if (navigator.onLine){
            return await axiosInstance.get('apis/Product/')
            .then(res=>{
                let data  = res.data;
                if (data['error'] === true){
                    alert(`Error Occures ${data['message']}`);
                }
                else{
                    let product = data['data'];
                    for (let p in product){
                        product[p].category = product[p].category.name;
                        delete product[p].date
                    }
                    setRows(product);
                    localStorage.removeItem('Product');
                    localStorage.setItem('Product',JSON.stringify(product));
                }
            })
            .catch(error=>{
                alert(`Somethin wrong: ${error}`);
            })
        }
        else{
            setRows(JSON.parse(localStorage.getItem('Parties')));
        }
    }

    async function saveProduct(){
        if (!isUpdate){
            return await axiosInstance.post('apis/Product/',{...fields})
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
                    setSuccess(true);
                })
            }
        else{
            return await axiosInstance.put(`apis/Product/${selectedObjId}/`,{...fields})
                .then(res=>{
                    let data  = res.data;
                    if (data['error'] === true){
                        alert(`Error Occures ${data['message']}`);
                        Reset();
                    }
                    else{
                       Reset();
                       setSuccess(true);
                    }
                })
                .catch(error=>{
                    alert(`Somethin wrong: ${error}`);
                    Reset();
                })
            }
    }

    async function ConfirmDelete(e){
        console.log(selectedObjId);
        return await axiosInstance.delete(`apis/Product/${selectedObjId}/`)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                alert(`Error Occures ${data['message']}`);
            }
            else{
                fetchProduct();
                setFields(initialFields);
                setOpenDialog(false);
            }
        })
        .catch(error=>{
            alert(`Somethin wrong: ${error}`);
            setOpenDialog(false);
        })
        
    
    }

    async function GetCategoryForUpdate(id = selectedObjId){
        return await axiosInstance.get(`apis/Product/${id}/`)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                alert(`Error Occures ${data['message']}`);
            }
            else{
                let setData = {
                    category:data.data.category.id,
                    type:data.data.type,
                    name:data.data.name,
                    unit:data.data.unit,
                    pakage_weight:data.data.pakage_weight,
                    sales_price:data.data.sales_price,
                    cost_price:data.data.cost_price,
                }
                setCategoryTitle(data.data.category.name);
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

    const selecterOpen = (event)=>{
        // fetchCategory();
        
    }

    const handleButtonClick = () => {
        if (!loading) {
        setSuccess(false);
        setLoading(true);
        saveProduct();
        }
    };

    const FiledChange = (event) => {
        if (event.target.name === 'category'){
            const index = event.target.selectedIndex;
            const optionElement = event.target.childNodes[index];
            const optionElementId = optionElement.getAttribute('id');
            const obj = JSON.parse(optionElementId);
            setCategoryTitle(obj.name);
        }
        setFields({
            ...fields,
            [event.target.name] : event.target.value,
        });
    };

    const onDelete = (event)=>{
        let id  = event.currentTarget.getAttribute('id');
        setSelectedObjId(id);
        setOpenDialog(true);
        fetchProduct();
    }

    const onUpdate = (event)=>{
        let id  = event.currentTarget.getAttribute('id');
        setSelectedObjId(id);
        setIsUpdate(true);
        GetCategoryForUpdate(id);
    }
    
    const handleClose = () => {
        setOpenDialog(false);
    };
    
        
    useEffect(() => {
            fetchProduct();
            fetchCategory();
        }, []);
    
    return (
        <Grid container spacing={2} className={classes.formRoot}>
            {/* Title */}
            <Grid item md={11} >     
                <Typography variant="h4" gutterBottom  color='primary'>Add Product</Typography>
            </Grid>
            {/* Left */}
            <Grid item md={1}>
                <Button onClick={fetchProduct}>
                    <CachedIcon ></CachedIcon>
                </Button>     
            </Grid>
            
            <Grid item xs={12} md={3} lg={3}>
                <Grid container item  spacing={3}>
                    <Grid item xs={12}>
                        <Selecter
                            title={categoryTitle}
                            handleChange={FiledChange}
                            value={fields.category}
                            onOpen={selecterOpen}
                            choises={category}
                            name='category'
                        />
                    </Grid>
                   
                    <Grid item xs={12}>
                        <FormControl  style={{minWidth:220}} color='primary'>
                            <InputLabel >Type</InputLabel>
                            <Select
                                labelId="Type"
                                name='type'
                                value={fields.type}
                                onChange={FiledChange}
                            >
                            <MenuItem value={'Pellet'}>Pellet</MenuItem>
                            <MenuItem value={'CRUMSS'}>CRUMSS</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <InputField  label='Name' size='small' 
                            name='name' type="string" fullWidth
                            required={true} 
                            value={fields.name}
                            onChange={FiledChange}
                            inputProps={{ style: {textTransform: "uppercase" }}}
                        />
                    </Grid>
                    
                    <Grid item xs={8}>
                        <InputField  label='Package Weight'  
                            size='small'
                            name='pakage_weight' type="number" 
                            value={fields.pakage_weight}
                            inputProps={{ style: {textTransform: "uppercase" }}}
                            onChange={FiledChange}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <InputField  label='Unit'  
                            size='small'
                            inputProps={{ style: {textTransform: "uppercase" }}}
                            name='unit' type="string" 
                            value={fields.unit}
                            onChange={FiledChange}
                        />
                    </Grid>
                    <Grid item container spacing={3}>
                        <Grid item xs>
                            <InputField  size='small' label="Sales Price"
                            type="number"
                            name='sales_price'
                            required={true}
                            value={fields.sales_price}
                            onChange={FiledChange}
                            />  
                        </Grid>
                        <Grid item xs>
                            <InputField  size='small' label="Cost Price"
                            type="number"
                            name='cost_price'
                            required={true}
                            value={fields.cost_price}
                            onChange={FiledChange}
                            />  
                        </Grid>
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
                    columns={['ID','Name','Type','Unit','Package','Sales Price','Cost Price','Category']}
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

export default AddProduct;
