import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';

export default function Alerta({title, message, callback}) {
  const [open, setOpen] = useState(true);

  const handleClose = (boole) => {
    callback(boole)
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={()=>{handleClose(false)}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{handleClose(false)}} variant="contained" color="secondary">
            Cancelar
          </Button>
          <Button onClick={()=>{handleClose(true)}} variant="contained" color="primary" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}