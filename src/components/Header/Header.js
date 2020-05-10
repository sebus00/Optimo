import React, { useState } from 'react';
import PropTypes from 'prop-types';
import JarPropsTypes from 'models/Jar';
import HistoryPropsTypes from 'models/History';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
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

// eslint-disable-next-line no-unused-vars
const Header = ({ jars, history }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const displayHistory = () => {
    setModalOpen(true);
  };

  const classes = useStyles();

  return (
    <StyledWrapper>
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
            { title: 'Data', field: 'date' },
            { title: 'Operacja', field: 'operation' },
            { title: 'Z', field: 'from' },
            { title: 'Do', field: 'to' },
            { title: 'Kwota', field: 'amount' },
            { title: 'Waluta', field: 'currency' },
          ]}
          rows={history.map(({ from, to, currency, amount, ...rest }) => ({
            from: from ? from.name : 'n.d.',
            to: to ? to.name : 'n.d.',
            currency: currency.name,
            amount: `${amount} ${currency.code}`,
            ...rest,
          }))}
          itemsToFilter={history.reduce(
            (acc, { from, to }) => [
              ...acc,
              ...(from && !acc.includes(from.name) ? [from.name] : []),
              ...(to && !acc.includes(to.name) ? [to.name] : []),
            ],
            [],
          )}
          keysToFilter={['from', 'to']}
        />
      </Modal>
    </StyledWrapper>
  );
};

Header.propTypes = {
  jars: PropTypes.arrayOf(JarPropsTypes),
  history: PropTypes.arrayOf(HistoryPropsTypes),
};

Header.defaultProps = {
  jars: [],
  history: [],
};

const mapStateToProps = ({ jars, history }) => {
  return { jars, history };
};

export default connect(mapStateToProps)(Header);
