import { Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import ScaleColorMetricFormField from './ScaleColorMetricFormField'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import randomColor from 'randomcolor';
import ColorPickerModal from './ColorPickerModal';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useAlert } from 'react-alert'

function AddNewMetric({ metricMgr, userData }) {

    const defaultColors = ['#1F8F4C', '#F9FF33', '#FFC133', '#FF3333', '#A229C6'];
    const defaultRanges = [10, 20, 30, 50];
    const [showForm, setShowForm] = useState(false);
    const [formRanges, setFormRanges] = useState([...defaultRanges]);
    const [scaleColors, setScaleColors] = useState([...defaultColors]);
    const [openColorModal, setOpenColorModal] = useState(false);
    const [currColorIdx, setCurrColorIdx] = useState(0)
    const [metricName, setMetricName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const alert = useAlert();

    const handleClick = (ev) => {
        setFormRanges([...defaultRanges]);
        setScaleColors([...defaultColors]);
        setMetricName('');
        setShowForm(prev => !prev);
    }

    const saveRanges = () => {
        if (!metricName) {
            alert.error("Adicione nome à métrica");
        }
        else {
            setSubmitting(true);
            metricMgr.saveNewMetric(
                {
                    metricName: metricName,
                    scaleColors: scaleColors,
                    scaleRanges: formRanges

                },
                userData,
                () => {
                    alert.success("Métrica Registada.");
                    setSubmitting(false);
                    handleClick();
                },
                (er) => {
                    alert.error(er);
                    setSubmitting(false);
                })
        }

    }

    const OpenColorPicker = (ev) => {
        setOpenColorModal(true);
    }

    const AdicionarIntervalo = () => {
        let color = randomColor();
        setFormRanges(prev => (
            [...prev, prev[prev.length - 1] * 2]
        ))
        setScaleColors(prev => (
            [...prev, color]
        ))
        formRanges.push(formRanges[formRanges.length - 1]);
    }

    const RemoverIntervalo = () => {
        if (scaleColors.length > 2) {
            let ranges = [...formRanges];
            ranges.pop();
            setFormRanges(ranges);
            let colors = [...scaleColors];
            colors.pop();
            setScaleColors(colors);
        }
    }

    return (
        <div>
            <Button aria-controls="device-menu" aria-haspopup="true" onClick={handleClick}>
                Adicionar Métrica
            </Button>
            {showForm &&
                <form id="new_metric_form">
                    <TextField
                        required
                        id="outlined_nome"
                        label="Nome Métrica"
                        variant="outlined"
                        value={metricName}
                        onChange={(ev) => {
                            setMetricName(ev.target.value)
                        }}
                    />
                    <div >
                        <ColorPickerModal
                            open={openColorModal}
                            handleClose={() => { setOpenColorModal(false) }}
                            colorsArray={scaleColors}
                            currentIdx={currColorIdx}
                            setColor={(selectedColor, idx) => {
                                let cpy = [...scaleColors]
                                cpy[idx] = selectedColor;
                                setScaleColors(cpy);
                            }}
                        />
                        {scaleColors.map((el, idx) => {
                            return (
                                <ScaleColorMetricFormField
                                    key={idx}
                                    idx={idx}
                                    setCurrColorIdx={setCurrColorIdx}
                                    scaleColors={scaleColors[idx]}
                                    formRanges={formRanges}
                                    setFormRanges={setFormRanges}
                                    openColorPicker={OpenColorPicker}

                                />
                            )
                        })}
                    </div>
                    <div>
                        <Button onClick={AdicionarIntervalo}>
                            <AddCircleOutlineIcon />Adicionar Intervalo
                        </Button>
                        <Button onClick={RemoverIntervalo}>
                            <RemoveCircleOutlineIcon />Remover Intervalo
                        </Button>

                    </div>
                    <div>
                        <button type="button" className="btn btn-secondary" onClick={handleClick} >Cancelar</button>
                        <button type="button" className="btn btn-dark" disabled={submitting} onClick={saveRanges}>
                            {!submitting && "Salvar"}
                            <CircularProgress size={20} hidden={!submitting} style={{ color: 'red' }} />
                        </button>
                    </div>
                </form>
            }
        </div>
    );
}

export default AddNewMetric;