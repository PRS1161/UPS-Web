import { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme
} from '@mui/material';

const ConfirmDialog = forwardRef(({ setStatus }, ref) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.between('md'));

  useImperativeHandle(ref, () => ({
    handleClickOpen() {
      setOpen(true);
    }
  }));

  const handleClose = (status) => {
    setOpen(false);
    setStatus(status);
  };
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Confirm your action?</DialogTitle>
        <DialogContent>
          <DialogContentText> Would you like to remove this item from the list? </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => handleClose(true)} autoFocus>
            Yes
          </Button>
          <Button variant="contained" onClick={() => handleClose(false)} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default ConfirmDialog;
