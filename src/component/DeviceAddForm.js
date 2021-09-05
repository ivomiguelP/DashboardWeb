import Select from 'react-select';
import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert'
import deviceMgr from '../data/deviceMgr'

function DeviceAddForm (props){

    const [attributeOptions, setAttributeOptions] = useState([]);
    const [devID,setDevID] = useState("");
    const [devEUI,setDevEUI] = useState("");
    const [selectedAttributes, setSelectedAttributtes] = useState([]);
    const [registerResponse, registerResponseSet] = useState(null);
    const devEuiRegex = /^[0-9a-fA-F]+$/

    const devMgr = props.devMgr;
    const metricMgr = props.metricMgr;
    const userData = props.userData;

    const alert = useAlert();

    useEffect( ()=>{
        metricMgr.getAllMetrics(userData, (resp)=>{
            if(resp.success){
                const metricsName = [];
                resp.data.metrics.map( (option) =>{
                    metricsName.push({ value: option.metricName, label: option.metricName})
                    //setAttributeOptions( old => [...old, { value: option.metricName, label: option.metricName}])
                })
                setAttributeOptions(metricsName)
            }
        })
        // props.optionAttributes.map( (option) =>{
        //     setAttributeOptions( old => [...old, { value: option, label: option}])
        // })
    },[]);

    useEffect( () => {
        if(registerResponse){
            if(registerResponse.success){
                alert.success("Dispositivo Registado.");
                CloseForm();
            }
            else if(!registerResponse.success){ //REDO
                alert.error("Erro ao registar dispositivo" + registerResponse.msg)
            }
        }
    },[registerResponse])

    const devEUIChange=  event =>{
        if(event.target.value === '' || (devEuiRegex.test(event.target.value) && event.target.value.length < 17))
            setDevEUI(event.target.value.toUpperCase())
    }

    const devIDChange=  event =>{
        setDevID(event.target.value.toLowerCase())
    }

    const CloseForm = () =>{
        props.setShowForm(false);
    }

    const handleAttributes = (ev) =>{
        setSelectedAttributtes(ev.map(el => {return el.value}))
    }

    const Register = () =>{
        if(!devID){
            alert.error("É necessário indicar DevID");
        }
        devMgr.registerDevice(userData, devID, devEUI, selectedAttributes.map(el => el.replace(".","_")), registerResponseSet);        
    }


    return(
        <form>
            <div className="form-group">
                <label for="devIDinput">DevID</label>
                <input type="text" className="form-control" id="devIDinput" placeholder="DevID do dispositivo" value={devID} onChange={devIDChange}></input>
            </div>
            <div className="form-group">
                <label for="devEuiInput">DevEUI</label>
                <input type="text" className="form-control" id="devEuiInput" placeholder="DevEUI do dispositivo" value={devEUI} onChange={devEUIChange}></input>
            </div>
            <div className="form-group">
                <label for="attrInput">Atributos Opcionais</label>
                <Select
                        isMulti
                        placeholder="Adicione atributos"
                        name="Atributos opcionais"
                        options={attributeOptions}
                        onChange={handleAttributes}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        id="attrInput"
                    />
            </div>
            <div>             
                <button type="button" className="btn btn-secondary" onClick={CloseForm}>Cancelar</button>
                <button type="button" className="btn btn-dark" onClick={Register}>Registar</button>
            </div>
        </form>
    );
}

export default DeviceAddForm;