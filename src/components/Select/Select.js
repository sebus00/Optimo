import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles({
  formControl: {
    maxWidth: 180,
    width: '100%',
  },
  label: {
    fontSize: '1.2rem',
    lineHeight: '1.6rem',
  },
  select: {
    fontSize: '1.4rem',
    lineHeight: '1.8rem',
  },
  helperText: {
    fontSize: '1rem',
    lineHeight: '1.3rem',
  },
});

const SelectComponent = ({ value, changeHandler, items, ...props }) => {
  const classes = useStyles(props);

  return (
    <FormControl className={classes.formControl}>
      <InputLabel className={classes.label} id="select-helper-label">
        Waluta
      </InputLabel>
      <Select
        className={classes.select}
        labelId="select-helper-label"
        id="select-helper"
        value={value}
        onChange={changeHandler}
      >
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText className={classes.helperText}>Wybierz walutę</FormHelperText>
    </FormControl>
  );
};

SelectComponent.propTypes = {
  value: PropTypes.any.isRequired,
  changeHandler: PropTypes.func.isRequired,
  items: PropTypes.array,
};

SelectComponent.defaultProps = {
  items: [],
};

export default SelectComponent;
