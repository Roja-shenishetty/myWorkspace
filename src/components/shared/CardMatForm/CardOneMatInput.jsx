import React from 'react'
//import AceEditor from 'react-ace';
//import MyAceEditor from '../../MyAceEditor/MyAceEditor';
import Select from 'react-select';
const CardOneMatInput = ({ data, label = "comp", type = "text", fieldName, field, readonly, rows, enableLog }) => {

    if (enableLog) {
        console.log("Label,type,field,fieldName", label, type, field, fieldName)
    }
    if (type === 'textarea') {
        return (<div class="card-one-input border1s">
            <textarea rows={rows} class="card-one-input-field" disabled={readonly} {...field} />
            <label class="card-one-input-label">{label}</label>
        </div>)
    }
    else if (type === 'ace') {
        return (<>
            <div class="card-one-input">
                <label class="card-one-input-label">{label}</label>
                <br />
                {/* <MyAceEditor field={field} language={data?.language}></MyAceEditor> */}
                <br />
            </div>
        </>
        )/*@ionic/react  react-hook-form  axios react-bootstrap @babel/standalone  react-phone-input-2*/
    }
    else if (type === 'select') {
        return (<Select name="tags" className='classic'
            {...field}
            isMulti
            options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' }
            ]}
        />)
    }
    return (
        <div class="card-one-input">
            <input type={type} class="card-one-input-field" disabled={readonly} {...field} />
            <label class="card-one-input-label">{label}</label>
        </div>
    )
}

export default CardOneMatInput