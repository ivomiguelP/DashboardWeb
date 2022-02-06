import React, { useState, useEffect } from 'react';
import './App.css';
import Map from './component/Map';
import DeviceMenu from './component/DeviceMenu';
import MetricColorRangeUpdate from './component/MetricColorRangeUpdate'
import DeviceAddForm from './component/DeviceAddForm';
import DeviceRemoveForm from './component/DeviceRemoveForm';
import DeviceList from './component/DeviceList';
import deviceMgr from './data/deviceMgr';
import MetricMgr from './data/MetricMgr'
import UserMgr from './data/UserMgr'
import AddNewMetric from './component/AddNewMetric';
import AddDeviceType from './component/AddDeviceType';
import Login from './component/Login';
import { Button } from '@material-ui/core';
import managementApiConfigOptions from './config/default.json'

function App() {

  let managementApiOptions = {};
  //const managementApiOptions2 = config.get("managementApiOptions");
  if (process.env.NODE_ENV === "development") {
    managementApiOptions = managementApiConfigOptions
    console.log("In Development Mode.!!!");
    console.log(window._env_.MANAGEMENT_API_IP);
  }
  else {
    console.log("In Production Mode.!!!");
    managementApiOptions.appId = process.env.APP_ID || managementApiConfigOptions.appId
    managementApiOptions.appSecret = process.env.APP_SECRET || managementApiConfigOptions.appSecret
    managementApiOptions.appNameIDM = process.env.APP_NAME_IDM || managementApiConfigOptions.appNameIDM
    managementApiOptions.adminRoleName = process.env.ADMIN_ROLE_NAME || managementApiConfigOptions.adminRoleName
    managementApiOptions.managementApiIp = process.env.MANAGEMENT_API_IP || managementApiConfigOptions.managementApiIp
    managementApiOptions.managementApiPort = process.env.MANAGEMENT_API_PORT || managementApiConfigOptions.managementApiPort
    managementApiOptions.keyRockIp = process.env.KEYROCK_IP || managementApiConfigOptions.keyRockIp
    managementApiOptions.keyRockPort = process.env.KEYROCK_PORT || managementApiConfigOptions.keyRockPort
    managementApiOptions.orionIp = process.env.ORION_IP || managementApiConfigOptions.orionIp
    managementApiOptions.orionPort = process.env.ORION_PORT || managementApiConfigOptions.orionPort
    managementApiOptions.sthIp = process.env.STH_IP || managementApiConfigOptions.sthIp
    managementApiOptions.sthPort = process.env.STH_PORT || managementApiConfigOptions.sthPort
    managementApiOptions.deviceType = process.env.DEVICE_TYPE || managementApiConfigOptions.deviceType
    managementApiOptions.fiwareService = process.env.FIWARE_SERVICE || managementApiConfigOptions.fiwareService
    managementApiOptions.fiwareServicePath = process.env.FIWARE_SERVICE_PATH || managementApiConfigOptions.fiwareServicePath
    console.log(process.env.MANAGEMENT_API_IP);
  }


  const [isShowAddForm, setShowAddForm] = useState(false);
  const [isShowRemoveForm, setShowRemoveForm] = useState(false);
  const [isShowList, setShowList] = useState(false);
  const [userData, setUserData] = useState({});
  const [searching, setSearching] = useState(false);
  const [intervalSearchingID, setIntervalSearchingId] = useState();

  const [activeDevices, setActiveDevices] = useState([]);
  const devMgr = new deviceMgr(managementApiOptions);
  const metricMgr = new MetricMgr(managementApiOptions);
  const userMgr = new UserMgr(managementApiOptions);

  const showAddForm = (show) => {
    setShowAddForm(show);
  }

  const showRemoveForm = (show) => {
    setShowRemoveForm(show);
  }

  const showList = (show) => {
    setShowList(show);
  }

  const logout = () => {
    sessionStorage.removeItem('userData');
    clearInterval(intervalSearchingID);
    setIntervalSearchingId(undefined);
    setSearching(false);
    setUserData({});
  }

  const saveUserData = (key, value) => {
    setUserData(prev => {
      return { ...prev, [key]: value }
    });
    let data = userData;
    data[key] = value;
    sessionStorage.setItem('userData', JSON.stringify(data));
  }

  useEffect(() => {
    if (isEmpty(userData)) {
      let t = JSON.parse(sessionStorage.getItem('userData'));
      if (t) {
        setUserData(t);
      }
    }
  }, [])


  useEffect(() => {
    if (userData.token && !userData.id) {
      userMgr.getUserId(
        userData.token,
        (id) => {
          saveUserData('id', id);
        }
      )
    }
    if (userData.token && !userData.appId) {
      userMgr.getAppIdInIDM(
        userData.token,
        (appId) => {
          saveUserData('appId', appId);
        })
    }

    if (userData.token && userData.id && userData.appId && !userData.roleAdminId) {
      userMgr.getRoleAdminId(
        userData,
        (roleAdminId) => {
          saveUserData('roleAdminId', roleAdminId);
        }
      )
    }

    if (userData.token && userData.id && userData.appId && userData.roleAdminId && userData.isAdmin === undefined) {
      userMgr.isUserAdmin(
        userData,
        (isAdmin) => {
          saveUserData('isAdmin', isAdmin);
        }
      )
    }
    if (!searching && userData.accessToken) {
      const interId = setInterval(() => {
        devMgr.listActiveDevices(userData)
          .then(res => {
            if (res) {
              setActiveDevices(res);
            }

          })
          .catch(res => {
            console.log("Error");
          })
      }, 5000)
      setIntervalSearchingId(interId);
      setSearching(true);
    }
  }, [userData, searching]);

  return (
    <div>
      {userData.token &&
        <div className="App">
          <div id="device_menu">
            <DeviceMenu showAddForm={showAddForm} showRemoveForm={showRemoveForm} showList={showList} />
          </div>
          {userData.isAdmin &&
            <div>
              <div id='scale_button'>
                <MetricColorRangeUpdate metricMgr={metricMgr} userData={userData}></MetricColorRangeUpdate>
              </div>
              <div id='new_metric_button'>
                <AddNewMetric metricMgr={metricMgr} userData={userData}></AddNewMetric>
              </div>
              <div id='new_device_type_button'>
                <AddDeviceType metricMgr={metricMgr} userData={userData} />
              </div>
            </div>
          }
          {console.log(userData)}
          {isShowAddForm && <div className="device_form">
            <DeviceAddForm devMgr={devMgr} metricMgr={metricMgr} userData={userData} setShowForm={setShowAddForm} />
          </div>}
          {isShowRemoveForm && <div className="device_form">
            <DeviceRemoveForm devMgr={devMgr} userData={userData} setShowForm={setShowRemoveForm} />
          </div>}
          {isShowList && <div className="device_form">
            <DeviceList devMgr={devMgr} userData={userData} setShowList={setShowList} />
          </div>}
          <Button id='logout-button' variant="contained" color="primary" onClick={logout}>Logout</Button>
          <Map activeDevices={activeDevices} devMgr={devMgr} metricMgr={metricMgr} userData={userData} />

        </div>
      }
      {!userData.token && <Login userMgr={userMgr} setToken={(token) => saveUserData('token', token)} setAccessToken={(accessT) => saveUserData('accessToken', accessT)} />}
    </div>
  );
}

const isEmpty = (obj) => {
  return !(obj && Object.keys(obj).length === 0)
}

export default App;
