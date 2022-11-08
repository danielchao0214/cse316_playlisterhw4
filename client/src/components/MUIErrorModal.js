import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import GlobalStoreContext from '../store';
import Modal from '@mui/material/Modal';
import ErrorIcon from '@mui/icons-material/Error';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert' 

import { useContext } from 'react'
import AuthContext from '../auth';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function MUIErrorModal() {
  const { auth } = useContext(AuthContext);

  function handleClose(event) {
    auth.closeModal();
  }

  let errorMessage = "";
  if (auth.errorMessage) {
    errorMessage = auth.errorMessage;
  }

  return (
    <div>
      <Modal
        open={auth.errorMessage !== null}
      >
        <Box sx={style} display="grid" justifyContent="center" alignItems="center">
          <Alert severity="error" sx={{margin: "10px", mb:2}}>
          <strong>{errorMessage}</strong>
          </Alert>
          <Button variant="outlined" onClick={handleClose}> 
            Close
          </Button>                       
        </Box>
      </Modal>
    </div>
  );
}