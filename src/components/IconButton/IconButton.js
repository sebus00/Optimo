import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

const useStyles = makeStyles({
  iconButton: {
    padding: 8,
    maxWidth: ({ width }) => width || 100,
    '&$disabled': {
      opacity: 0.5,
    },
  },
  disabled: {},
  tooltip: {
    fontSize: '1.2rem',
  },
});

const IconButtonComponent = ({ disabled, onClickHandler, title, children, ...props }) => {
  const classes = useStyles(props);

  return (
    <Tooltip title={title} TransitionComponent={Zoom} classes={{ tooltip: classes.tooltip }}>
      <IconButton
        classes={{
          root: classes.iconButton,
          disabled: classes.disabled,
        }}
        disabled={disabled}
        onClick={onClickHandler}
        component="span"
      >
        {children}
      </IconButton>
    </Tooltip>
  );
};

IconButtonComponent.propTypes = {
  disabled: PropTypes.bool,
  onClickHandler: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.element.isRequired,
};

IconButtonComponent.defaultProps = {
  disabled: false,
  onClickHandler: null,
  title: '',
};

export default IconButtonComponent;
