import { Button, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core'
import React, { useState } from 'react'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axiosInstance from '../../apisConfig';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
          margin: theme.spacing(1),
        },
      },
    input: {
        display: 'none',
      },
  }));

export default function Import() {
    const classes = useStyles();

    const [file,setFile] = useState('');
    const [fileTitle,setFileTitle] = useState('Party CSV');
    const [uploadingType,setUploadingType] = useState('Party CSV');
    const [open, setOpen] = React.useState(false);
    const HandleFileChange = (e)=>{
        setFile(e.target.files[0]);
        setFileTitle(e.target.files[0].name);
    }
    
    const  handleSave = async () =>{
        let form_data = new FormData();
        form_data.append('type',uploadingType);
        form_data.append('file',file);
        return await axiosInstance.post(`apis/ImportCSV/`,form_data)
        .then(res=>{
            let data  = res.data;
            if (data['error'] === true){
                alert(`Error Occures ${data['message']}`);
            }
            else{
                alert(`Saved`);
            }
        })
        .catch(error=>{
            alert(`Somethin wrong: ${error}`);
            
        })
    }
    return (
      <Grid container direction='column' spacing={2}>
        <Grid item>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-controlled-open-select-label">Type</InputLabel>
                    <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        open={open}
                        autoWidth
                        onClose={()=>setOpen(false)}
                        onOpen={()=>setOpen(true)}
                        value={uploadingType}
                        variant='outlined'
                        onChange={(e)=>setUploadingType(e.target.value)}
                        >
                    
                        <MenuItem value={'Party'}>Party</MenuItem>
                        <MenuItem value={'Discount'}>Discount</MenuItem>
                        <MenuItem value={'Category'}>Category</MenuItem>
                        <MenuItem value={'Bank'}>Bank</MenuItem>
                        <MenuItem value={'Product'}>Product</MenuItem>
                    </Select>
            </FormControl> 
        </Grid>
        <Grid item >
            <input
                accept="csv/*"
                className={classes.input}
                id="contained-button-file"
                name='partyfile'
                type="file"
                onChange={HandleFileChange}
            />
            <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary"  component="span" >
                    {fileTitle}
                </Button>
            </label>
        </Grid>
        <Grid item>
            <Button variant="contained" color="secondary" component="span" onClick={handleSave} endIcon={<CloudUploadIcon/>} >
                Save Parties
            </Button>
        </Grid>
    </Grid>
    )
}
