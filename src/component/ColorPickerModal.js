import Modal from '@material-ui/core/Modal';
import { SketchPicker } from 'react-color';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

function ColorPickerModal({ open, handleClose, colorsArray, currentIdx, setColor}) {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <SketchPicker 
                    color={colorsArray[currentIdx]}
                    onChange={(colorP) => {
                        setColor(colorP.hex, currentIdx)
                    }}
                />
            </div>

        </Modal>
    )


}

function getModalStyle() {
    const top = 20;
    const left = 30;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default ColorPickerModal;