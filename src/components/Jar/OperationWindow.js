import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from 'components/TextField/TextField';

const StyledWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fff;
  left: 0;
  top: 0;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const OperationWindow = ({
  label,
  operationAmount,
  setOperationAmount,
  max,
  cancel,
  confirm,
  currency,
}) => {
  const handleSliderChange = (event, value) => {
    setOperationAmount(value);
  };

  const handleInputChange = ({ target: { value } }) => {
    const dotIndex = value.indexOf('.');
    setOperationAmount(
      dotIndex >= 0 && dotIndex < value.length - 3
        ? Number(value.slice(0, dotIndex + 3))
        : Number(value),
    );
  };

  const handleInputBlur = () => {
    if (operationAmount < 0) {
      setOperationAmount(0);
    } else if (max && operationAmount > max) {
      setOperationAmount(max);
    }
  };

  return (
    <StyledWrapper>
      <Typography id="transfer-input-slider" gutterBottom>
        {label}
      </Typography>
      {max && (
        <Slider
          value={typeof operationAmount === 'number' ? operationAmount : 0}
          onChange={handleSliderChange}
          aria-labelledby="input-slider"
          step={0.01}
          min={0}
          max={max / 100}
        />
      )}
      <TextField
        value={operationAmount}
        changeHandler={handleInputChange}
        blurHandler={handleInputBlur}
        type="number"
        inputProps={{
          min: 0,
          ...(max && {
            max: max / 100,
          }),
          'aria-labelledby': 'transfer-input-slider',
        }}
        suffix={currency}
      />
      <StyledRow>
        <Button size="large" onClick={cancel}>
          Anuluj
        </Button>
        <Button size="large" disabled={operationAmount === 0} onClick={confirm}>
          Zatwierdź
        </Button>
      </StyledRow>
    </StyledWrapper>
  );
};

OperationWindow.propTypes = {
  label: PropTypes.string.isRequired,
  operationAmount: PropTypes.number.isRequired,
  setOperationAmount: PropTypes.func.isRequired,
  max: PropTypes.number,
  cancel: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
  currency: PropTypes.string,
};

OperationWindow.defaultProps = {
  max: null,
  currency: '',
};

export default OperationWindow;
