import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles({
  iconButton: {
    padding: 8,
    maxWidth: ({ width }) => width || 100,
  },
});

const IconButtonComponent = ({ disabled, onClickHandler, children, ...props }) => {
  const materialClasses = useStyles(props);

  return (
    <IconButton
      className={materialClasses.iconButton}
      disabled={disabled}
      onClick={onClickHandler}
      component="span"
    >
      {children}
    </IconButton>
  );
};

IconButtonComponent.propTypes = {
  disabled: PropTypes.bool,
  onClickHandler: PropTypes.func,
  children: PropTypes.element.isRequired,
};

IconButtonComponent.defaultProps = {
  disabled: false,
  onClickHandler: null,
};

export default IconButtonComponent;
