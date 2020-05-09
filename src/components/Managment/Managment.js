import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { depositAction, withdrawAction, transferAction } from 'store/actions';
import styled from 'styled-components';
import Jar from 'components/Jar/Jar';
import NewJar from 'components/Jar/NewJar';

const StyledWrapper = styled.div`
  padding: 20px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 50px;
`;

const Managment = ({ jars, transferMoney, deposit, withdraw }) => {
  const [state, setState] = useState({ step: 0, from: null, to: null });

  const getJarById = (targetId) => jars.find(({ id }) => id === targetId);
  const restartState = () => {
    setState({ step: 0, from: null, to: null });
  };

  const changeState = (newStep, targetId = 0, ...rest) => {
    switch (newStep) {
      case 0: // no action
        break;
      case 1: // transfer started
        setState({ ...state, step: newStep, from: getJarById(targetId) });
        break;
      case 2: // transfer target choosen
        setState({
          ...state,
          step: newStep,
          to: getJarById(targetId),
        });
        break;
      case 3: // transfer confirmed
        transferMoney(state.from.id, state.to.id, rest[0]);
        restartState();
        break;
      case 4: // deposit started
        setState({ ...state, step: newStep, to: getJarById(targetId) });
        break;
      case 5: // deposit confirmed
        deposit(state.to.id, rest[0]);
        restartState();
        break;
      case 6: // withdrawal started
        setState({
          ...state,
          step: newStep,
          from: getJarById(targetId),
        });
        break;
      case 7: // withdrawal confirmed
        withdraw(state.from.id, rest[0]);
        restartState();
        break;
      case 8:
        restartState();
        break;
      default:
        break;
    }
  };

  return (
    <StyledWrapper>
      <NewJar disabled={state.step !== 0} />
      {jars.map(({ id }) => (
        <Jar id={id} key={id} state={state} stateChangeHandler={changeState} />
      ))}
    </StyledWrapper>
  );
};

Managment.propTypes = {
  jars: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      balance: PropTypes.number,
    }),
  ),
  transferMoney: PropTypes.func.isRequired,
  deposit: PropTypes.func.isRequired,
  withdraw: PropTypes.func.isRequired,
};

Managment.defaultProps = {
  jars: [],
};

const mapStateToProps = ({ jars }) => {
  return { jars };
};

const mapDispatchToProps = (dispatch) => ({
  deposit: (receiverId, amount) => dispatch(depositAction(receiverId, amount)),
  withdraw: (senderId, amount) => dispatch(withdrawAction(senderId, amount)),
  transferMoney: (senderId, receiverId, amount) =>
    dispatch(transferAction(senderId, receiverId, amount)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Managment);
