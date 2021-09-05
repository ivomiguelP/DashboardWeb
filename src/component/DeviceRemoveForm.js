import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert'

function DeviceAddForm (props){

    const [devID,setDevID] = useState("");
    const [removeResponse, removeResponseSet] = useState(null);

    const devMgr = props.devMgr;
    const userData = props.userData;

    const alert = useAlert();

    useEffect( () => {
        if(removeResponse){
            if(removeResponse.success){ 
                alert.success("Dispositivo Removido.");
                CloseForm();
            }
            else if(!removeResponse.success){//REDO
                alert.error("Erro ao remover dispositivo" + removeResponse.msg)
            }
        }
    },[removeResponse])


    const devIDChange=  event =>{
        setDevID(event.target.value)
    }

    const CloseForm = () =>{
        props.setShowForm(false);
    }

    const Remove = () =>{
        if(!devID){
            alert.error("É necessário indicar DevID");
        }
        devMgr.unregisterDevice(userData, devID, removeResponseSet);        
    }


    return(
        <form>
            <div className="form-group">
                <label for="devIDinput">DevID</label>
                <input type="text" className="form-control" id="devIDinput" placeholder="DevID do dispositivo" onChange={devIDChange}></input>
            </div>
            <div>
                <button type="button" className="btn btn-secondary" onClick={CloseForm}>Cancelar</button>
                <button type="button" className="btn btn-dark" onClick={Remove}>Remover</button>
            </div>
        </form>
    );
}

export default DeviceAddForm;