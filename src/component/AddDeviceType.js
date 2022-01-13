import { Button, TextField } from '@material-ui/core';
import Select from 'react-select';
import { useState, useEffect } from 'react';
import { useAlert } from 'react-alert'

function AddDeviceType({ metricMgr, userData }) {

    const [showForm, setShowForm] = useState(false);
    const [devTypeName, setDevTypeName] = useState("");
    const [selectedAttributes, setSelectedAttributtes] = useState([]);
    const [attributeOptions, setAttributeOptions] = useState([]);
    const [registerResponse, registerResponseSet] = useState(null);

    const alert = useAlert();

    const handleClick = (ev) => {
        setShowForm(prev => !prev);
    }

    const handleAttributes = (ev) =>{
        setSelectedAttributtes(ev.map(el => {return el.value}))
    }

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
    }, []);

    useEffect( () => {
        if(registerResponse){
            if(registerResponse.success){
                alert.success("Tipo Dispositivo Adicionado.");
                handleClick();
            }
            else if(!registerResponse.success){ //REDO
                alert.error("Erro ao Tipo Dispositivo" + registerResponse.msg)
            }
        }
    },[registerResponse])

    const Register = () =>{
        if(!devTypeName || devTypeName=== ''){
            alert.error("É necessário indicar Nome Tipo Dispositivo");
        }
        else if(selectedAttributes.length === 0){
            alert.error("É necessário selecionar atributos");
        }
        else{
            metricMgr.registerDevType(userData, devTypeName, selectedAttributes.map(el => el.replace(".","_")), registerResponseSet);  
        }     
    }

    return (
        <div>
            <Button aria-controls="device-menu" aria-haspopup="true" onClick={handleClick}>
                Adicionar Tipo Dispositivo
            </Button>
            {showForm &&
                <form id="new_metric_form">
                    <TextField
                        required
                        id="outlined_nome"
                        label="Nome Tipo Dispositivo"
                        variant="outlined"
                        value={devTypeName}
                        onChange={(ev) => {
                            setDevTypeName(ev.target.value)
                        }}
                    />
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
                        <button type="button" className="btn btn-secondary" onClick={handleClick}>Cancelar</button>
                        <button type="button" className="btn btn-dark" onClick={Register} >Adicionar</button>
                    </div>
                </form>
            }
        </div>

    );
}

export default AddDeviceType;