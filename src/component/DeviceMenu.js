import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function DeviceMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const addClick = () => {
    props.showAddForm(true);
    props.showRemoveForm(false);
    props.showList(false);
    handleClose();
  }
  

  const removeClick = () => {
    props.showRemoveForm(true);
    props.showAddForm(false);
    props.showList(false);
    handleClose();
  }

  const listClick = ()=> {
    props.showList(true);
    props.showRemoveForm(false);
    props.showAddForm(false);
    handleClose();
  }

  return (
    <div>
      <Button aria-controls="device-menu" aria-haspopup="true" onClick={handleClick}>
        Dispositivos
      </Button>
      <Menu
        id="device-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={addClick}>Adicionar Dispositivo</MenuItem>
        <MenuItem onClick={listClick}>Listar Dispositivos</MenuItem>
        <MenuItem onClick={removeClick}>Remover Dispositivo</MenuItem>
      </Menu>
    </div>
  );
}