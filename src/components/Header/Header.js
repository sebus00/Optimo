import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import NumberFormat from 'react-number-format';
import HistoryIcon from '@material-ui/icons/EventNote';
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
    fontSize: '2.5rem',
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
  const totalBalance = jars.reduce((acc, { balance }) => {
    return acc + balance;
  }, 0);

  const [isModalOpen, setModalOpen] = useState(false);

  const displayHistory = () => {
    setModalOpen(true);
  };

  const getJarById = (targetId) => jars.find(({ id }) => id === targetId);

  const classes = useStyles();

  return (
    <StyledWrapper>
      <StyledItem>
        Bilans:
        <NumberFormat
          value={totalBalance.toFixed(2)}
          displayType="text"
          thousandSeparator
          prefix="$"
          renderText={(item) => <span>{item}</span>}
        />
      </StyledItem>
      <StyledItem>
        Ilość słoików:
        <span>{jars.length}</span>
      </StyledItem>
      <StyledItem>
        <IconButton width={50} onClickHandler={displayHistory} title="Wyświetl historię" light>
          <HistoryIcon className={classes.icon} />
        </IconButton>
      </StyledItem>
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
            { title: 'Z', field: 'from' },
            { title: 'Do', field: 'to' },
            { title: 'Amount', field: 'amount' },
          ]}
          rows={history.map(({ from, to, ...rest }) => ({
            from: from ? getJarById(from).name : 'n.d.',
            to: to ? getJarById(to).name : 'n.d.',
            ...rest,
          }))}
        />
      </Modal>
    </StyledWrapper>
  );
};

Header.propTypes = {
  jars: PropTypes.arrayOf(
    PropTypes.shape({
      balance: PropTypes.number,
    }),
  ),
  history: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      date: PropTypes.instanceOf(Date),
      operation: PropTypes.string.isRequired,
      from: PropTypes.number,
      to: PropTypes.number,
      amount: PropTypes.number.isRequired,
    }),
  ),
};

Header.defaultProps = {
  jars: [],
  history: [],
};

const mapStateToProps = ({ jars, history }) => {
  return { jars, history };
};

export default connect(mapStateToProps)(Header);
