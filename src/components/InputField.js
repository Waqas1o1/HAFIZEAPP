import { TextField } from '@material-ui/core';
import React from 'react';

const InputField = (props) => {
    const {size='small',name,label='',type,required=false,...other} = props;
    return (
        <div>
            <TextField size={size} name={name}  
                        label={label} type={type} 
                        variant="outlined" 
                        required={required} 
                        {...other}/>
        </div>
    );
}

export default InputField;
