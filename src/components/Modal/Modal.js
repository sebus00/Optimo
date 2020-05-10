import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles({
  dialog: {
    maxHeight: '90vh',
    width: '100%',
    padding: '20px',
    maxWidth: 900,
  },
  title: {
    '& h2': {
      fontSize: '2rem',
      lineHeight: '2.5rem',
      margin: 0,
    },
  },
});

const Modal = ({ title, closeHandler, isOpen, children }) => {
  const classes = useStyles();
  return (
    <Dialog classes={{ paper: classes.dialog }} open={isOpen} onClose={closeHandler}>
      <DialogTitle className={classes.title} disableTypography>
        <h2>{title}</h2>
      </DialogTitle>
      {children}
    </Dialog>
  );
};

Modal.propTypes = {
  title: PropTypes.string,
  closeHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  children: PropTypes.element.isRequired,
};

Modal.defaultProps = {
  title: '',
  isOpen: false,
};

export default Modal;
