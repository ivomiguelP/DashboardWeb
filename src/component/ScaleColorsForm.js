import React, { useState } from 'react';
import { useAlert } from 'react-alert'
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Select from 'react-select';

function ScaleColorsForm({ ranges, setRanges }) {

    const alert = useAlert();

    const [formRanges, setFormRanges] = useState(ranges);

    const handleClick = () => {
        setShowForm(prev => !prev);
    }

    const [metrics, setMetrics] = useState(Object.keys(formRanges).map(el => { return { key: el, value: el, label: el.replace("_",".") } }));
    const [showForm, setShowForm] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState(metrics[0]);

    const changeMetric = (ev) => {
        console.log(ev)
        console.log("MetricKey:", selectedMetric.key)
        setSelectedMetric(ev)
    }

    const saveRanges = ()=>{
        localStorage.setItem("ScaleColors", JSON.stringify(formRanges,null,2))
        setRanges(formRanges);
        alert.success("Valores salvos.");
        handleClick();
    }

    
    const ChangeUnder = (ev, valprop, valBigger) => {
        if (ev.target.value < formRanges[selectedMetric.key][valBigger]) {
            setFormRanges(prev => ({
                ...prev,
                [selectedMetric.key]: {
                    ...prev[selectedMetric.key],
                    [valprop]: ev.target.value
                }
            })
            )
        }
    }

    const ChangeOver = (ev, valprop, valSmaller) => {
        if (ev.target.value > formRanges[selectedMetric.key][valSmaller]) {
            setFormRanges(prev => ({
                ...prev,
                [selectedMetric.key]: {
                    ...prev[selectedMetric.key],
                    [valprop]: ev.target.value
                }
            })
            )
        }
    }

    
    const ChangeBetween = (ev, valprop, valSmaller, valBigger) => {
        if (ev.target.value > formRanges[selectedMetric.key][valSmaller] && ev.target.value < formRanges[selectedMetric.key][valBigger]) {
            setFormRanges(prev => ({
                ...prev,
                [selectedMetric.key]: {
                    ...prev[selectedMetric.key],
                    [valprop]: ev.target.value
                }
            })
            )
        }
    }


return (
    <div>
        <Button aria-controls="device-menu" aria-haspopup="true" onClick={handleClick}>
            Configurar Escala
        </Button>
        {showForm &&
            <form>
                <Select

                    placeholder="Adicione atributos"
                    name="Atributos opcionais"
                    options={metrics}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    defaultValue={metrics[0]}
                    id="attrInput"
                    onChange={changeMetric}
                />
                <div >
                    <Box display="flex" flexDirection="row" style={{ paddingBottom: '5%' }}>
                        <Box bgcolor="green" p={2} style={{ width: '20px', paddingRight: '20' }} ></Box>
                        <h6 style={{ paddingLeft: '5%', paddingTop: '5%', paddingRight: '5%' }} >Valor menor o igual a:</h6>
                        <input
                            type="number"
                            value={formRanges[selectedMetric.key]['range0']}
                            style={{ width: '60px', paddingLeft: '5%' }}
                            onChange={(ev) => ChangeUnder(ev, 'range0', 'range1')}
                        />
                    </Box>
                    <Box display="flex" flexDirection="row" style={{ paddingBottom: '5%' }}>
                        <Box bgcolor="yellow" p={2} style={{ width: '20px', paddingRight: '20' }}></Box>
                        <h6 style={{ paddingLeft: '5%', paddingTop: '5%', paddingRight: '5%' }} >Valor entre:</h6>
                        <input
                            type="number"

                            value={formRanges[selectedMetric.key]['range0']}
                            style={{ width: '60px', paddingLeft: '5%' }}
                            onChange={(ev) => ChangeUnder(ev, 'range0', 'range1')}
                        />
                        <h6 style={{ paddingLeft: '5%', paddingTop: '5%', paddingRight: '5%' }} > e:</h6>
                        <input
                            type="number"
                            value={formRanges[selectedMetric.key]['range1']}
                            style={{ width: '60px', paddingLeft: '5%' }}
                            onChange={(ev) => ChangeBetween(ev, 'range1', 'range0', 'range2')}
                        />
                    </Box>
                    <Box display="flex" flexDirection="row" style={{ paddingBottom: '5%' }}>
                        <Box bgcolor="orange" p={2} style={{ width: '20px', paddingRight: '20' }}></Box>
                        <h6 style={{ paddingLeft: '5%', paddingTop: '5%', paddingRight: '5%' }} >Valor entre:</h6>
                        <input
                            type="number"
                            value={formRanges[selectedMetric.key]['range1']}
                            style={{ width: '60px', paddingLeft: '5%' }}
                            onChange={(ev) => ChangeBetween(ev, 'range1', 'range0', 'range2')}
                        />
                        <h6 style={{ paddingLeft: '5%', paddingTop: '5%', paddingRight: '5%' }} > e:</h6>
                        <input
                            type="number"
                            value={formRanges[selectedMetric.key]['range2']}
                            style={{ width: '60px', paddingLeft: '5%' }}
                            onChange={(ev) => ChangeBetween(ev, 'range2', 'range1', 'range3')}
                        />
                    </Box>
                    <Box display="flex" flexDirection="row" style={{ paddingBottom: '5%' }}>
                        <Box bgcolor="purple" p={2} style={{ width: '20px', paddingRight: '20' }}></Box>
                        <h6 style={{ paddingLeft: '5%', paddingTop: '5%', paddingRight: '5%' }} >Valor entre:</h6>
                        <input
                            type="number"
                            value={formRanges[selectedMetric.key]['range2']}
                            style={{ width: '60px', paddingLeft: '5%' }}
                            onChange={(ev) => ChangeBetween(ev, 'range2', 'range1', 'range3')}
                        />
                        <h6 style={{ paddingLeft: '5%', paddingTop: '5%', paddingRight: '5%' }} > e:</h6>
                        <input
                            type="number"
                            value={formRanges[selectedMetric.key]['range3']}
                            style={{ width: '60px', paddingLeft: '5%' }}
                            onChange={(ev) => ChangeOver(ev, 'range3' , 'range2')}
                        />
                    </Box>
                    <Box display="flex" flexDirection="row" style={{ paddingBottom: '5%' }}>
                        <Box bgcolor="maroon" p={2} style={{ width: '20px', paddingRight: '20' }}></Box>
                        <h6 style={{ paddingLeft: '5%', paddingTop: '5%', paddingRight: '5%' }} >Valor superior a:</h6>
                        <input
                            type="number"
                            value={formRanges[selectedMetric.key]['range3']}
                            style={{ width: '60px', paddingLeft: '5%' }}
                            onChange={(ev) => ChangeOver(ev, 'range3' , 'range2')}
                        />

                    </Box>

                </div>
                <div>
                    <button type="button" className="btn btn-dark" onClick={handleClick} >Sair</button>
                    <button type="button" className="btn btn-secondary" onClick={saveRanges}>Salvar</button>
                </div>
            </form>
        }
    </div>

);
}

export default ScaleColorsForm;