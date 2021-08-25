import axios from "axios";

class MetricMgr {

    constructor(managementApiOptions) {
        this.managementApiOptions = managementApiOptions;
    }

    updateMetric(metricData, success, error) {
        let data = JSON.stringify(
            {
                metricData: {
                    metricName: metricData.metricName,
                    scaleColors: metricData.scaleColors,
                    scaleRanges: metricData.scaleRanges
                }
            });
        let config = {
            method: 'post',
            url: this.managementApiOptions.managementApiURI + "updatemetric",
            headers: {
                'content-type': 'application/json'
            },
            data: data
        }
        console.log(config);
        axios(config)
            .then((res) => {
                success();
                console.log("Registered")
            }).catch(er => {
                error(er);
            });
    }

    getMetricRanges(metric, responseSet) {
        axios.get(
            this.managementApiOptions.managementApiURI + "colorchart", { metric: metric }
        )
            .then((res) => {
                responseSet({ success: true, data: 'ass' })
            }).catch(error => {
                responseSet({ success: false, msg: error })
                console.log(error)
            });
    }

    getAllMetrics(responseSet) {
        axios.get(
            this.managementApiOptions.managementApiURI + "getallmetrics"
        )
            .then((res) => {
                responseSet({ success: true, data: res.data })
            }).catch(error => {
                responseSet({ success: false, msg: error })
                console.log(error)
            });
    }

    saveNewMetric(metricData, success, error) {
        
        let data = JSON.stringify(
            {
                metricData: {
                    metricName: metricData.metricName,
                    scaleColors: metricData.scaleColors,
                    scaleRanges: metricData.scaleRanges
                }
            });
        let config = {
            method: 'post',
            url: this.managementApiOptions.managementApiURI + "addmetric",
            headers: {
                'content-type': 'application/json'
            },
            data: data
        }
        console.log(config);
        axios(config)
            .then((res) => {
                success();
                console.log("Registered")
            }).catch(er => {
                error(er);
            });
    }

}

export default MetricMgr;