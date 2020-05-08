import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import NumberFormat from 'react-number-format';
import cx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as DepositIcon } from 'assets/icons/deposit.svg';
import { ReactComponent as WithdrawIcon } from 'assets/icons/withdraw.svg';
import { ReactComponent as TransferIcon } from 'assets/icons/transfer.svg';
import { ReactComponent as RemoveIcon } from 'assets/icons/bin.svg';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import SliderInput from 'components/Jar/SliderInput';
import IconButton from 'components/Jar/IconButton';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
  textField: {
    fontSize: '2rem !important',
    lineHeight: '2.5rem',
  },
});

const StyledWrapper = styled(Box)`
  width: 100%;
  max-width: 400px;
  /* min-width: 270px; */
  height: 200px;
  padding: 10px 15px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  transform: scale(1);
  overflow: hidden;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);

  :before {
    content: '';
    display: none;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: green;
    cursor: pointer;
    left: 0;
    top: 0;
    opacity: 0;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
      transform: scale(1);
    }

    100% {
      transform: scale(0.92);
      box-shadow: 0 3px 3px 3px rgba(0, 0, 0, 0.1);
    }
  }

  &.transfer-target {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate;

    :before {
      display: block;
    }
  }
`;

const StyledTipWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0%;
  top: 0%;
  background-color: #000;
  color: #fff;
  font-size: 3rem;
  line-height: 4rem;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const StyledLeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  flex: 1;
  margin-right: 10px;
  overflow: hidden;
`;

const StyledNameRow = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  overflow: hidden;
`;

const StyledName = styled.h2`
  font-size: 2rem;
  line-height: 2.5rem;
  font-weight: 600;
  white-space: nowrap;
`;

const StyledButtonsColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 50px;
  flex: 0 0 50px;
`;

const StyledBalance = styled.div`
  font-size: 1.9rem;
`;

const Jar = ({
  id,
  name,
  balance,
  state,
  stateChangeHandler,
  deleteHandler,
  editHandler,
  count,
}) => {
  const classes = useStyles();

  const [operationAmount, setOperationAmount] = useState(0);
  const [newName, setNewName] = useState(name);
  const [editingActive, setEditingActive] = useState(false);

  const transferStart = () => {
    stateChangeHandler(1, id);
  };
  const hasChoosen = () => {
    if (state.step !== 1 || state.from.id === id) return;
    stateChangeHandler(2, id);
  };

  const confirmTransfer = () => {
    stateChangeHandler(3, 0, operationAmount);
    setOperationAmount(0);
  };

  const depositStart = () => {
    stateChangeHandler(4, id);
  };

  const confirmDeposit = () => {
    stateChangeHandler(5, 0, operationAmount);
    setOperationAmount(0);
  };

  const withdrawStart = () => {
    stateChangeHandler(6, id);
  };

  const confirmWithdraw = () => {
    stateChangeHandler(7, 0, operationAmount);
    setOperationAmount(0);
  };

  const cancelOperation = () => {
    stateChangeHandler(8);
    setOperationAmount(0);
  };

  const handleEditKeyDown = ({ keyCode }) => {
    if (keyCode === 13) {
      editHandler(id, newName);
      setEditingActive(false);
    } else if (keyCode === 27) {
      setEditingActive(false);
      setNewName(name);
    }
  };

  return (
    <StyledWrapper
      className={cx({
        'transfer-target': state.step === 1 && state.from.id !== id,
      })}
      onClick={hasChoosen}
    >
      <StyledLeftSection>
        <StyledNameRow>
          {!editingActive ? (
            <>
              <IconButton
                width={40}
                onClickHandler={() => {
                  setEditingActive(true);
                }}
              >
                <EditIcon width="100%" height="100%" />
              </IconButton>
              <StyledName>{name}</StyledName>
            </>
          ) : (
            <TextField
              InputProps={{
                classes: {
                  root: classes.textField,
                },
                inputProps: { maxLength: 15 },
              }}
              onKeyDown={handleEditKeyDown}
              type="text"
              value={newName}
              onChange={({ target: { value } }) => setNewName(value)}
            />
          )}
        </StyledNameRow>
        <NumberFormat
          value={balance.toFixed(2)}
          displayType="text"
          thousandSeparator
          prefix="$"
          renderText={(value) => <StyledBalance>{value}</StyledBalance>}
        />
        <IconButton
          width={50}
          disabled={state.step !== 0 || count < 2 || balance !== 0}
          onClickHandler={() => deleteHandler(id)}
        >
          <RemoveIcon width="100%" height="100%" />
        </IconButton>
      </StyledLeftSection>
      <StyledButtonsColumn>
        <IconButton width={55} disabled={state.step !== 0} onClickHandler={depositStart}>
          <DepositIcon width="100%" height="100%" />
        </IconButton>
        <IconButton
          width={55}
          disabled={state.step !== 0 || balance === 0}
          onClickHandler={withdrawStart}
        >
          <WithdrawIcon width="100%" height="100%" />
        </IconButton>
        <IconButton
          width={55}
          disabled={state.step !== 0 || balance === 0}
          onClickHandler={transferStart}
        >
          <TransferIcon width="100%" height="100%" />
        </IconButton>
      </StyledButtonsColumn>
      {state.step === 1 && state.from.id === id && (
        <StyledTipWrapper>Wskaż słoik do transferu</StyledTipWrapper>
      )}
      {state.step === 2 && state.to.id === id && (
        <SliderInput
          label="Podaj kwotę transferu"
          operationAmount={operationAmount}
          setOperationAmount={setOperationAmount}
          max={state.from.balance}
          cancel={cancelOperation}
          confirm={confirmTransfer}
        />
      )}
      {state.step === 4 && state.to.id === id && (
        <SliderInput
          label="Podaj kwotę doładowania"
          operationAmount={operationAmount}
          setOperationAmount={setOperationAmount}
          cancel={cancelOperation}
          confirm={confirmDeposit}
        />
      )}
      {state.step === 6 && state.from.id === id && (
        <SliderInput
          label="Podaj wypłacaną kwotę"
          operationAmount={operationAmount}
          setOperationAmount={setOperationAmount}
          max={balance}
          cancel={cancelOperation}
          confirm={confirmWithdraw}
        />
      )}
    </StyledWrapper>
  );
};

Jar.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  balance: PropTypes.number.isRequired,
  state: PropTypes.shape({
    step: PropTypes.number.isRequired,
    from: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      balance: PropTypes.number.isRequired,
    }),
    to: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      balance: PropTypes.number.isRequired,
    }),
  }).isRequired,
  stateChangeHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  editHandler: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
};

Jar.defaultProps = {
  name: 'Słoik bez nazwy',
};

export default Jar;
