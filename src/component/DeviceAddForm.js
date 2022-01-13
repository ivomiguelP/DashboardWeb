import Select from 'react-select';
import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert'

function DeviceAddForm(props) {

    const [attributeOptions, setAttributeOptions] = useState([]);
    const [devID, setDevID] = useState("");
    const [devEUI, setDevEUI] = useState("");
    const [registerResponse, registerResponseSet] = useState(null);
    const [devTypeOptions, setSevTypeOptions] = useState([]);
    const [listDevTypes, setListDevTypes] = useState([]);
    const [devTypeSelected, setDevTypeSelected]=useState(undefined)
    const [selectValues,setSelectValues] = useState([])
    //const [devTypeValue, setSelectedAttributtes] = useState([]);
    const devEuiRegex = /^[0-9a-fA-F]+$/

    const devMgr = props.devMgr;
    const metricMgr = props.metricMgr;
    const userData = props.userData;

    const alert = useAlert();

    useEffect(() => {
        metricMgr.getAllMetrics(userData, (resp) => {
            if (resp.success) {
                const metricsName = [];
                resp.data.metrics.map((option) => {
                    metricsName.push({ value: option.metricName, label: option.metricName })
                })
                setAttributeOptions(metricsName)
            }
        })
        metricMgr.getAllDevTypes(userData, (resp) =>{
            if (resp.success) {
                const devTypeNames = [];
                resp.data.devtypes.map((option) => {
                    devTypeNames.push({ value: option.devTypeName, label: option.devTypeName })
                })
                setSevTypeOptions(devTypeNames)
                setListDevTypes(resp.data.devtypes)
            }
        })
    }, []);

    useEffect(() => {
        if (registerResponse) {
            if (registerResponse.success) {
                alert.success("Dispositivo Registado.");
                CloseForm();
            }
            else if (!registerResponse.success) { //REDO
                alert.error("Erro ao registar dispositivo" + registerResponse.msg)
            }
        }
    }, [registerResponse])

    const devEUIChange = event => {
        if (event.target.value === '' || (devEuiRegex.test(event.target.value) && event.target.value.length < 17))
            setDevEUI(event.target.value.toUpperCase())
    }

    const devIDChange = event => {
        setDevID(event.target.value.toLowerCase())
    }

    const CloseForm = () => {
        props.setShowForm(false);
    }

    const handleAttributes = (ev) => {
        setSelectValues(ev)
        if(devTypeSelected){
            let type = listDevTypes.filter(v =>{ return v.devTypeName === devTypeSelected[0].value}).pop();
            let newMetrics = type.metrics.map(el =>{ return {value: el, label:el}})
            console.log(newMetrics)
            if(newMetrics.every((el => {return ev.find(x=> x.value === el.value)})))
            {
                
            }
            else{
                setDevTypeSelected(null);
            }
        }
        //setSelectedAttributtes(ev.map(el => { return el.value }))
    }
    
    const handleDevType = (ev) => {
        if(ev === null){
            setDevTypeSelected(null)
        }
        else{

            let type = listDevTypes.filter(v =>{ return v.devTypeName === ev.value}).pop();
            let newMetrics = type.metrics.map(el =>{ return {value: el, label:el}})
            let newArray = [...selectValues];
            newMetrics.forEach( el =>{
                if(newArray.find(x=> x.value === el.value)){                   
                }
                else{
                    newArray.push(el)
                }
            })
            setSelectValues([...newArray])
            setDevTypeSelected([ev])
        }        
    }

    const Register = () => {
        if (!devID || devID === '') {
            alert.error("É necessário indicar DevID");
        }
        else {
            devMgr.registerDevice(userData, devID, devEUI, selectValues.map(e =>{return e.value}).map(el => el.replace(".", "_")), registerResponseSet);
        }
    }


    return (
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
                <label for="attrInput">Tipo Dispositivo</label>
                <Select
                isClearable
                    value={devTypeSelected}
                    placeholder="opcional"
                    name="Tipo Dispositivo"
                    options={devTypeOptions}
                    onChange={handleDevType}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    id="attrInput"
                />
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
                    value={selectValues}
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