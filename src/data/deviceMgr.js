import axios from "axios";

class deviceMgr {

    constructor(managementApiOptions) {
        this.managementApiOptions = managementApiOptions;
    }


    registerDevice(devId, devEui, optAttrib, responseSet) {
        if (!devId) {
            return responseSet({ success: false, msg: "DevID não foi indicado." });
        }
        let attributes = [];
        if (optAttrib)
            attributes = optAttrib.map(el => {
                return { 'object_id': el, 'name': el, 'type': 'Number' }
            }
            )
        axios.post(
            this.managementApiOptions.managementApiURI + "registerdevice",
            {
                devID: devId,
                devEui: devEui,
                optionalAttributes: attributes
            },
            {
                headers: {
                    'content-type': 'application/json'
                }
            }
        ).then((res) => {
            responseSet({ success: true, msg: res.data })
            console.log("Registered")
        }).catch(error => {
            responseSet({ success: false, msg: error })
            console.log(error)
        });
    }

    unregisterDevice(devId, responseSet) {
        if (!devId) {
            return responseSet({ success: false, msg: "DevID não foi indicado." });
        }
        axios.post(
            this.managementApiOptions.managementApiURI + "unregisterdevice",
            {
                devID: devId
            },
            {
                headers: {
                    'content-type': 'application/json'
                }
            }
        ).then((res) => {
            responseSet({ success: true, msg: res.data })
            console.log("Unregistered")
        }).catch(error => {
            responseSet({ success: false, msg: error })
            console.log(error)
        });
    }

    listRegisteredDevices(responseSet) {
        axios.get(
            this.managementApiOptions.managementApiURI + "devices"
        )
            .then((res) => {
                let devices = [];
                res.data.devicesIotAgent.map(
                    (dev) => {
                        devices.push(dev.device_id)
                    })

                responseSet({ success: true, data: devices })
            }).catch(error => {
                responseSet({ success: false, msg: error })
                console.log(error)
            });
    }

    async listActiveDevices() {

        let res = await axios.get(this.managementApiOptions.orionURI + "entities/",
            {
                headers: {
                    "fiware-service": this.managementApiOptions.fiwareService,
                    "fiware-servicepath": this.managementApiOptions.fiwareServicePath
                },
                params: {
                    type: this.managementApiOptions.deviceType
                }
            });
        return res.data;
    }

    async GetLastMonthMaxReadings(deviceName, attributeName, beginDate, endDate, resolution, aggregationType) {
        const url = `http://${this.managementApiOptions.sthHost}:${this.managementApiOptions.sthPort}/STH/v1/contextEntities/type/LoraDevice/id/${deviceName}/attributes/${attributeName}`;
        const headers = {
            "fiware-service": this.managementApiOptions.fiwareService,
            "fiware-servicepath": this.managementApiOptions.fiwareServicePath
        };
        const parameters = {
            aggrMethod: aggregationType,
            aggrPeriod: resolution,
            dateFrom: beginDate.toISOString(),
            dateTo: endDate.toISOString()
        };
        try {
            let res = await axios.get(
                url,
                {
                    headers: headers,
                    params: parameters
                }
            );
            let results = {}
            if (res.data.contextResponses) {
                const dd = res.data.contextResponses[0].contextElement.attributes[0].values;
                res.data.contextResponses[0].contextElement.attributes[0].values.forEach(el => {
                    const origin = new Date(el._id.origin);
                    let key = new Date();
                    el.points.forEach(read => {
                        key.setDate(origin.getDate() + read.offset - 1)
                        if (read[aggregationType])
                            results[key.toISOString()] = read[aggregationType]
                    })
                })

            }
            return results;
        }
        catch (error) {
            console.log(error)
        }

    }

}

export default deviceMgr;