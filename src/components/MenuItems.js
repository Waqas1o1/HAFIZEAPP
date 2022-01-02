import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function MenuItems(props) {
    const {title,options,handleChange,selectedOption,disabled=false,other} = props; 
    const classes = useStyles();
 
  const [open, setOpen] = React.useState(false);


  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      
      <FormControl className={classes.formControl} fullWidth>
        <InputLabel id="method">{title}</InputLabel>
        <Select
          id="Selecter"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={selectedOption}
          onChange={handleChange}
          disabled={disabled}
          {...other}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {options.map((option)=>(     
              <MenuItem value={option} key={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
