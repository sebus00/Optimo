import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteAction, editAction } from 'store/actions';
import styled from 'styled-components';
import NumberFormat from 'react-number-format';
import cx from 'classnames';
import { ReactComponent as DepositIcon } from 'assets/icons/deposit.svg';
import { ReactComponent as WithdrawIcon } from 'assets/icons/withdraw.svg';
import { ReactComponent as TransferIcon } from 'assets/icons/transfer.svg';
import { ReactComponent as RemoveIcon } from 'assets/icons/bin.svg';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as HistoryIcon } from 'assets/icons/history.svg';
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
  id,
  name,
  balance,
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
        'transfer-target': state.step === 1 && state.from.id !== id,
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
          rows={[...history].reverse().map(({ date, operation, ...rest }) => ({
            date: new Date(date).toLocaleString(),
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
          prefix="$"
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
        />
      )}
      {state.step === 4 && state.to.id === id && (
        <OperationWindow
          label="Podaj kwotę doładowania"
          operationAmount={operationAmount}
          setOperationAmount={setOperationAmount}
          cancel={cancelOperation}
          confirm={confirmDeposit}
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
        />
      )}
    </StyledWrapper>
  );
};

Jar.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  balance: PropTypes.number.isRequired,
  history: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      date: PropTypes.number.isRequired,
      operation: PropTypes.string.isRequired,
      from: PropTypes.number,
      to: PropTypes.number,
      amount: PropTypes.number.isRequired,
    }),
  ).isRequired,
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
  deleteJar: PropTypes.func.isRequired,
  editJar: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
};

Jar.defaultProps = {
  name: 'Słoik bez nazwy',
};

const mapStateToProps = ({ jars, history }, { id }) => {
  const jar = jars.find((item) => item.id === id);
  return {
    name: jar.name,
    balance: jar.balance,
    history: history.filter(({ from, to }) => [from, to].includes(id)),
    count: jars.length,
  };
};

const mapDispatchToProps = (dispatch) => ({
  deleteJar: (jarId) => dispatch(deleteAction(jarId)),
  editJar: (jarId, newName) => dispatch(editAction(jarId, newName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Jar);
