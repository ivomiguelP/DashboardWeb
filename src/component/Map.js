import './HeatMap.css';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useState } from 'react';
import CalHeatmap from './CalendarHeatMap';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function Map({ activeDevices, devMgr, ranges }) {
    
    const [devReadings, setDevReadings] = useState({})

    useEffect(() => {
        if (activeDevices) {
            const dateNow = new Date();
            let dateBegin = new Date();
            dateBegin.setMonth(dateBegin.getMonth() - 1);
            activeDevices.forEach(el => {
                const keys = Object.keys(el);
                keys.forEach(elK => {
                    if (el[elK].type && el[elK].type === 'Number') {
                        devMgr.GetLastMonthMaxReadings(el.id, elK, dateBegin, dateNow, 'day', 'max')
                            .then(resp => {
                                if (resp && Object.keys(resp).length > 0 && resp.constructor === Object) {
                                    const devId = el.id;
                                    const attributeKey = elK;
                                    const values = resp
                                    setDevReadings(prev => {
                                        return {
                                            ...prev, [devId]: {
                                                ...prev[devId],
                                                [attributeKey]: {
                                                    values
                                                }
                                            }
                                        }
                                    });
                                }
                            })
                    }
                })
            });
        }

    }, [activeDevices]);


    let red_marker = L.icon({
        iconUrl: 'red_marker.png'
    });

    let gren_marker = L.icon({
        iconUrl: 'green-marker.png'
    });

    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <MapContainer center={[38.755822873105416, -9.11585378437744]} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                {activeDevices && activeDevices.map(dev => {
                    let pos = dev.location.value.split(",");

                    const keys = Object.keys(dev);
                    let showValues = keys.map(el => {
                        if (dev[el].value) {
                            if (el === 'TimeInstant') {
                                const fullDateTxt = dev[el].value.toString();
                                const date = fullDateTxt.substr(0, 10);
                                const time = fullDateTxt.substr(11, 5);
                                return <h7><b>Data:</b> {date} {time}</h7>
                            }
                            else {
                                return <div>
                                    <h7><b>{capitalizeFirstLetter(el)}:</b> {dev[el].value}</h7>
                                </div>
                            }
                        }

                    }).filter(el => el);
                    return <Marker key={dev.id} position={pos} icon={red_marker}>
                        <Popup style={{ width: '501px' }}>
                            <div style={{ width: '501px' }}>
                                {devReadings && devReadings && devReadings[dev.id] &&
                                <AppBar position="static">
                                    <Tabs value={value} onChange={handleChange} variant="scrollable" aria-label="simple tabs example">
                                        {Object.keys(devReadings[dev.id]).map((el,idx) => {
                                            return <Tab label={el} key={idx} {...a11yProps(idx)} />
                                        })}
                                    </Tabs>
                                </AppBar>
                                }
                                {devReadings && devReadings[dev.id] && Object.keys(devReadings[dev.id]).map((el,idx) => {
                                    return <TabPanel value={value} index={idx}>
                                        <CalHeatmap metricName={el} devReadings={devReadings[dev.id][el]} ranges={ranges} />
                                    </TabPanel>

                                })}
                                <h6><b>Última Comunicação:</b></h6>
                                {showValues}
                            </div>
                        </Popup>

                        <Tooltip>{dev.id}</Tooltip>
                    </Marker>
                })
                }


            </MapContainer>
        </>
    )
}
export default Map;

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };