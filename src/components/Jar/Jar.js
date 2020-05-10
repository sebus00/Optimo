import React, { useState } from 'react';
import PropTypes from 'prop-types';
import JarPropsTypes from 'models/Jar';
import HistoryPropsTypes from 'models/History';
import { connect } from 'react-redux';
import { deleteAction, editAction, changeAction } from 'store/actions';
import styled from 'styled-components';
import NumberFormat from 'react-number-format';
import cx from 'classnames';
import { ReactComponent as DepositIcon } from 'assets/icons/deposit.svg';
import { ReactComponent as WithdrawIcon } from 'assets/icons/withdraw.svg';
import { ReactComponent as TransferIcon } from 'assets/icons/transfer.svg';
import { ReactComponent as RemoveIcon } from 'assets/icons/bin.svg';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as HistoryIcon } from 'assets/icons/history.svg';
import { ReactComponent as ChangeIcon } from 'assets/icons/change.svg';
import OperationWindow from 'components/Jar/OperationWindow';
import IconButton from 'components/IconButton/IconButton';
import TextField from 'components/TextField/TextField';
import Modal from 'components/Modal/Modal';
import Table from 'components/Table/Table';
import Box from '@material-ui/core/Box';

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

const Jar = ({
  jar,
  jar: { id, name, balance, currency },
  history,
  state,
  stateChangeHandler,
  deleteJar,
  editJar,
  count,
}) => {
  const [operationAmount, setOperationAmount] = useState(0);
  const [newName, setNewName] = useState(name);
  const [isEditingActive, setEditingActive] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const transferStart = () => {
    stateChangeHandler(1, jar);
  };
  const hasChoosen = () => {
    if (state.step !== 1 || state.from.id === id || state.from.currency.code !== currency.code)
      return;
    stateChangeHandler(2, jar);
  };

  const confirmTransfer = () => {
    stateChangeHandler(3, 0, operationAmount);
    setOperationAmount(0);
  };

  const depositStart = () => {
    stateChangeHandler(4, jar);
  };

  const confirmDeposit = () => {
    stateChangeHandler(5, 0, operationAmount);
    setOperationAmount(0);
  };

  const withdrawStart = () => {
    stateChangeHandler(6, jar);
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

  return (
    <StyledWrapper
      className={cx({
        'transfer-target':
          state.step === 1 && state.from.id !== id && state.from.currency.code === currency.code,
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
            { title: 'Date', field: 'date' },
            { title: 'Operation', field: 'operation' },
            { title: 'Amount', field: 'amount' },
          ]}
          rows={history.map(({ operation, ...rest }) => ({
            operation:
              operation !== 'TRANSFER'
                ? operation
                : id === rest.from
                ? 'TRANSFER OUT'
                : 'TRANSFER IN',
            ...rest,
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
          value={balance.toFixed(2)}
          displayType="text"
          thousandSeparator
          suffix={` ${currency.code}`}
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
            // onClickHandler={changeCurrencyStart}
            title="Zmień walutę"
          >
            <ChangeIcon width="100%" height="100%" />
          </IconButton>
        </StyledRow>
      </StyledLeftSection>
      <StyledButtonsColumn>
        <IconButton
          width={55}
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
        <StyledTipWrapper>Wskaż słoik do transferu</StyledTipWrapper>
      )}
      {state.step === 2 && state.to.id === id && (
        <OperationWindow
          label="Podaj kwotę transferu"
          operationAmount={operationAmount}
          setOperationAmount={setOperationAmount}
          max={state.from.balance}
          cancel={cancelOperation}
          confirm={confirmTransfer}
          currency={currency.code}
        />
      )}
      {state.step === 4 && state.to.id === id && (
        <OperationWindow
          label="Podaj kwotę doładowania"
          operationAmount={operationAmount}
          setOperationAmount={setOperationAmount}
          cancel={cancelOperation}
          confirm={confirmDeposit}
          currency={currency.code}
        />
      )}
      {state.step === 6 && state.from.id === id && (
        <OperationWindow
          label="Podaj wypłacaną kwotę"
          operationAmount={operationAmount}
          setOperationAmount={setOperationAmount}
          max={balance}
          cancel={cancelOperation}
          confirm={confirmWithdraw}
          currency={currency.code}
        />
      )}
    </StyledWrapper>
  );
};

Jar.propTypes = {
  jar: JarPropsTypes.isRequired,
  history: PropTypes.arrayOf(HistoryPropsTypes),
  state: PropTypes.shape({
    step: PropTypes.number.isRequired,
    from: JarPropsTypes,
    to: JarPropsTypes,
  }).isRequired,
  stateChangeHandler: PropTypes.func.isRequired,
  deleteJar: PropTypes.func.isRequired,
  editJar: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
};

Jar.defaultProps = {
  history: [],
};

const mapStateToProps = ({ jars, history }, { jar: { id } }) => {
  return {
    history: history.filter(({ from, to }) => [from, to].includes(id)),
    count: jars.length,
  };
};

const mapDispatchToProps = (dispatch) => ({
  deleteJar: (jarId) => dispatch(deleteAction(jarId)),
  editJar: (jarId, newName) => dispatch(editAction(jarId, newName)),
  changeCurrency: (jarId, newCurrency) => dispatch(changeAction(jarId, newCurrency)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Jar);
