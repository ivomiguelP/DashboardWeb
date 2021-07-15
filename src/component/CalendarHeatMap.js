import CalendarHeatmap from 'react-calendar-heatmap';
import { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';

export default function CalHeatmap({ devReadings, metricName, ranges }) {

    const today = new Date();
    const beginDate = shiftDate(today, -30);

    const [heat, setHeat] = useState(
        {
            values: [],
        });

    function getCount(val, metricName) {
        if (ranges[metricName]) {
            console.log("Metric: ",metricName)
            console.log("Val: ", val)
            if (val <= Number(ranges[metricName]['range0'])) {
                console.log("Returned: ",1)
                return 1;
            }
            if (val >= Number(ranges[metricName]['range00']) && val < Number(ranges[metricName]['range1'])) {
                console.log("Returned: ",2)
                return 2;
            }
            if (val >= Number(ranges[metricName]['range1']) && val < Number(ranges[metricName]['range2'])) {
                console.log("Returned: ",3)
                return 3;
            }
            if (val >= Number(ranges[metricName]['range2']) && val < Number(ranges[metricName]['range3'])) {
                console.log("Returned: ",4)
                return 4;
            }
            console.log("Returned: ",5)
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

        if (devReadings !== undefined) {
            let data = [];
            for (let d in devReadings.values) {

                data.push({ date: d, count: getCount(devReadings.values[d], metricName), value: devReadings.values[d] });
            }
            setHeat(prev => {
                return {
                    ...prev, values: data

                }
            })
        }
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
                tooltipDataAttrs={(el,z) => {
                    return {
                        'data-tip': el.date ? (`Dia: ${el.date !== null ? el.date.slice(0, 10) : " "} Valor: ${Math.round(el.value)}`) : ''
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


