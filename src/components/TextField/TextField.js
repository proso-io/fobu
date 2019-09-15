import React from 'react'

function TextField(props){
  return <>
    <label>
      {props.label}
      <input
        id={props.id}
        value={props.value}
        onChange={(e) => {props.onValueChange(e.target.value)}}
        />
    </label>
  </>
}

export default TextField;
