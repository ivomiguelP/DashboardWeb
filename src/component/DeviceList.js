import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert'

export default function DeviceList(props){

    const [listResponse, listResponseSet] = useState(null);

    const alert = useAlert();

    const devMgr = props.devMgr;
    const userData = props.userData;

    useEffect( () =>{
        devMgr.listRegisteredDevices(userData, listResponseSet);
    },[]);

    useEffect( () => {
        if(listResponse){
            if(listResponse.success){ 

            }
            else if(!listResponse.success){//REDO
                alert.error("Erro ao listar dispositivos" + listResponse.msg)
            }
        }
    },[listResponse])

    const CloseList = () =>{
        props.setShowList(false);
    }

    return(
        <div>
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={CloseList} >X</button>
            <ul className="list-group list-devs">
                {listResponse && listResponse.success && listResponse.data.map( (dev) => 
                    <li className="list-group-item">{dev}</li>
                )}
                {//<li className="list-group-item">Cras justo odio</li>
                }
                
            </ul>
        </div>

    );
}