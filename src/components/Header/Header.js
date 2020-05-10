import React, { useState } from 'react';
import PropTypes from 'prop-types';
import HistoryPropsTypes from 'models/History';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import HistoryIcon from '@material-ui/icons/EventNote';
import AddIcon from '@material-ui/icons/Add';
import DepositSplitter from 'components/DepositSplitter/DepositSplitter';
import IconButton from 'components/IconButton/IconButton';
import Modal from 'components/Modal/Modal';
import Table from 'components/Table/Table';

const useStyles = makeStyles({
  button: {
    '&:hover': {
      opacity: 0.5,
    },
  },
  icon: {
    fontSize: '4rem',
    color: '#fff',
  },
});

const StyledWrapper = styled.nav`
  position: fixed;
  left: 0;
  top: 0;
  padding: 20px;
  width: 100%;
  height: 100px;
  background-color: black;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #fff;
`;

const StyledItem = styled.div`
  margin-right: 15px;

  :last-of-type {
    margin-right: 0;
  }

  span {
    margin-left: 5px;
  }
`;

const Header = ({ jars, history }) => {
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);

  const displayHistory = () => {
    setHistoryModalOpen(true);
  };

  const displayDepositWindow = () => {
    setDepositModalOpen(true);
  };

  const getJarNameById = (id) => {
    return jars.find((item) => item.id === id).name;
  };

  const classes = useStyles();

  return (
    <StyledWrapper>
      <StyledItem>
        <IconButton onClickHandler={displayHistory} title="Wyświetl historię" light>
          <HistoryIcon className={classes.icon} />
        </IconButton>
      </StyledItem>
      <StyledItem>
        <IconButton onClickHandler={displayDepositWindow} title="Wpłać środki" light>
          <AddIcon className={classes.icon} />
        </IconButton>
      </StyledItem>
      <Modal
        title="Historia transakcji"
        isOpen={isHistoryModalOpen}
        closeHandler={() => {
          setHistoryModalOpen(false);
        }}
      >
        <Table
          columns={[
            { title: 'Id', field: 'id' },
            { title: 'Data', field: 'date' },
            { title: 'Operacja', field: 'operation' },
            { title: 'Z', field: 'from' },
            { title: 'Do', field: 'to' },
            { title: 'Kwota', field: 'amount' },
            { title: 'Waluta', field: 'currency' },
          ]}
          rows={history.map(({ from, to, currency, amount, ...rest }) => ({
            from: from ? getJarNameById(from) : 'n.d.',
            to: to ? getJarNameById(to) : 'n.d.',
            currency,
            amount: `${amount / 100} ${currency}`,
            ...rest,
          }))}
          itemsToFilter={history.reduce(
            (acc, { from, to }) => [
              ...acc,
              ...(from && !acc.includes(getJarNameById(from)) ? [getJarNameById(from)] : []),
              ...(to && !acc.includes(getJarNameById(to)) ? [getJarNameById(to)] : []),
            ],
            [],
          )}
          keysToFilter={['from', 'to']}
        />
      </Modal>
      <Modal
        title="Rozłóż wpłatę pomiędzy słoiki"
        isOpen={isDepositModalOpen}
        closeHandler={() => {
          setDepositModalOpen(false);
        }}
      >
        <DepositSplitter
          closeHandler={() => {
            setDepositModalOpen(false);
          }}
        />
      </Modal>
    </StyledWrapper>
  );
};

Header.propTypes = {
  jars: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  history: PropTypes.arrayOf(HistoryPropsTypes),
};

Header.defaultProps = {
  jars: [],
  history: [],
};

const mapStateToProps = ({ jars, history }) => {
  return { jars: jars.map(({ id, name }) => ({ id, name })), history };
};

export default connect(mapStateToProps)(Header);
