import HeatMap from 'react-heatmap-grid'
import { useEffect, useState } from 'react';


export default function CalHeatmap({ devReadings, metricName, metrics }) {

    const today = new Date();
    const [data, setData] = useState(undefined)

    useEffect(() => {
        if (data === undefined) {
            let d = []
            for (let i = 0; i < 5; i++) {
                d.push(new Array(7).fill({ value: '-', day: '' }))
            }
            setData(d)
        }
        else {
            if (devReadings !== undefined) {
                for (const [key, value] of Object.entries(devReadings.values)) {
                    const { x, y } = determineGridPos(key);
                    const arr = data;
                    let dateObj = new Date(key);
                    let month = dateObj.getUTCMonth() + 1; //months from 1-12
                    let day = dateObj.getUTCDate();
                    let year = dateObj.getUTCFullYear();

                    let newdate = day + "/" + month + "/" +  year;
                    arr[y][x] = { value: value, day: newdate };
                }

            }
        }

    }, [data, devReadings])

    const xLabels = ['Dom ', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab',]
    const yLabels = [' ', ' ', ' ', ' ', '']

    return (

        <div className='markerHeatmap'>
            {data && <HeatMap
                xLabels={xLabels}
                yLabels={yLabels}
                xLabelsLocation={"top"}
                xLabelWidth={60}
                data={data}
                squares
                // onClick={(x, y) => alert(`Clicked ${x}, ${y}`)}
                cellStyle={(background, value, min, max, data, x, y) => {
                    return {
                        background: GetColor(metricName, metrics, value.value),
                        fontSize: "11px",
                    }
                }}
                cellRender={value => {
                    if (value && value.value !== '-') {
                        console.log(value);
                        return value.value;
                    }
                    return value && `${value.value
                        }`
                }
                }
                title={(value, unit) => `${value.day}`}
            />}
        </div>
    );
}

function shiftDate(date, numDays) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
}


function determineGridPos(date) {
    const now = new Date()
    const dateD = new Date(date)
    const nowWday = now.getDay();

    const diffTime = Math.abs(now - dateD);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
    let x = nowWday, y = 4;
    for (let i = diffDays; i > 0; i--) {
        if (x - 1 < 0) {
            x = 6;
            y--;
        }
        else {
            x--;
        }
    }
    return { x, y }
}

function GetColor(metricName, metrics, value) {
    if (value === '-') {
        return 'white'
    }
    const mIdx = metrics.findIndex((el) => { return el.metricName === metricName })

    const ranges = metrics[mIdx].scaleRanges;
    const colors = metrics[mIdx].scaleColors;
    for (let i = 0; i < ranges.length; i++) {
        if (i === 0 && value < ranges[i]) {
            return colors[i];
        }
        if (i === ranges.length - 1 && value > ranges[i]) {
            return colors[ranges.length];
        }
        if (value > ranges[i] && value < ranges[i + 1]) {
            return colors[i + 1]
        }
    }
}