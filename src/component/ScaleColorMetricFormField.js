import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';

function ScaleColorMetricFormFields({ idx, setCurrColorIdx, scaleColors, formRanges, setFormRanges, openColorPicker }) {

    const ChangeValue = (ev, idx) =>{
        if( idx >= 0 && idx < formRanges.length){
            if(ev.target.value < formRanges[idx] && (idx === 0 || ev.target.value > formRanges[idx - 1])){
                UpdateValue(ev.target.value, idx);
            }
            if(ev.target.value > formRanges[idx] && (idx === (formRanges.length - 1) ||  ev.target.value < formRanges[idx + 1])){
                UpdateValue(ev.target.value, idx);
            }
        }
    }

    const UpdateValue = (val, idx) => {
        let cpFormRanges = [...formRanges];
        cpFormRanges[idx] = Number(val);
        setFormRanges(prev => ([
            ...cpFormRanges
        ]))
    }

    return (
        <div>
            {idx === 0 &&
                <Box display="flex" flexDirection="row" style={{ paddingBottom: '5%' }}>                    
                    <Button
                        style={{ backgroundColor: scaleColors }}
                        onClick={(ev) => {
                            setCurrColorIdx(idx);
                            openColorPicker(ev);
                        }}
                    />
                    <h6 style={{ paddingLeft: '5%', paddingTop: '5%', paddingRight: '5%' }} >Valor menor o igual a:</h6>
                    <input
                        className='metricNumber'
                        type="number"
                        value={formRanges[idx]}
                        style={{ width: '70px', paddingLeft: '5%' }}
                        // onChange={(ev) => ChangeUnder(ev, idx, idx + 1)}
                        onChange={(ev) => ChangeValue(ev,idx) }
                    />
                </Box>
            }
            {idx !== 0 && idx !== (formRanges.length) &&
                <Box display="flex" flexDirection="row" style={{ paddingBottom: '5%' }}>
                    <Button
                        style={{ backgroundColor: scaleColors }}
                        onClick={(ev) => {
                            setCurrColorIdx(idx);
                            openColorPicker(ev);
                        }}
                    />
                    <h6 style={{ paddingLeft: '5%', paddingTop: '5%', paddingRight: '5%' }} >Valor entre:</h6>
                    <input
                        className='metricNumber'
                        type="number"
                        value={formRanges[idx - 1]}
                        style={{ width: '70px', paddingLeft: '5%' }}
                        // onChange={(ev) => ChangeBetween(ev, idx - 1, idx - 2, idx )}
                        onChange={(ev) => ChangeValue(ev, idx - 1) }
                    />
                    <h6 style={{ paddingLeft: '5%', paddingTop: '5%', paddingRight: '5%' }} > e:</h6>
                    <input
                        className='metricNumber'
                        type="number"
                        value={formRanges[idx]}
                        style={{ width: '70px', paddingLeft: '5%' }}
                        // onChange={(ev) => ChangeBetween(ev, idx, idx - 2, idx + 1)}
                        onChange={(ev) => ChangeValue(ev, idx) }
                    />
                </Box>
            }
            {idx === (formRanges.length) &&
                <Box display="flex" flexDirection="row" style={{ paddingBottom: '5%' }}>
                    
                    <Button
                        style={{ backgroundColor: scaleColors }}
                        onClick={(ev) => {
                            setCurrColorIdx(idx);
                            openColorPicker(ev);
                        }}
                    />
                    <h6 style={{ paddingLeft: '5%', paddingTop: '5%', paddingRight: '5%' }} >Valor superior a:</h6>
                    <input
                        className='metricNumber'
                        type="number"
                        value={formRanges[idx - 1]}
                        style={{ width: '70px', paddingLeft: '5%' }}
                        // onChange={(ev) => ChangeOver(ev, idx - 1, idx - 2)}
                        onChange={(ev) => ChangeValue(ev,idx - 1) }
                    />
                </Box>
            }

        </div>
    );
}

export default ScaleColorMetricFormFields;