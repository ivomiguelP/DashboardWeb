import React, { useState, useEffect } from 'react';
import './App.css';
import Map from './component/Map'
import DeviceMenu from './component/DeviceMenu'
import DeviceAddForm from './component/DeviceAddForm'
import DeviceRemoveForm from './component/DeviceRemoveForm'
import DeviceList from './component/DeviceList'
import deviceMgr from './data/deviceMgr'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {

  // TODO mudar hardcoded para env.
  const managementApiOptions = {
    // VM ISEL IP 10.62.73.81
    // managementApiURI: "http://10.62.73.81:8080/api/",
    // orionURI:  "http://10.62.73.81:1026/v2/", 

    managementApiURI: "http://192.168.1.103:8080/api/",
    orionURI: "http://192.168.1.103:1026/v2/",
    sthHost: '192.168.1.103',
    sthPort: "8666",
    deviceType: "LoraDevice",
    fiwareService: "iotsensor",
    fiwareServicePath: "/"
  }

  const [isShowAddForm, setShowAddForm] = useState(false);
  const [isShowRemoveForm, setShowRemoveForm] = useState(false);
  const [isShowList, setShowList] = useState(false);

  const [activeDevices, setActiveDevices] = useState([]);
  const devMgr = new deviceMgr(managementApiOptions);

  const optionAttributes = ["temperature", "relativeHumidity", "PM2.5", "PM10"]

  const showAddForm = (show) => {
    setShowAddForm(show);
  }

  const showRemoveForm = (show) => {
    setShowRemoveForm(show);
  }

  const showList = (show) => {
    setShowList(show);
  }

  const [ranges, setRanges]=useState({
    'PM2.5': {
      1: 15,
      2: 30,
      3: 55,
      4: 110,
    }, 
    'PM10': {
      1: 25,
      2: 50,
      3: 90,
      4: 180
    }

  });

  useEffect(() => {
    const checkDevices = setInterval(() => {
      devMgr.listActiveDevices()
        .then(res => {
          if (res) {
            setActiveDevices(res);
          }

        })
        .catch(res => {
          console.log("Error");
        })
    }, 5000)
  }, [])

  return (
    <div className="App">
      <div id="device_menu">
        <DeviceMenu showAddForm={showAddForm} showRemoveForm={showRemoveForm} showList={showList} />
      </div>
      {isShowAddForm && <div className="device_form">
        <DeviceAddForm devMgr={devMgr} setShowForm={setShowAddForm} optionAttributes={optionAttributes} />
      </div>}
      {isShowRemoveForm && <div className="device_form">
        <DeviceRemoveForm devMgr={devMgr} setShowForm={setShowRemoveForm} />
      </div>}
      {isShowList && <div className="device_form">
        <DeviceList devMgr={devMgr} setShowList={setShowList} />
      </div>}
      <Map activeDevices={activeDevices} devMgr={devMgr} ranges={ranges} setRanges={setRanges}/>
    </div>
  );
}

export default App;
