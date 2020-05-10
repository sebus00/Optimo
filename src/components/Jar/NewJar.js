import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addJarAction } from 'store/actions';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from 'components/IconButton/IconButton';
import AddBoxIcon from '@material-ui/icons/AddBox';

const useStyles = makeStyles({
  icon: {
    fontSize: '8rem',
    // color: '#fff',
  },
});

const StyledWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  height: 200px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NewJar = ({ addJar, disabled }) => {
  const classes = useStyles();

  return (
    <StyledWrapper>
      <IconButton width={150} disabled={disabled} onClickHandler={addJar} title="Dodaj nowy słoik">
        <AddBoxIcon className={classes.icon} />
      </IconButton>
    </StyledWrapper>
  );
};

NewJar.propTypes = {
  addJar: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

NewJar.defaultProps = {
  disabled: false,
};

const mapDispatchToProps = (dispatch) => ({
  addJar: () => dispatch(addJarAction()),
});

export default connect(null, mapDispatchToProps)(NewJar);
