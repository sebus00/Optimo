import React, { useState } from 'react';
import PropTypes from 'prop-types';
import JarPropsTypes from 'models/Jar';
import CurrencyPropsTypes from 'models/Currency';
import styled from 'styled-components';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import TextField from 'components/TextField/TextField';
import Select from 'components/Select/Select';
import { connect } from 'react-redux';
import { splitDepositAction } from 'store/actions';
import NumberFormat from 'react-number-format';

const StyledWrapper = styled.div``;

const StyledRow = styled.div`
  display: flex;
  align-items: flex-end;
`;

const StyledTextFieldWrapper = styled.div`
  position: relative;
  bottom: 1.6rem;
  margin-right: 30px;
`;

const StyledJarField = styled.div`
  margin-top: 15px;
`;

const StyledName = styled.span`
  margin-right: 5px;
`;

const DepositSplitter = ({ jars, currencies, splitDeposit, closeHandler }) => {
  const [depositArray, setDepositArray] = useState(
    jars.map(({ id, name, currency }) => ({ id, name, currency, amount: 0 })),
  );

  const [depositAmount, setDepositAmount] = useState(0);
  const [depositCurrency, setDepositCurrency] = useState(currencies[0].code);

  const selectChangeHandler = ({ target: { value } }) => {
    setDepositAmount(0);
    setDepositArray(depositArray.map(({ amount, ...rest }) => ({ amount: 0, ...rest })));
    setDepositCurrency(value);
  };

  const handleSliderChange = (value, id) => {
    const restValues = depositArray.reduce(
      (acc, item) => (item.id !== id ? acc + item.amount : acc),
      0,
    );
    setDepositArray(
      depositArray.map((item) =>
        item.id === id ? { ...item, amount: Math.min(value, depositAmount - restValues) } : item,
      ),
    );
  };

  const handleInputChange = ({ target: { value } }) => {
    const dotIndex = value.indexOf('.');
    setDepositAmount(
      dotIndex >= 0 && dotIndex < value.length - 3
        ? Number(value.slice(0, dotIndex + 3))
        : Number(value),
    );
  };

  const handleInputBlur = () => {
    if (depositAmount < 0) {
      setDepositAmount(0);
    }
    setDepositArray(depositArray.map(({ amount, ...rest }) => ({ amount: 0, ...rest })));
  };

  const confirmSplitDeposit = () => {
    const depositArrayFiltered = depositArray.filter(({ amount }) => amount !== 0);
    const depositIds = depositArrayFiltered.reduce((acc, { id }) => [...acc, id], []);
    const depositAmounts = depositArrayFiltered.reduce((acc, { amount }) => [...acc, amount], []);
    splitDeposit(depositIds, depositAmounts, depositCurrency);
    closeHandler();
  };

  return (
    <StyledWrapper>
      <StyledRow>
        <StyledTextFieldWrapper>
          <TextField
            value={depositAmount}
            changeHandler={handleInputChange}
            blurHandler={handleInputBlur}
            type="number"
            label="Podaj kwotę depozytu"
          />
        </StyledTextFieldWrapper>

        <Select
          label="waluta"
          helperText="Wybierz walutę"
          value={depositCurrency}
          changeHandler={selectChangeHandler}
          items={currencies.map((item) => ({ name: item.name, value: item.code }))}
        />
      </StyledRow>
      {depositArray
        .filter((item) => item.currency === depositCurrency)
        .map(({ id, name, currency, amount }) => (
          <StyledJarField key={id}>
            <StyledName>{name}: </StyledName>
            <NumberFormat
              value={amount.toFixed(2)}
              displayType="text"
              thousandSeparator
              suffix={` ${currency}`}
              renderText={(value) => <span>{value}</span>}
            />
            <Slider
              value={amount}
              step={0.01}
              min={0}
              max={depositAmount}
              onChange={(event, value) => handleSliderChange(value, id)}
            />
          </StyledJarField>
        ))}
      <Button
        disabled={!depositArray.find(({ amount }) => amount > 0)}
        onClick={confirmSplitDeposit}
        size="large"
      >
        Wykonaj
      </Button>
    </StyledWrapper>
  );
};

DepositSplitter.propTypes = {
  jars: PropTypes.arrayOf(JarPropsTypes),
  currencies: PropTypes.arrayOf(CurrencyPropsTypes),
  splitDeposit: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
};

DepositSplitter.defaultProps = {
  jars: [],
  currencies: [],
};

const mapStateToProps = ({ jars, currencies }) => {
  return { jars, currencies };
};

const mapDispatchToProps = (dispatch) => ({
  splitDeposit: (depositIds, depositAmounts, depositCurrency) =>
    dispatch(splitDepositAction(depositIds, depositAmounts, depositCurrency)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DepositSplitter);
