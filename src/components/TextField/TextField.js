import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

const useStyles = makeStyles({
  textField: {
    fontSize: ({ large }) => (large ? '2rem' : '1.6rem'),
    lineHeight: ({ large }) => (large ? '2.5rem' : '2rem'),
  },
});

const TextFieldComponent = ({
  value,
  changeHandler,
  keyDownHandler,
  blurHandler,
  inputProps,
  suffix,
  type,
  ...props
}) => {
  const classes = useStyles(props);

  return (
    <TextField
      InputProps={{
        classes: {
          root: classes.textField,
        },
        ...(suffix && {
          endAdornment: <InputAdornment position="end">{suffix}</InputAdornment>,
        }),
        inputProps,
      }}
      type={type}
      value={value}
      onChange={changeHandler}
      onBlur={blurHandler}
      onKeyDown={keyDownHandler}
    />
  );
};

TextFieldComponent.propTypes = {
  value: PropTypes.any.isRequired,
  changeHandler: PropTypes.func.isRequired,
  keyDownHandler: PropTypes.func,
  blurHandler: PropTypes.func,
  inputProps: PropTypes.object,
  suffix: PropTypes.string,
  type: PropTypes.string,
};

TextFieldComponent.defaultProps = {
  keyDownHandler: null,
  blurHandler: null,
  inputProps: {},
  suffix: '',
  type: 'text',
};

export default TextFieldComponent;
