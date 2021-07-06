import CalendarHeatmap from 'react-calendar-heatmap';
import { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';

export default function CalHeatmap({ devReadings, metricName, ranges }) {

    const today = new Date();
    const beginDate = shiftDate(today, -30);

    const [heat, setHeat] = useState(
        {
            // Some dates to render in the heatmap
            values: [
                // { date: shiftDate(today, -3), count: 4 },
                // { date: shiftDate(today, -7), count: 1 },
                // { date: shiftDate(today, -14), count: 3 },
                // { date: shiftDate(today, -45), count: 1 }
            ],

        });

    const [heat2, setHeat2] = useState(
        {
            // Some dates to render in the heatmap
            values: [
                // { date: shiftDate(today, -3), count: 4 },
                // { date: shiftDate(today, -7), count: 1 },
                // { date: shiftDate(today, -14), count: 3 },
                // { date: shiftDate(today, -45), count: 1 }
            ]
        });

    function getCount(val, metricName) {
        if (ranges[metricName]) {
            if (val <= ranges[metricName]['0']) {
                return 1;
            }
            if (val >= ranges[metricName]['1'] && val < ranges[metricName]['2']) {
                return 2;
            }
            if (val >= ranges[metricName]['2'] && val < ranges[metricName]['3']) {
                return 3;
            }
            if (val >= ranges[metricName]['3'] && val < ranges[metricName]['4']) {
                return 4;
            }
            return 5;
        }
        if (val < 0.25) {
            return 1;
        }
        if (val >= 0.25 && val < 0.5) {
            return 2;
        }
        if (val >= 0.5 && val < 0.75) {
            return 3;
        }
        if (val >= 0.75) {
            return 4;
        }


    }

    useEffect(() => {
        console.log(metricName)

        if (devReadings !== undefined) {
            let data = [];
            for (let d in devReadings.values) {

                data.push({ date: d, count: getCount(devReadings.values[d], metricName) });
            }
            setHeat(prev => {
                return {
                    ...prev, values: data

                }
            })
        }
        console.log(heat)
        // console.log(heat2)
    }, [devReadings])


    return (

        <div className='markerHeatmap'>
            {/* <h6><b>{metricName}</b></h6> */}
            <CalendarHeatmap
                startDate={beginDate}
                endDate={today}
                values={heat.values}
                classForValue={value => {
                    if (!value) {
                        return 'color-empty';
                    }
                    return `color-github-${value.count}`;
                }}
                tooltipDataAttrs={value => {

                    return {
                        'data-tip': value.date ? (`Dia: ${value.date !== null ? value.date.slice(0, 10) : " "}`) : ''

                    };

                }}
                horizontal={false}
                showWeekdayLabels={true}
            // onClick={value => value?alert(`Clicked on value with count: ${value.count}`): ''}
            />
            <ReactTooltip />
        </div>
    );
}

function shiftDate(date, numDays) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
}

function getRange(count) {
    return Array.from({ length: count }, (_, i) => i);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const rootElement = document.getElementById('root');

