import React, { useState } from 'react';
import PropTypes from 'prop-types';
import JarPropsTypes from 'models/Jar';
import HistoryPropsTypes from 'models/History';
import CurrenciesPropsTypes from 'models/Currency';
import { connect } from 'react-redux';
import {
  deleteAction,
  editAction,
  changeAction,
  depositAction,
  withdrawAction,
} from 'store/actions';
import styled from 'styled-components';
import NumberFormat from 'react-number-format';
import cx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as DepositIcon } from 'assets/icons/deposit.svg';
import { ReactComponent as WithdrawIcon } from 'assets/icons/withdraw.svg';
import { ReactComponent as TransferIcon } from 'assets/icons/transfer.svg';
import { ReactComponent as RemoveIcon } from 'assets/icons/bin.svg';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as HistoryIcon } from 'assets/icons/history.svg';
import { ReactComponent as ChangeIcon } from 'assets/icons/change.svg';
import CloseIcon from '@material-ui/icons/Close';
import OperationWindow from 'components/Jar/OperationWindow';
import IconButton from 'components/IconButton/IconButton';
import TextField from 'components/TextField/TextField';
import Select from 'components/Select/Select';
import Modal from 'components/Modal/Modal';
import Table from 'components/Table/Table';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

const StyledWrapper = styled(Box)`
  width: 100%;
  max-width: 400px;
  height: 200px;
  padding: 10px 15px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  transform: scale(1);
  overflow: hidden;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
  background-color: #fff;

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
    cursor: pointer;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate;
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
  flex-direction: column;
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

const StyledRow = styled.div`
  display: flex;
  align-items: center;
`;

const StyledNameRow = styled(StyledRow)`
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

const StyledSelectWrapper = styled.div`
  position: absolute;
  width: 180px;
  height: 80px;
  background-color: #fff;
  left: 10px;
  bottom: 0;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const useStyles = makeStyles({
  root: {
    marginTop: '5px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.16)',
    },
  },
  text: {
    color: '#fff',
    fontSize: '1.4rem',
  },
});

const Jar = ({
  jar,
  jar: { id, name, balance, currency },
  history,
  currencies,
  state,
  stateChangeHandler,
  deleteJar,
  editJar,
  changeCurrency,
  deposit,
  withdraw,
  count,
}) => {
  const [operationAmount, setOperationAmount] = useState(0);
  const [isEditingActive, setEditingActive] = useState(false);
  const [newName, setNewName] = useState(name);
  const [isWithdrawActive, setWithdrawActive] = useState(false);
  const [isDepositActive, setDepositActive] = useState(false);
  const [isChangeCurrencyActive, setChangeCurrencyActive] = useState(false);
  const [newCurrency, setNewCurrency] = useState(currency);
  const [isModalOpen, setModalOpen] = useState(false);

  const transferStart = () => {
    stateChangeHandler(1, jar);
  };
  const hasChoosen = () => {
    if (state.step !== 1 || state.from.id === id || state.from.currency !== currency) return;
    stateChangeHandler(2, jar);
  };

  const confirmTransfer = () => {
    stateChangeHandler(3, 0, operationAmount);
    setOperationAmount(0);
  };

  const endOperation = () => {
    stateChangeHandler(5);
    setWithdrawActive(false);
    setDepositActive(false);
    setChangeCurrencyActive(false);
    setOperationAmount(0);
  };

  const depositStart = () => {
    stateChangeHandler(4);
    setDepositActive(true);
  };

  const confirmDeposit = () => {
    deposit(jar.id, operationAmount, jar.currency);
    endOperation();
  };

  const withdrawStart = () => {
    stateChangeHandler(4);
    setWithdrawActive(true);
  };

  const confirmWithdraw = () => {
    withdraw(jar.id, operationAmount, jar.currency);
    endOperation();
  };

  const startChangeCurrency = () => {
    stateChangeHandler(4);
    setChangeCurrencyActive(true);
  };

  const confirmChangeCurrency = (value) => {
    setNewCurrency(value);
    changeCurrency(id, value);
    endOperation();
  };

  const handleEditKeyDown = ({ keyCode }) => {
    if (keyCode === 13) {
      editJar(id, newName);
      setEditingActive(false);
    } else if (keyCode === 27) {
      setEditingActive(false);
      setNewName(name);
    }
  };

  const displayHistory = () => {
    setModalOpen(true);
  };

  const classes = useStyles();

  return (
    <StyledWrapper
      className={cx({
        'transfer-target':
          state.step === 1 && state.from.id !== id && state.from.currency === currency,
      })}
      onClick={hasChoosen}
    >
      <Modal
        title="Historia transakcji"
        isOpen={isModalOpen}
        closeHandler={() => {
          setModalOpen(false);
        }}
      >
        <Table
          columns={[
            { title: 'Id', field: 'id' },
            { title: 'Data', field: 'date' },
            { title: 'Operacja', field: 'operation' },
            { title: 'Kwota', field: 'amount' },
            { title: 'Waluta', field: 'currency' },
          ]}
          rows={history.map(({ operation, ...rest }) => ({
            operation:
              operation !== 'TRANSFER'
                ? operation
                : id === rest.from
                ? 'TRANSFER OUT'
                : 'TRANSFER IN',
            ...rest,
            amount: `${rest.amount / 100} ${rest.currency}`,
            currency: rest.currency,
          }))}
        />
      </Modal>
      <StyledLeftSection>
        <StyledNameRow>
          {!isEditingActive ? (
            <>
              <IconButton
                width={40}
                onClickHandler={() => {
                  setEditingActive(true);
                }}
                title="Edytuj"
              >
                <EditIcon width="100%" height="100%" />
              </IconButton>
              <StyledName>{name}</StyledName>
            </>
          ) : (
            <TextField
              value={newName}
              keyDownHandler={handleEditKeyDown}
              changeHandler={({ target: { value } }) => setNewName(value)}
              inputProps={{
                type: 'text',
                maxLength: 15,
              }}
              large
            />
          )}
        </StyledNameRow>
        <NumberFormat
          value={(balance / 100).toFixed(2)}
          displayType="text"
          thousandSeparator
          suffix={` ${currency}`}
          renderText={(value) => <StyledBalance>{value}</StyledBalance>}
        />
        <StyledRow>
          <IconButton
            width={50}
            disabled={state.step !== 0 || count < 2 || balance !== 0}
            onClickHandler={() => deleteJar(id)}
            title="Usuń"
          >
            <RemoveIcon width="100%" height="100%" />
          </IconButton>
          <IconButton
            width={50}
            disabled={state.step !== 0}
            onClickHandler={displayHistory}
            title="Wyświetl historię"
          >
            <HistoryIcon width="100%" height="100%" />
          </IconButton>
          <IconButton
            width={50}
            disabled={state.step !== 0 || balance !== 0}
            onClickHandler={startChangeCurrency}
            title="Zmień walutę"
          >
            <ChangeIcon width="100%" height="100%" />
          </IconButton>
        </StyledRow>
      </StyledLeftSection>
      <StyledButtonsColumn>
        <IconButton
          width={60}
          disabled={state.step !== 0}
          onClickHandler={depositStart}
          title="Zdeponuj"
        >
          <DepositIcon width="100%" height="100%" />
        </IconButton>
        <IconButton
          width={55}
          disabled={state.step !== 0 || balance === 0}
          onClickHandler={withdrawStart}
          title="Wypłać"
        >
          <WithdrawIcon width="100%" height="100%" />
        </IconButton>
        <IconButton
          width={55}
          disabled={state.step !== 0 || balance === 0}
          onClickHandler={transferStart}
          title="Przetransferuj"
        >
          <TransferIcon width="100%" height="100%" />
        </IconButton>
      </StyledButtonsColumn>
      {state.step === 1 && state.from.id === id && (
        <StyledTipWrapper>
          <div>Wskaż słoik do transferu</div>
          <Button
            size="large"
            onClick={endOperation}
            classes={{
              root: classes.root,
              text: classes.text,
            }}
          >
            Anuluj
          </Button>
        </StyledTipWrapper>
      )}
      {state.step === 2 && state.to.id === id && (
        <OperationWindow
          label="Podaj kwotę transferu"
          operationAmount={operationAmount}
          setOperationAmount={setOperationAmount}
          max={state.from.balance}
          cancel={endOperation}
          confirm={confirmTransfer}
          currency={currency}
        />
      )}
      {state.step === 4 && isDepositActive && (
        <OperationWindow
          label="Podaj kwotę doładowania"
          operationAmount={operationAmount}
          setOperationAmount={setOperationAmount}
          cancel={endOperation}
          confirm={confirmDeposit}
          currency={currency}
        />
      )}
      {state.step === 4 && isWithdrawActive && (
        <OperationWindow
          label="Podaj wypłacaną kwotę"
          operationAmount={operationAmount}
          setOperationAmount={setOperationAmount}
          max={balance}
          cancel={endOperation}
          confirm={confirmWithdraw}
          currency={currency}
        />
      )}
      {state.step === 4 && isChangeCurrencyActive && (
        <StyledSelectWrapper>
          <Select
            label="waluta"
            helperText="Wybierz walutę"
            value={newCurrency}
            changeHandler={({ target: { value } }) => confirmChangeCurrency(value)}
            items={currencies.map((item) => ({ name: item.name, value: item.code }))}
          />
          <IconButton width={55} onClickHandler={endOperation} title="Anuluj">
            <CloseIcon width="100%" height="100%" />
          </IconButton>
        </StyledSelectWrapper>
      )}
    </StyledWrapper>
  );
};

Jar.propTypes = {
  jar: JarPropsTypes.isRequired,
  history: PropTypes.arrayOf(HistoryPropsTypes),
  currencies: PropTypes.arrayOf(CurrenciesPropsTypes),
  state: PropTypes.shape({
    step: PropTypes.number.isRequired,
    from: JarPropsTypes,
    to: JarPropsTypes,
  }).isRequired,
  stateChangeHandler: PropTypes.func.isRequired,
  deleteJar: PropTypes.func.isRequired,
  editJar: PropTypes.func.isRequired,
  changeCurrency: PropTypes.func.isRequired,
  deposit: PropTypes.func.isRequired,
  withdraw: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
};

Jar.defaultProps = {
  history: [],
  currencies: [],
};

const mapStateToProps = ({ jars, history, currencies }, { jar: { id } }) => {
  return {
    history: history.filter(({ from, to }) =>
      [...(from ? [from] : []), ...(to ? [to] : [])].includes(id),
    ),
    currencies,
    count: jars.length,
  };
};

const mapDispatchToProps = (dispatch) => ({
  deleteJar: (jarId) => dispatch(deleteAction(jarId)),
  editJar: (jarId, newName) => dispatch(editAction(jarId, newName)),
  changeCurrency: (jarId, newCurrencyCode) => dispatch(changeAction(jarId, newCurrencyCode)),
  deposit: (to, amount, currency) => dispatch(depositAction(to, amount, currency)),
  withdraw: (from, amount, currency) => dispatch(withdrawAction(from, amount, currency)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Jar);
