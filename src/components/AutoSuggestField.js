import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';


export default function AutoSuggestField(props) {
    const { options, selectedOption, id, label, onChange,name,size=300,required=false,valueChange,value,fw=false,other } = props;
    return (
        <Autocomplete
            id={id}
            fullWidth={fw}
            options={options}
            getOptionLabel={selectedOption}
            onChange={valueChange}
            value={value}
            style={{ width: size }}
            size='small'
            {...other}
            renderInput={(params) => <TextField {...params} name={name} required={required}  onSelect={onChange} label={label} variant="outlined" />}
      />
    )
}
