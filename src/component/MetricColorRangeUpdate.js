import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert'
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Select from 'react-select';
import ColorPickerModal from './ColorPickerModal';
import ScaleColorMetricFormField from './ScaleColorMetricFormField'

function MetricColorRangeUpdate({ metricMgr, userData }) {

    const alert = useAlert();

    const handleClick = () => {
        setShowForm(prev => !prev);
    }

    const [metrics, setMetrics] = useState([]);
    const [metricSelectOptions, setSelectOptions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState(metrics[0]);
    const [openColorModal, setOpenColorModal] = useState(false);

    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedRanges, setSelectedRanges] = useState([]);
    const [currColorIdx, setCurrColorIdx] = useState(0);



    useEffect(() => {
        metricMgr.getAllMetrics(userData,(res => {
            setMetrics(res.data.metrics);
            let options = res.data.metrics.map((el, idx) => {
                return { label: el.metricName, value: idx }
            })
            setSelectOptions(options)
        }))
    }, [showForm]);

    useEffect(() => {
        if(metricSelectOptions.length > 0){
            setSelectedColors(metrics[0].scaleColors);
            setSelectedRanges(metrics[0].scaleRanges);
            setSelectedMetric(metrics[0]);
        }
    }, [metricSelectOptions])

    const changeMetric = (ev) => {
        setSelectedColors(metrics[ev.value].scaleColors);
        setSelectedRanges(metrics[ev.value].scaleRanges);
        setSelectedMetric(metrics[ev.value]);
    }

    const saveRanges = () => {
        metricMgr.updateMetric({metricName:selectedMetric.metricName, scaleColors: [...selectedColors], scaleRanges: [...selectedRanges] },
            userData,
            () =>{
                alert.success("Valores salvos.");
                let mCpy = metrics.map((el)=>{
                    if(el.metricName === selectedMetric.metricName){
                        return {metricName: selectedMetric.metricName, scaleColors: [...selectedColors],scaleRanges: [...selectedRanges]};
                    }
                    else{
                        return el;
                    }
                });
                setMetrics(mCpy);
                // handleClick();
            },
            (error) =>{
                alert.error(error)
            }
            )
        // handleClick();
    }

    const OpenColorPicker = (ev) => {
        setOpenColorModal(true);
    }

    return (
        <div>
            <Button aria-controls="device-menu" aria-haspopup="true" onClick={handleClick}>
                Alterar Escala
            </Button>
            {showForm &&
                <form id='updateMetricForm'>
                    <Select

                        placeholder="Selecione Métrica"
                        name="metricaSelect"
                        options={metricSelectOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        defaultValue={metricSelectOptions[0]}
                        id="attrInput"
                        onChange={changeMetric}
                    />
                    <div >

                        <div >
                            <ColorPickerModal
                                open={openColorModal}
                                handleClose={() => { setOpenColorModal(false) }}
                                colorsArray={selectedColors}
                                currentIdx={currColorIdx}
                                setColor={(selectedColor, idx) => {
                                    let cpy = [...selectedColors]
                                    cpy[idx] = selectedColor;
                                    setSelectedColors(cpy);
                                }}
                            />
                            {selectedColors.map((el, idx) => {
                                return (
                                    <ScaleColorMetricFormField
                                        key={idx}
                                        idx={idx}
                                        setCurrColorIdx={setCurrColorIdx}
                                        scaleColors={selectedColors[idx]}
                                        formRanges={selectedRanges}
                                        setFormRanges={setSelectedRanges}
                                        openColorPicker={OpenColorPicker}

                                    />
                                )
                            })}
                        </div>

                    </div>
                    <div>
                        <button type="button" className="btn btn-secondary" onClick={handleClick} >Fechar</button>
                        <button type="button" className="btn btn-dark" onClick={saveRanges}>Salvar</button>
                    </div>
                </form>
            }
        </div>

    );
}

export default MetricColorRangeUpdate;