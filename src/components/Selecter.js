import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
  },
  textSize:{
    '& .MuiButton-label':{
        fontSize:'12px'
    }
}
}));

export default function Selecter(props) {
  const { title,handleChange,onOpen,value,choises,name,disabled=false, fw=false, other } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  


  const handleClickOpen = () => {
    setOpen(true);
    onOpen();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClickOpen} disabled={disabled} variant="contained" color="secondary" {...other} fullWidth={fw} className={classes.textSize}>{title}</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select From Following</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="demo-dialog-native">Select</InputLabel>
              <Select
                native
                value={value}
                onChange={handleChange}
                input={<Input id='Selecter' />}
                name={name}
                >
                <option aria-label="None" value='0' id='0' /> 
                {choises.map((item)=>{
                  return <option value={item.id} id={JSON.stringify(item)} key={item.id}>{item.name}</option>
                })}
              </Select>
            </FormControl>  
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
