import PhoneInput2 from "react-phone-input-2";
import React from 'react'
import { Form } from 'react-bootstrap'
import { useState } from "react";

const PhoneInput = ({ value, name, setValue, defaultValue, register,rules,error }) => {
  const [local,setLocal] = useState("")
  if (setValue) { 
  //  console.log("SetValue Passed to phone input", setValue); 
    var x = 12;
  }
  else {
    if (window["scope"].setValue) {
  //    console.log("Hello man Setting from window.scope", window["scope"].setValue)
      setValue = window["scope"].setValue;
    }
  }
  const onChangeNew = (e) => {
    setValue(name, e)
    setLocal(e)
   // onChange(e);
  }
  return (
<>
    <PhoneInput2 inputStyle={{ padding: "6px" }}
      placeholder="Mobile No"
      name={name}
      country="in"
      {...register(name,{...rules})}
      
      defaultValue={value}
      value={value}
      countryCodeEditable={false}
      onChange={onChangeNew}
      error={error}
    />
          { error && <p style={{ color:"red",fontSize:"0.8rem"}}color="red">{error.message}</p> }    
</>

  )
}

export default PhoneInput